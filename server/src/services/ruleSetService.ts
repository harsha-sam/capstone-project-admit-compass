import prisma from "../utils/prismaClient";

interface Rule {
  attribute: string;
  operator: string;
  value_1: any;
  weight: number;
  is_required: boolean;
  display_order: number;
  logical_group?: LogicalGroup;
  ruleset_id: number
}

interface LogicalGroup {
  logic_operator: "AND" | "OR";
  extra_weight?: number;
  weight_penalty?: number;
  rules: Rule[];
}

/**
 * Parse and create rules and logical groups recursively.
 * @param rules Array of rules or logical groups from the payload.
 * @param parentGroupId ID of the parent logical group, if any.
 * @param rulesetId ID of the ruleset being created.
 */
export const parseAndCreateRuleset = async (
  rules: Rule[],
  parentGroupId: number | null,
  rulesetId: number
): Promise<void> => {
  for (const rule of rules) {
    if (rule.logical_group) {
      // Handle logical group creation
      const logicalGroup = await prisma.logicalGroup.create({
        data: {
          logic_operator: rule.logical_group.logic_operator,
          extra_weight: rule.logical_group.extra_weight || 0,
          weight_penalty: rule.logical_group.weight_penalty || 0,
          parent_logic_group_id: parentGroupId,
          ruleset_id: rulesetId,
        },
      });

      // Recursively create nested rules/groups
      await parseAndCreateRuleset(
        rule.logical_group.rules,
        logicalGroup.logic_group_id,
        rulesetId
      );
    } else {
      // Handle rule creation
      await prisma.rule.create({
        data: {
          attribute: rule.attribute,
          operator: rule.operator,
          value_1: rule.value_1,
          weight: rule.weight,
          display_order: rule.display_order,
          is_required: rule.is_required || false,
          logic_group_id: parentGroupId,
          ruleset_id: rulesetId,
        },
      });
    }
  }
};

/**
 * Calculate the maximum possible weight for the ruleset based on its rules and logical groups.
 * @param rules Array of rules or logical groups from the payload.
 * @returns Maximum possible weight for the ruleset.
 */
export const calculateMaxWeight = async (rules: Rule[]): Promise<number> => {
  const calculateGroupWeight = async (group: LogicalGroup): Promise<number> => {
    let groupWeight = 0;

    // Process rules in the group
    const ruleWeights = await Promise.all(
      group.rules.map(async (rule) => {
        if (rule.logical_group) {
          // Recurse into nested logical groups
          return calculateGroupWeight(rule.logical_group);
        } else {
          return rule.weight || 0;
        }
      })
    );

    // Evaluate weight based on the operator
    if (group.logic_operator === "AND") {
      groupWeight += ruleWeights.reduce((sum, w) => sum + w, 0); // Sum all weights
    } else if (group.logic_operator === "OR") {
      groupWeight += Math.max(...ruleWeights, 0); // Take the maximum weight
    } else if (group.logic_operator === "XOR") {
      groupWeight += ruleWeights.length === 1 ? ruleWeights[0] : 0; // XOR logic
    }

    // Apply extra weight and penalty
    groupWeight += group.extra_weight || 0;

    return groupWeight;
  };

  // Handle top-level rules and groups
  let totalWeight = 0;
  for (const rule of rules) {
    if (rule.logical_group) {
      totalWeight += await calculateGroupWeight(rule.logical_group);
    } else {
      totalWeight += rule.weight || 0;
    }
  }

  return totalWeight;
};

/**
 * Recursively format logical groups and their associated rules into the desired structure.
 */
const formatLogicalGroup = async (
  group: any,
  allGroups: any[],
  allRules: any[]
): Promise<any> => {
  return {
    logical_group: {
      logic_operator: group.logic_operator,
      extra_weight: group.extra_weight || 0,
      weight_penalty: group.weight_penalty || 0,
      rules: [
        // Include all rules associated with this logical group
        ...allRules
          .filter((rule) => rule.logic_group_id === group.logic_group_id)
          .map((rule) => ({
            rule_id: rule.rule_id,
            attribute: rule.attribute,
            operator: rule.operator,
            value_1: rule.value_1,
            weight: rule.weight,
            is_required: rule.is_required,
            display_order: rule.display_order,
          })),
        // Recursively process nested logical groups
        ...(await Promise.all(
          allGroups
            .filter(
              (nestedGroup) =>
                nestedGroup.parent_logic_group_id === group.logic_group_id
            )
            .map((nestedGroup) =>
              formatLogicalGroup(nestedGroup, allGroups, allRules)
            )
        )),
      ],
    },
  };
};

/**
 * Fetch and format a ruleset, including its rules and logical groups, for UI consumption.
 */
export const getRuleset = async (rulesetId: number) => {
  // Fetch the ruleset with associated logical groups and rules
  const ruleset = await prisma.ruleset.findUnique({
    where: { ruleset_id: rulesetId },
    include: {
      logical_groups: true,
      rules: true,
    },
  });

  if (!ruleset) {
    throw new Error(`Ruleset with ID ${rulesetId} not found.`);
  }

  // Format the rules into a flat array combining top-level rules and logical groups
  const formattedRules = [
    // Include top-level rules (rules not part of any logical group)
    ...ruleset.rules
      .filter((rule) => !rule.logic_group_id)
      .map((rule) => ({
        rule_id: rule.rule_id,
        attribute: rule.attribute,
        operator: rule.operator,
        value_1: rule.value_1,
        weight: rule.weight,
        is_required: rule.is_required,
        display_order: rule.display_order,
      })),
    // Include top-level logical groups (those without a parent group)
    ...(await Promise.all(
      ruleset.logical_groups
        .filter((group) => group.parent_logic_group_id === null)
        .map((group) =>
          formatLogicalGroup(group, ruleset.logical_groups, ruleset.rules)
        )
    )),
  ];

  // Return the formatted ruleset
  return {
    ruleset_id: ruleset.ruleset_id,
    name: ruleset.name,
    max_weight: ruleset.max_weight,
    rules: formattedRules, // Formatted rules and logical groups
  };
};


/**
 * Update a ruleset's metadata or associated rules/logical groups.
 * Supports partial updates.
 */
export const updateRuleset = async (
  rulesetId: number,
  updates: Partial<{
    name: string;
    rules: any[];
    logical_groups: any[];
  }>
) => {
  return await prisma.$transaction(async (prisma) => {
    // Fetch existing ruleset
    const existingRuleset = await prisma.ruleset.findUnique({
      where: { ruleset_id: rulesetId },
      include: { logical_groups: { include: { rules: true } } },
    });

    if (!existingRuleset) {
      throw new Error(`Ruleset with ID ${rulesetId} does not exist.`);
    }

    // Update ruleset metadata
    if (updates.name) {
      await prisma.ruleset.update({
        where: { ruleset_id: rulesetId },
        data: { name: updates.name },
      });
    }

    // Handle rules and logical groups updates
    if (updates.rules) {
      // Delete all existing rules
      await prisma.rule.deleteMany({
        where: { ruleset_id: rulesetId },
      });

      // Delete associated logical groups
      await prisma.logicalGroup.deleteMany({
        where: { ruleset_id: rulesetId },
      });

      // Recreate the rules and logical groups
      await parseAndCreateRuleset(updates.rules, null, rulesetId);
    }

    return prisma.ruleset.findUnique({
      where: { ruleset_id: rulesetId },
      include: { logical_groups: true },
    });
  });
};

export const deleteRuleset = async (rulesetId: number) => {
  return await prisma.$transaction(async (prisma) => {
    // Check if the ruleset exists
    const ruleset = await prisma.ruleset.findUnique({
      where: { ruleset_id: rulesetId },
    });

    if (!ruleset) {
      throw new Error(`Ruleset with ID ${rulesetId} does not exist.`);
    }

    // Delete all associated rules
    await prisma.rule.deleteMany({
      where: { ruleset_id: rulesetId },
    });

    // Delete associated logical groups
    await prisma.logicalGroup.deleteMany({
      where: { ruleset_id: rulesetId },
    });

    // Delete the ruleset
    await prisma.ruleset.delete({
      where: { ruleset_id: rulesetId },
    });

    return { message: `Ruleset ${rulesetId} and all associated data have been deleted successfully.` };
  });
};


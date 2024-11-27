import prisma from "../utils/prismaClient";

/**
 * Create a single rule within a logical group.
 */
export const createRule = async (
  attribute: string,
  operator: string,
  value1: any,
  weight: number,
  isRequired: boolean,
  displayOrder: number,
  rulesetId: number,
  logicGroupId: number | null,
  prompt: string | null,
) => {
  return prisma.rule.create({
    data: {
      attribute,
      operator,
      value_1: value1,
      prompt,
      weight,
      is_required: isRequired,
      display_order: displayOrder,
      logic_group_id: logicGroupId,
      ruleset_id: rulesetId, 
    },
  });
};

/**
 * Fetch a rule by ID.
 */
export const getRule = async (ruleId: number) => {
  return prisma.rule.findUnique({
    where: { rule_id: ruleId },
  });
};

/**
 * Update an existing rule.
 */
export const updateRule = async (
  ruleId: number,
  updates: Partial<{
    attribute: string,
    operator: string,
    value1: any,
    prompt: string,
    weight: number,
    isRequired: boolean,
    rulesetId: number,
    displayOrder: number,
    logicGroupId: number | null
  }>
) => {
  return prisma.rule.update({
    where: { rule_id: ruleId },
    data: updates,
  });
};
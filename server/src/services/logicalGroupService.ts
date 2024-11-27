import prisma from "../utils/prismaClient";

/**
 * Create a logical group with optional extra weight and penalty.
 */
export const createLogicalGroup = async (
  logicOperator: string,
  rulesetId: number,
  parentLogicGroupId: number | null,
  extraWeight: number = 0,
  weightPenalty: number = 0
) => {
  return prisma.logicalGroup.create({
    data: {
      logic_operator: logicOperator,
      ruleset_id: rulesetId,
      parent_logic_group_id: parentLogicGroupId,
      extra_weight: extraWeight,
      weight_penalty: weightPenalty,
    },
  });
};

/**
 * Fetch a logical group and its associated rules.
 */
export const getLogicalGroup = async (logicGroupId: number) => {
  return prisma.logicalGroup.findUnique({
    where: { logic_group_id: logicGroupId },
    include: { rules: true },
  });
};

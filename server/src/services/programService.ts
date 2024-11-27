import prisma from "../utils/prismaClient";
/**
 * Fetch user-input rules for a program.
 */
export const getInputRulesForProgram = async (programId: number) => {
  
  // Fetch the program, including rubric_rulesets and their associated rules, sorted by display_order
  const program = await prisma.program.findUnique({
    where: { program_id: programId },
    include: {
      rubric: {
        include: {
          rubric_rulesets: {
            include: {
              Ruleset: {
                include: {
                  rules: true, // Include all rules directly on the ruleset
                },
              },
            },
          },
        },
      },
    },
  });

  // Handle case where program or rubric is not found
  if (!program || !program.rubric) {
    throw new Error(`Program with ID ${programId} or its rubric is not found.`);
  }

  // Extract rules directly from the rulesets
  const allRules = program.rubric.rubric_rulesets.flatMap((rubricRuleset) =>
    rubricRuleset.Ruleset.rules || []
  );

  // Filter out backend-only rules (e.g., those with "AI Analysis") and map to required format
  const filteredRules = allRules
    .filter((rule) => rule.operator !== "AI Analysis") // Exclude backend-only rules
    .map((rule) => ({
      rule_id: rule.rule_id,
      attribute: rule.attribute,
      operator: rule.operator,
      value_1: rule.value_1,
      is_required: rule.is_required,
      display_order: rule.display_order,
    }))
    .sort((a, b) => a.display_order - b.display_order); // Sort by display order

  return {
    program_id: program.program_id,
    program_name: program.name,
    rules: filteredRules,
  };
};



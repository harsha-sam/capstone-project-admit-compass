import { Request, Response } from "express";
import prisma from "../utils/prismaClient";

// Create a Rubric with Rulesets
export const createRubric = async (req: Request, res: Response) => {
  const { name, attachment_types=[], requirements={}, rulesets } = req.body;

  try {
    // Validate that rulesets are provided
    if (!name || !rulesets || rulesets.length === 0) {
      return res.status(400).json({ error: "At least one ruleset must be provided." });
    }

    // Fetch the rulesets to ensure they exist and calculate their total max_weight
    const validRulesets = await prisma.ruleset.findMany({
      where: { ruleset_id: { in: rulesets } },
      select: { ruleset_id: true, max_weight: true },
    });

    if (validRulesets.length !== rulesets.length) {
      return res.status(400).json({ error: "One or more provided rulesets are invalid." });
    }

    // Calculate the total max_weight from the associated rulesets
    const totalMaxWeight = validRulesets.reduce((sum, ruleset) => sum + ruleset.max_weight, 0);

    // Create the rubric
    const rubric = await prisma.rubric.create({
      data: {
        name,
        max_weight: totalMaxWeight, // Use calculated max_weight
        attachment_types,
        requirements,
        rubric_rulesets: {
          create: validRulesets.map((ruleset) => ({
            ruleset_id: ruleset.ruleset_id,
          })),
        },
      },
      include: {
        rubric_rulesets: {
          include: { Ruleset: true }, // Include associated rulesets in the response
        },
      },
    });

    res.status(201).json(rubric);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create rubric with rulesets." });
  }
};

export const getRubric = async (req: Request, res: Response) => {
  const { rubricId } = req.params;

  try {
    const rubric = await prisma.rubric.findUnique({
      where: { rubric_id: parseInt(rubricId) },
      include: {
        rubric_rulesets: {
          include: { Ruleset: true },
        },
        programs: true, // Include associated programs
      },
    });

    if (!rubric) {
      return res.status(404).json({ error: "Rubric not found." });
    }

    res.json(rubric);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch rubric." });
  }
};

export const patchRubric = async (req: Request, res: Response) => {
  const { rubricId } = req.params;
  const { name, attachment_types, requirements, rulesets } = req.body;

  try {
    // Fetch the current rubric
    const rubric = await prisma.rubric.findUnique({
      where: { rubric_id: parseInt(rubricId) },
    });

    if (!rubric) {
      return res.status(404).json({ error: "Rubric not found." });
    }

    // Validate rulesets if provided
    let totalMaxWeight = rubric.max_weight; // Keep the current weight by default
    if (rulesets && rulesets.length > 0) {
      const validRulesets = await prisma.ruleset.findMany({
        where: { ruleset_id: { in: rulesets } },
        select: { ruleset_id: true, max_weight: true },
      });

      if (validRulesets.length !== rulesets.length) {
        return res.status(400).json({ error: "One or more provided rulesets are invalid." });
      }

      // Calculate the new total max_weight
      totalMaxWeight = validRulesets.reduce((sum, ruleset) => sum + ruleset.max_weight, 0);

      // Update the rubric-ruleset associations
      await prisma.rubricRuleset.deleteMany({ where: { rubric_id: parseInt(rubricId) } });
      await prisma.rubricRuleset.createMany({
        data: validRulesets.map((ruleset) => ({
          rubric_id: parseInt(rubricId),
          ruleset_id: ruleset.ruleset_id,
        })),
      });
    }

    // Update the rubric details
    const updatedRubric = await prisma.rubric.update({
      where: { rubric_id: parseInt(rubricId) },
      data: {
        name,
        attachment_types,
        requirements,
        max_weight: totalMaxWeight,
      },
      include: {
        rubric_rulesets: { include: { Ruleset: true } },
      },
    });

    res.json(updatedRubric);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update rubric." });
  }
};

export const deleteRubric = async (req: Request, res: Response) => {
  const { rubricId } = req.params;

  try {
    // Check if the rubric exists
    const rubric = await prisma.rubric.findUnique({
      where: { rubric_id: parseInt(rubricId) },
    });

    if (!rubric) {
      return res.status(404).json({ error: "Rubric not found." });
    }

    // Delete associated rubric-ruleset relationships
    await prisma.rubricRuleset.deleteMany({
      where: { rubric_id: parseInt(rubricId) },
    });

    // Delete the rubric itself
    await prisma.rubric.delete({
      where: { rubric_id: parseInt(rubricId) },
    });

    res.json({ message: "Rubric deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete rubric." });
  }
};
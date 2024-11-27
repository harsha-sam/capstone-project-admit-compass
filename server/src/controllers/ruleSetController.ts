import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import { parseAndCreateRuleset, calculateMaxWeight, updateRuleset, deleteRuleset, getRuleset } from "../services/ruleSetService";

export const createRulesetController = async (req: Request, res: Response) => {
  const { name, rules } = req.body;

  try {
    if (!name || !rules) {
      return res.status(400).json({ error: "Missing required fields: name or rules." });
    }

    // Create the Ruleset
    const ruleset = await prisma.ruleset.create({
      data: { name, max_weight: 0 },
    });

    // Parse and create rules and groups
    await parseAndCreateRuleset(rules, null, ruleset.ruleset_id);

    // Calculate max weight
    const maxWeight = await calculateMaxWeight(rules);

    // Update ruleset with max weight
    const updatedRuleset = await prisma.ruleset.update({
      where: { ruleset_id: ruleset.ruleset_id },
      data: { max_weight: maxWeight },
    });

    res.status(201).json(updatedRuleset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create ruleset." });
  }
};

export const updateRulesetController = async (req: Request, res: Response) => {
  const { rulesetId } = req.params;
  const updates = req.body;

  try {
    // Validate payload
    if (!updates.name && !updates.rules) {
      return res
        .status(400)
        .json({ error: "Provide at least 'name' or 'rules' to update the ruleset." });
    }

    const updatedRuleset = await updateRuleset(Number(rulesetId), updates);

    res.status(200).json(updatedRuleset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update ruleset." });
  }
};

export const deleteRulesetController = async (req: Request, res: Response) => {
  const { rulesetId } = req.params;

  try {
    const result = await deleteRuleset(Number(rulesetId));
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete ruleset." });
  }
};

export const getRulesetController = async (req: Request, res: Response) => {
  const { rulesetId } = req.params;


  try {
    const ruleset = await getRuleset(Number(rulesetId));
    res.status(200).json(ruleset);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Failed to get ruleset." });
  }
};
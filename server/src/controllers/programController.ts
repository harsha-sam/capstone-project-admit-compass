import { Request, Response } from 'express';
import prisma from '../utils/prismaClient';
import { ProgramCategory } from '@prisma/client';
import { getInputRulesForProgram } from '../services/programService';

export const getProgramsController = async (req: Request, res: Response) => {
  const { category }: { category?: ProgramCategory} = req.query;

  try {
    const programs = await prisma.program.findMany({
      where: category ? { program_category: category } : undefined,
      orderBy: { name: 'asc' },
    });

    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
};

export const getProgramByIdController = async (req: Request, res: Response) => {
  const { programId } = req.params;

  try {
    const program = await prisma.program.findUnique({
      where: { program_id: parseInt(programId, 10) },
      include: { rubric: true },
    });

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    res.json(program);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch program details' });
  }
};

export const createProgramController = async (req: Request, res: Response) => {
  const { name, description, program_category, program_type, umbc_link } = req.body;

  // Validate required fields
  if (!name || !program_category || !program_type) {
    return res.status(400).json({ error: 'Missing required fields: name, program_category, program_type' });
  }

  try {
    // Create the program
    const program = await prisma.program.create({
      data: {
        name,
        description,
        program_category, // This should match the enum values defined in the schema
        program_type,
        umbc_link,
      },
    });

    res.status(201).json(program);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const patchProgramController = async (req: Request, res: Response) => {
  const { programId } = req.params;
  const { name, description, program_category, program_type, umbc_link, rubric_id } = req.body;

  try {
    // Check if the program exists
    const program = await prisma.program.findUnique({
      where: { program_id: parseInt(programId, 10) },
    });

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    // If a rubric_id is provided, validate its existence
    if (rubric_id) {
      const rubric = await prisma.rubric.findUnique({
        where: { rubric_id: rubric_id },
      });

      if (!rubric) {
        return res.status(404).json({ error: 'Rubric not found' });
      }
    }

    // Update the program with provided fields
    const updatedProgram = await prisma.program.update({
      where: { program_id: parseInt(programId, 10) },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(program_category && { program_category }),
        ...(program_type && { program_type }),
        ...(umbc_link && { umbc_link }),
        ...(rubric_id && { rubric_id }),
      },
    });

    res.json(updatedProgram);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update program' });
  }
};

export const deleteProgramController = async (req: Request, res: Response) => {
  const { programId } = req.params;

  try {
    // Check if the program exists
    const program = await prisma.program.findUnique({
      where: { program_id: parseInt(programId, 10) },
    });

    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    // Delete the program
    await prisma.program.delete({
      where: { program_id: parseInt(programId, 10) },
    });

    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete program' });
  }
};

/**
 * Controller to fetch student input rules for a program.
 */
export const getInputRulesForProgramController = async (
  req: Request,
  res: Response
) => {
  const { programId } = req.params;

  try {
    const rules = await getInputRulesForProgram(Number(programId));
    res.status(200).json(rules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fetching fields failed" });
  }
};
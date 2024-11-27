import express from 'express';
import { getProgramsController, createProgramController, getProgramByIdController, patchProgramController, getInputRulesForProgramController } from '../controllers/programController';

const router = express.Router();

router.get('/', getProgramsController);
router.get('/:programId', getProgramByIdController);
router.post('/', createProgramController);
router.patch('/:programId', patchProgramController)
router.get('/:programId/rules', getInputRulesForProgramController);

export default router;

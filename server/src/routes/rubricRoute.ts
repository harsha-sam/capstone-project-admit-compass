import express from 'express';
import { createRubric, getRubric, patchRubric, deleteRubric } from '../controllers/rubricController';

const router = express.Router();

router.get('/:programId', getRubric);
router.post('/', createRubric);
router.patch('/:programId', patchRubric);
router.delete('/:programId', deleteRubric);

export default router;

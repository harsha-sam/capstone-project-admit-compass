import express from 'express';
import { createRulesetController, deleteRulesetController, getRulesetController, updateRulesetController } from '../controllers/ruleSetController';

const router = express.Router();

router.post('/', createRulesetController);
router.get('/:rulesetId', getRulesetController)
router.patch('/:rulesetId', updateRulesetController)
router.delete('/:rulesetId', deleteRulesetController)

export default router;

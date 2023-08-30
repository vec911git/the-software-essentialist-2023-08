import express from 'express';
import { createUser, editUser, getUserByEmail } from '../controllers/userController';

const router = express.Router();

router.post('/new', createUser);
router.post('/edit/:userId', editUser);
router.get('/', getUserByEmail);

export default router;

import express from 'express';
import { body, param, query } from 'express-validator';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', userController.getHome);
router.get('/users', userController.getAllUsers);
router.get('/user/:user_id', [
  param('user_id').isInt().withMessage('User ID must be an integer'),
], userController.getUserById);
router.post('/users', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], userController.createUser);
router.put('/user/:user_id', [
  param('user_id').isInt().withMessage('User ID must be an integer'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
], userController.updateUser);
router.delete('/user/:user_id', [
  param('user_id').isInt().withMessage('User ID must be an integer'),
], userController.deleteUser);
router.get('/search', [
  query('name').notEmpty().withMessage('Name is required'),
], userController.searchUsers);
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], userController.login);

export default router; 
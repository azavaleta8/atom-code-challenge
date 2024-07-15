import express, { Router } from 'express';
import { asyncHandler, authenticateJWT } from '../../middlewares';
import { createTaskController } from './taskController';

export const taskRouter: Router = express.Router();

/**
 * @swagger
 * /api/tasks/user/{id}:
 *   get:
 *     summary: Get all tasks for a user
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of tasks
 */
// taskRouter.get('/tasks/user/:id', asyncHandler(getTasksController));

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - title
 *               - description
 *               - completed
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user who owns the task
 *                 example: OZvikOJIZpHnqFUlcNb9
 *               title:
 *                 type: string
 *                 description: Title of the task
 *               description:
 *                 type: string
 *                 description: Detailed description of the task
 *               completed:
 *                 type: boolean
 *                 description: Whether the task is completed or not
 *     responses:
 *       201:
 *         description: Task successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 payload:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The task ID
 *                       example: 5OqxFVFZdcsN7BNXKhyL
 *                     userId:
 *                       type: string
 *                       description: ID of the user who owns the task
 *                       example: user123
 *                     title:
 *                       type: string
 *                       description: Title of the task
 *                       example: Complete project report
 *                     description:
 *                       type: string
 *                       description: Detailed description of the task
 *                       example: Write and submit the final project report by Friday
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the task was created
 *                       example: 2024-07-15T07:14:39.821Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the task was last updated
 *                       example: 2024-07-15T07:14:39.821Z
 *                     completed:
 *                       type: boolean
 *                       description: Whether the task is completed or not
 *                       example: false
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: "User not authenticated"
 *       422:
 *         description: Invalid input format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 422
 *                 error:
 *                   type: string
 *                   example: "Invalid Format"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
taskRouter.post('/tasks', authenticateJWT ,asyncHandler(createTaskController));

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   put:
 *     summary: Update an existing task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdate'
 *     responses:
 *       200:
 *         description: Task updated successfully
 */
// taskRouter.put('/tasks/:taskId', asyncHandler(updateTaskController));

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete an existing task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
// taskRouter.delete('/tasks/:taskId', asyncHandler(deleteTaskController));
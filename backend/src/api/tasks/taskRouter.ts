import express, { Router } from 'express';
import { asyncHandler, authenticateJWT } from '../../middlewares';
import { createTaskController, deleteTaskController, getTaskByUserIdController } from './taskController';

export const taskRouter: Router = express.Router();

/**
 * @swagger
 * /api/tasks/users/{userId}:
 *   get:
 *     summary: Get all tasks for a user
 *     tags:
 *       - Tasks
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Status code
 *                   example: 200
 *                 payload:
 *                   type: array
 *                   description: List of task objects
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The task ID
 *                         example: 2SPVXxL5qwQFy9F8jkAv
 *                       userId:
 *                         type: string
 *                         description: The user ID
 *                         example: OZvikOJIZpHnqFUlcNb9
 *                       title:
 *                         type: string
 *                         description: Title of the task
 *                         example: Title
 *                       description:
 *                         type: string
 *                         description: description of the task
 *                         example: Description
 *                       completed:
 *                         type: boolean
 *                         description: Describres task as completed
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         description: Date of creation
 *                         example: 2024-07-15T07:39:37.350Z
 *                       updatedAt:
 *                         type: string
 *                         description: Date of update
 *                         example: 2024-07-15T07:39:37.350Z
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
taskRouter.get('/tasks/users/:userId',authenticateJWT ,asyncHandler(getTaskByUserIdController));

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
taskRouter.post('/tasks',authenticateJWT ,asyncHandler(createTaskController));

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
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Task successfully deleted"
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
taskRouter.delete('/tasks/:taskId',authenticateJWT ,asyncHandler(deleteTaskController));
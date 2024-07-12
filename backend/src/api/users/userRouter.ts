import express, { Router } from 'express';
import { createUserController, deleteUserController, getUserController } from './userController';
import { asyncHandler } from '../../middlewares';

export const userRouter: Router = express.Router();


/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to users
 */

/**
 * @swagger
 * /api/users/{email}:
 *   get:
 *     summary: Retrieve a user by email
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The user email
 *     responses:
 *       200:
 *         description: A single user
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
 *                   description: List of user objects
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The user ID
 *                         example: 5OqxFVFZdcsN7BNXKhyL
 *                       email:
 *                         type: string
 *                         description: The user's email
 *                         example: user@example.com
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: Status of the response
 *                   example: 500
 *                 error:
 *                   type: string
 *                   description: User Not Found
 *                   example: User Not Found
 *       422:
 *         description: Invalid Email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: Status of the response
 *                   example: 422
 *                 error:
 *                   type: string
 *                   description: Invalid Email
 *                   example: Invalid Email
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: Status of the response
 *                   example: 500
 *                 error:
 *                   type: string
 *                   description: Message Error
 *                   example: Internal Error
*/
userRouter.get('/users/:email', asyncHandler(getUserController));

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
 *                 payload:
 *                   type: array
 *                   description: List of user objects
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The user ID
 *                         example: 5OqxFVFZdcsN7BNXKhyL
 *                       email:
 *                         type: string
 *                         description: The user's email
 *                         example: user@example.com
 *       409:
 *         description: User Already Exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 409
 *                 error:
 *                   type: string
 *                   example: "User Already Exist"
 *       422:
 *         description: Invalid email format
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
 *                   example: "Invalid email format"
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
userRouter.post("/users", asyncHandler(createUserController));

/**
 * @swagger
 * /api/users/{email}:
 *   delete:
 *     summary: Delete a user by email
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user to delete
 *     responses:
 *       200:
 *         description: User successfully deleted
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
 *                   example: "User successfully deleted"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: "User Not Found"
 *       422:
 *         description: Invalid email format
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
 *                   example: "Invalid email format"
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
userRouter.delete('/users/:email', asyncHandler(deleteUserController));
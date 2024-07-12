import express, { Router } from 'express';
import { getUser } from './userController';
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
userRouter.get('/users/:email', asyncHandler(getUser));
// userRouter.post("/update/loans", loanController.handlePayload);

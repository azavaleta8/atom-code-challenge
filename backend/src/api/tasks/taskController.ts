import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MessageResponse, ErrorResponse } from '../../interfaces/ResponseType';
import { createTask}  from './taskService';
import { RequestBodyTask, TaskType } from '../../interfaces/TaskType';

function isValidRequestBodyTask(obj: unknown): obj is RequestBodyTask {
	if (typeof obj !== 'object' || obj === null) {
		return false;
	}

	const task = obj as Partial<RequestBodyTask>;

	return (
		typeof task.userId === 'string' &&
		typeof task.title === 'string' &&
		typeof task.description === 'string' &&
		typeof task.completed === 'boolean'
	);
}

/**
 * Controller function to create a new task.
 * @param req Request object from Express
 * @param res Response object from Express
 * @returns Promise<void>
 */
export const createTaskController = async (req: Request, res: Response): Promise<void> => {
	try {

		if (!isValidRequestBodyTask(req.body)) {
			throw new Error('Invalid Format');
		}
		console.log(req.userId)
		if (!req.userId || req.userId !== req.body.userId) {
			throw new Error('User not authenticated');
		}

		const taskData: RequestBodyTask = req.body;
		const newTask = await createTask(taskData);
		
		const response: MessageResponse = {
			status: StatusCodes.CREATED,
			payload: newTask,
		};
		
		res.status(StatusCodes.CREATED).send(response);

	} catch (err) {
		// console.error(err); // Log the error to the console

		let status = StatusCodes.INTERNAL_SERVER_ERROR; // Default status code for internal server errors
		const message = (err as Error).message || ''; // Get the error message from the thrown error

		// Handle specific error cases
		switch (message) {
			case 'Invalid Format':
				status = StatusCodes.UNPROCESSABLE_ENTITY; // Use status code 422 for invalid email format
				break;
			case 'User not authenticated':
				status = StatusCodes.UNAUTHORIZED; // Use status code 401 for invalid token or userid
				break;
			default:
				status = StatusCodes.INTERNAL_SERVER_ERROR; // Any other internal server error
				break;
		}

		// Create an error response object
		const errorResponse: ErrorResponse = {
			status: status,
			error: message,
		};

		res.status(status).send(errorResponse); // Send the error response to the client
	}
};
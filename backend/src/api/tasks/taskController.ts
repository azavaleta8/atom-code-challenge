import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MessageResponse, ErrorResponse } from '../../interfaces/ResponseType';
import { createTask, deleteTask, fetchTaskByUserId, updateTask}  from './taskService';
import { RequestBodyTask, TaskType} from '../../interfaces/TaskType';

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
 * Controller function to find a task a  by userId.
 * @param req Request object from Express
 * @param res Response object from Express
 * @returns Promise<void>
 */
export const getTaskByUserIdController = async (req: Request, res: Response) : Promise<void> => {
	try {
		// console.log(req.params.userId, req.userId)
		if (!req.params.userId || req.userId !== req.params.userId) {
			throw new Error('User not authenticated');
		}

		const userId: string = req.params.userId // Extracting email from request params

		// Fetching user data from userService
		const tasks = await fetchTaskByUserId(userId);

		// Creating success response object
		const response: MessageResponse = {
			status: StatusCodes.OK,
			payload: tasks,
		};

		res.status(StatusCodes.OK).send(response); // Sending success response

	} catch (err) {
		
		// console.error(err); // Logging error to console

		let status = StatusCodes.INTERNAL_SERVER_ERROR; // Default status code for internal server error
		const message = (err as Error).message || ''; // Getting error message from thrown error

		// Handling specific error cases
		switch (message) {
		case 'User not authenticated':
			status = StatusCodes.UNAUTHORIZED; // Use status code 401 for invalid token or userid
			break;
		default:
			status = StatusCodes.INTERNAL_SERVER_ERROR;
			break;
		}

		// Creating error response object
		const errorResponse: ErrorResponse = {
			status: status,
			error: message,
		};

		res.status(status).send(errorResponse); // Sending error response
	}
};


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

/**
 * Controller function to update a new task.
 * @param req Request object from Express
 * @param res Response object from Express
 * @returns Promise<void>
 */
export const updateTaskController = async (req: Request, res: Response): Promise<void> => {
	try {

		if (!isValidRequestBodyTask(req.body)) {
			throw new Error('Invalid Format');
		}
		
		if (!req.userId) {
			throw new Error('User not authenticated');
		}

		if (req.userId !== req.body.userId){
			throw new Error('Unauthorized to update this task');
		}

		const taskUpdate: RequestBodyTask = req.body;
		const taskId : string = req.params.taskId;

		const updatedTask : TaskType = await updateTask(taskId, taskUpdate);
		
		const response: MessageResponse = {
			status: StatusCodes.OK,
			payload: [updatedTask],
		};
		
		res.status(StatusCodes.OK).send(response);

	} catch (err) {

		let status = StatusCodes.INTERNAL_SERVER_ERROR;
		const message = err instanceof Error ? err.message : 'Unknown error';

		switch (message) {
		case 'Task not found':
			status = StatusCodes.NOT_FOUND;
			break;
		case 'Invalid Format':
			status = StatusCodes.UNPROCESSABLE_ENTITY;
			break;
		case 'Unauthorized to update this task':
			status = StatusCodes.FORBIDDEN;
			break;
		case 'User not authenticated':
			status = StatusCodes.UNAUTHORIZED;
			break;
		default:
			status = StatusCodes.INTERNAL_SERVER_ERROR;
		}

		const errorResponse: ErrorResponse = {
			status: status,
			error: message,
		};

		res.status(status).send(errorResponse);
	}
};

/**
 * Controller function to delete a task.
 * @param req Request object from Express
 * @param res Response object from Express
 * @returns Promise<void>
 */
export const deleteTaskController = async (req: Request, res: Response): Promise<void> => {
	try {

		if (!req.params.taskId || !req.userId) {
			throw new Error('User not authenticated');
		}

		const taskId: string = req.params.taskId
		const userId: string = req.userId

		// Delete the user using the deleteUserByEmail service
		const message = await deleteTask(userId, taskId);

		// Create a success response object
		const response: MessageResponse = {
			status: StatusCodes.OK,
			message: message,
		};

		res.status(StatusCodes.OK).send(response); // Send the success response to the client

	} catch (err) {
		// console.error(err); // Log the error to the console

		let status = StatusCodes.INTERNAL_SERVER_ERROR; // Default status code for internal server errors
		const message = (err as Error).message || ''; // Get the error message from the thrown error

		// Handle specific error cases
		switch (message) {
		case 'Task Not Found':
			status = StatusCodes.NOT_FOUND; // Use status code 404 for user not found
			break;
		case 'User not authenticated':
			status = StatusCodes.UNAUTHORIZED; // Use status code 401 for invalid token or userid
			break;
		case 'Unauthorized to delete this task':
			status = StatusCodes.FORBIDDEN;
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
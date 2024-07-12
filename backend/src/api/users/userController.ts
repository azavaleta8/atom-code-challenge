import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MessageResponse, ErrorResponse } from '../../interfaces/ResponseType';
import { createUser, fetchUser } from './userService';

// Function to validate email format using regex
const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

// Controller function to get user by email
export const getUser = async (req: Request, res: Response) : Promise<void> => {
	try {

		const email: string = req.params.email; // Extracting email from request params

		// Validating email format
		if (!isValidEmail(email)) {
			throw new Error('Invalid email format'); // Throwing error for invalid email format
		}

		// Fetching user data from userService
		const user = await fetchUser(email);

		// Creating success response object
		const response: MessageResponse = {
			status: StatusCodes.OK,
			payload: user,
		};

		res.status(StatusCodes.OK).send(response); // Sending success response

	} catch (err) {
		
		console.error(err); // Logging error to console

		let status = StatusCodes.INTERNAL_SERVER_ERROR; // Default status code for internal server error
		const message = (err as Error).message || ''; // Getting error message from thrown error

		// Handling specific error cases
		switch (message) {
		case 'User Not Found':
			status = StatusCodes.NOT_FOUND;
			break;
		case 'Invalid email format':
			status = StatusCodes.UNPROCESSABLE_ENTITY;
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
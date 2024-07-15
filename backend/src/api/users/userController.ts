import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MessageResponse, ErrorResponse } from '../../interfaces/ResponseType';
import { createUser, deleteUserByEmail, fetchUserByEmail } from './userService';
import { RequestBodyUser } from '../../interfaces/UserType';
import jwt from 'jsonwebtoken';

// Asegúrate de tener una clave secreta para firmar el JWT
const JWT_SECRET = process.env.JWT_SECRET || 'SECRET';

// Function to validate email format using regex
const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

/**
 * Controller function to find a user by email.
 * @param req Request object from Express
 * @param res Response object from Express
 * @returns Promise<void>
 */
export const getUserController = async (req: Request, res: Response) : Promise<void> => {
	try {

		const email: string = req.params.email; // Extracting email from request params

		// Validating email format
		if (!isValidEmail(email)) {
			throw new Error('Invalid email format'); // Throwing error for invalid email format
		}

		// Fetching user data from userService
		const user = await fetchUserByEmail(email);

		// Creating success response object
		const response: MessageResponse = {
			status: StatusCodes.OK,
			payload: user,
		};

		res.status(StatusCodes.OK).send(response); // Sending success response

	} catch (err) {
		
		// console.error(err); // Logging error to console

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

/**
 * Controller function to create a new user.
 * @param req Request object from Express
 * @param res Response object from Express
 * @returns Promise<void>
 */
export const createUserController = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email } : RequestBodyUser = req.body as RequestBodyUser; // Extract email from request body

		// Validate email format
		if (!email || !isValidEmail(email)) {
			throw new Error('Invalid email format'); // Throw an error if email format is invalid
		}

		// Create a new user using the createUser service
		const newUser = await createUser(email);

		// Create a success response object
		const response: MessageResponse = {
			status: StatusCodes.CREATED, // Use status code 201 to indicate successful creation
			payload: newUser,
		};

		res.status(StatusCodes.CREATED).send(response); // Send the success response to the client
	} catch (err) {
		// console.error(err); // Log the error to the console

		let status = StatusCodes.INTERNAL_SERVER_ERROR; // Default status code for internal server errors
		const message = (err as Error).message || ''; // Get the error message from the thrown error

		// Handle specific error cases
		switch (message) {
		case 'Invalid email format':
			status = StatusCodes.UNPROCESSABLE_ENTITY; // Use status code 422 for invalid email format
			break;
		case 'User Already Exist':
			status = StatusCodes.CONFLICT; // Use status code 409 if the user already exists
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
 * Controller function to delete a user by email.
 * @param req Request object from Express
 * @param res Response object from Express
 * @returns Promise<void>
 */
export const deleteUserController = async (req: Request, res: Response): Promise<void> => {
	try {
		const email: string = req.params.email; // Extract email from request parameters

		// Validate email format
		if (!isValidEmail(email)) {
			throw new Error('Invalid email format'); // Throw an error if email format is invalid
		}

		// Delete the user using the deleteUserByEmail service
		const message = await deleteUserByEmail(email);

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
		case 'User Not Found':
			status = StatusCodes.NOT_FOUND; // Use status code 404 for user not found
			break;
		case 'Invalid email format':
			status = StatusCodes.UNPROCESSABLE_ENTITY; // Use status code 422 for invalid email format
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
 * Controller function to login a user by email.
 * @param req Request object from Express
 * @param res Response object from Express
 * @returns Promise<void>
 */
export const loginUserController = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email }: RequestBodyUser = req.body as RequestBodyUser;

		if (!email || !isValidEmail(email)) {
			throw new Error('Invalid email format');
		}

		const user = await fetchUserByEmail(email);

		const payload = {
			email : user[0].email,
			id : user[0].id
		}

		// Generar JWT
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

		const response: MessageResponse = {
			status: StatusCodes.OK,
			payload: { token },
		};

		res.status(StatusCodes.OK).send(response);
	} catch (err) {
		let status = StatusCodes.INTERNAL_SERVER_ERROR;
		let message = (err as Error).message || '';

		switch (message) {
		case 'User Not Found':
			message = "Email or password incorrect";
			status = StatusCodes.UNAUTHORIZED;
			break;
		case 'Invalid email format':
			status = StatusCodes.UNPROCESSABLE_ENTITY;
			break;
		default:
			status = StatusCodes.INTERNAL_SERVER_ERROR;
			break;
		}

		const errorResponse: ErrorResponse = {
			status: status,
			error: message,
		};

		res.status(status).send(errorResponse);
	}
};
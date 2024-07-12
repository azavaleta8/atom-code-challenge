import { StatusCodes } from 'http-status-codes';
import { UserType } from './UserType';

export interface MessageResponse {
  status: StatusCodes;
  message?: string;
  payload?: UserType[];
}

export interface ErrorResponse extends MessageResponse {
  error?: string;
}

import { StatusCodes } from 'http-status-codes';

export interface MessageResponse {
  status: StatusCodes;
  message?: string;
  payload?: any;
}

export interface ErrorResponse extends MessageResponse {
  error?: any;
}

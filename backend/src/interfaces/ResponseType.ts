import { StatusCodes } from 'http-status-codes';
import { Token, UserType } from './UserType';

export interface MessageResponse {
  status: StatusCodes;
  message?: string;
  payload?: UserType[] | Token | string;
}

export interface ErrorResponse extends MessageResponse {
  error?: string;
}

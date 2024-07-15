import { StatusCodes } from 'http-status-codes';
import { Token, UserType } from './UserType';
import { TaskType } from './TaskType';

export interface MessageResponse {
  status: StatusCodes;
  message?: string;
  payload?: UserType[] | TaskType[]| Token | string;
}

export interface ErrorResponse extends MessageResponse {
  error?: string;
}

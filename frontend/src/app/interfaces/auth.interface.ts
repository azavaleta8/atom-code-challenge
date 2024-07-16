export interface LoginResponse {
    status: number;
    payload: {
      token: string;
    };
}
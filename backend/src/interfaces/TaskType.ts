export interface TaskType {
    id?: string;
    userId: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    completed: boolean;
}
  
export interface RequestBodyTask {
    id?: string;
    userId: string;
    title: string;
    description: string;
    completed: boolean;
}
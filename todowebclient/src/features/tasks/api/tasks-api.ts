
import { type Task } from '../types/index';
import api from '../../../lib/axios'

export const getAllTasks = () => {
    return api.get<Task[]>('/tasks/');
};

export const createTask = (task: Task) => {
    return api.post<Task>('/tasks/', task);
};

export const deleteTask = (id: number) => {
    return api.delete(`/${id}/`);
};

export const updateTask = (id: number, task: Task) => {
    return api.put<Task>(`/${id}/`, task);
};
import axios from 'axios';
import { type Task } from '../types/task';

const tasksApi = axios.create({
    baseURL: 'http://localhost:8000/api/v1/tasks/'
});

export const getAllTasks = () => {
    return tasksApi.get<Task[]>('/');
};

export const createTask = (task: Task) => {
    return tasksApi.post<Task>('/', task);
};

export const deleteTask = (id: number) => {
    return tasksApi.delete(`/${id}/`);
};

export const updateTask = (id: number, task: Task) => {
    return tasksApi.put<Task>(`/${id}/`, task);
};
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { getAllTasks, deleteTask } from '../api/tasks-api';
import { type Task } from '../types';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';

export const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const loadTasks = async () => {
        try {
            const data = await getAllTasks();
            setTasks(data.data);
        } catch (error) {
            toast.error("Error cargando tareas");
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Borrar tarea?')) return;
        try {
            await deleteTask(id);
            toast.success('Tarea eliminada');
            loadTasks();
        } catch (error) {
            toast.error('Error al borrar');
        }
    };

    const handleEdit = (task: Task) => {
        setTaskToEdit(task);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setTaskToEdit(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Mis Tareas</h1>

            <TaskForm
                onTaskSaved={loadTasks}
                taskToEdit={taskToEdit}
                onCancelEdit={handleCancelEdit}
            />

            <hr className="my-8 border-gray-300" />

            <TaskList
                tasks={tasks}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />

            <Toaster position="top-right" />
        </div>
    );
};
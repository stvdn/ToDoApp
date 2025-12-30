import { useState, useEffect, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { createTask, updateTask } from '../api/tasks-api';
import { type Task } from '../types';

interface UseTaskFormProps {
    onTaskAdded: () => void;
    taskToEdit: Task | null;
    setTaskToEdit: (t: Task | null) => void;
}

export const useTaskForm = ({ onTaskAdded, taskToEdit, setTaskToEdit }: UseTaskFormProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description || '');
        } else {
            resetForm();
        }
    }, [taskToEdit]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
    };

    const cancelEdit = () => {
        setTaskToEdit(null);
        resetForm();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (taskToEdit && taskToEdit.id) {
                await updateTask(taskToEdit.id, {
                    title,
                    description,
                    done: taskToEdit.done
                });
                toast.success('¡Tarea actualizada!');
                setTaskToEdit(null);
            } else {
                await createTask({
                    title,
                    description,
                    done: false
                });
                toast.success('¡Tarea creada!');
            }

            resetForm();
            onTaskAdded();
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar la tarea');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        title,
        setTitle,
        description,
        setDescription,
        handleSubmit,
        isLoading,
        cancelEdit
    };
};
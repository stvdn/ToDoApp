import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { type Task } from '../types';
import { createTask, updateTask } from '../api/tasks-api';

interface Props {
    onTaskSaved: () => void;
    taskToEdit: Task | null;
    onCancelEdit: () => void;
}

export const TaskForm = ({ onTaskSaved, taskToEdit, onCancelEdit }: Props) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [taskToEdit]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            if (taskToEdit && taskToEdit.id) {
                await updateTask(taskToEdit.id, { title, description, done: taskToEdit.done });
                toast.success('Tarea actualizada');
                onCancelEdit();
            } else {
                await createTask({ title, description, done: false });
                toast.success('Tarea creada');
                setTitle('');
                setDescription('');
            }
            onTaskSaved();
        } catch (error) {
            console.error(error);
            toast.error('Error guardando la tarea');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
                {taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}
            </h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Título"
                    className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Descripción"
                    className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                ></textarea>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className={`px-4 py-2 text-white rounded transition-colors ${taskToEdit ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {taskToEdit ? 'Actualizar' : 'Guardar'}
                    </button>

                    {taskToEdit && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};
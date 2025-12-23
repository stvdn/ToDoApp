import { useEffect, useState, type FormEvent } from 'react';
import { createTask, updateTask } from '../api/tasks';
import { toast } from 'react-hot-toast';
import { type Task } from '../types/task';

interface Props {
    onTaskAdded: () => void;
    taskToEdit: Task | null;
    setTaskToEdit: (t: Task | null) => void;
}

export const TaskForm = ({ onTaskAdded, taskToEdit, setTaskToEdit }: Props) => {
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
                await updateTask(taskToEdit.id, {
                    title,
                    description,
                    done: taskToEdit.done
                });
                toast.success('Tarea actualizada!');
                setTaskToEdit(null);
            } else {
                await createTask({
                    title,
                    description,
                    done: false
                });
                toast.success('Tarea creada!');
                setTitle('');
                setDescription('');
            }

            onTaskAdded();

        } catch (error) {
            console.error(error);
            toast.error('Error guardando');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            <h3>Añadir Nueva Tarea</h3>

            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: '98%', padding: '8px', marginBottom: '10px' }}
                />

                <textarea
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    style={{ width: '98%', padding: '8px' }}
                ></textarea>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
                    {taskToEdit ? 'Actualizar' : 'Guardar'}
                </button>

                {/* Botón extra para cancelar la edición si te arrepientes */}
                {taskToEdit && (
                    <button
                        type="button"
                        onClick={() => setTaskToEdit(null)}
                        style={{ padding: '10px 20px', cursor: 'pointer', background: '#777', color: 'white', border: 'none', borderRadius: '4px' }}
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};
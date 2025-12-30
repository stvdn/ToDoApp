import { type Task } from '../types';

interface Props {
    tasks: Task[];
    onDelete: (id: number) => void;
    onEdit: (task: Task) => void;
}

export const TaskList = ({ tasks, onDelete, onEdit }: Props) => {
    if (tasks.length === 0) {
        return <p className="text-center text-gray-500 mt-10">No hay tareas pendientes 🎉</p>;
    }

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
                <div key={task.id} className="bg-gray-800 text-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">{task.title}</h3>
                        <p className="text-gray-400 text-sm mb-4">{task.description}</p>
                    </div>

                    <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-gray-700">
                        <button
                            onClick={() => onEdit(task)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => task.id && onDelete(task.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                            Borrar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
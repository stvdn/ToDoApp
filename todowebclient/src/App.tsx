import { useEffect, useState } from 'react';
import { getAllTasks, deleteTask } from './api/tasks';
import { type Task } from './types/task';
import { TaskForm } from './components/TaskForm';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const loadTasks = async () => {
    const res = await getAllTasks();
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    const accepted = window.confirm('¿Estás seguro de borrar esta tarea?');
    if (!accepted) return;

    try {
      await deleteTask(id);

      toast.success('Tarea eliminada');

      loadTasks();
    } catch (error) {
      console.error(error);
      toast.error('Error al borrar');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Mis Tareas</h1>

      <TaskForm
        onTaskAdded={loadTasks}
        taskToEdit={taskToEdit}
        setTaskToEdit={setTaskToEdit}
      />

      <hr />

      <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              padding: '15px',
              background: '#2a2a2a',
              borderRadius: '5px',
              border: '1px solid #444',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{task.title}</h3>
              <p style={{ margin: 0, color: '#aaa' }}>{task.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* --- BOTÓN DE EDITAR --- */}
              <button
                onClick={() => handleEdit(task)}
                style={{ background: '#2196F3', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Editar
              </button>

              {/* --- BOTÓN DE BORRAR --- */}
              <button
                onClick={() => task.id && handleDelete(task.id)}
                style={{ background: '#f44336', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegisterForm } from './features/auth';
import { TasksPage } from './features/tasks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Rutas de Autenticación */}
        <Route path="/register" element={<RegisterForm />} />

        {/* Ruta de Tareas (Feature encapsulado) */}
        <Route path="/tasks" element={<TasksPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
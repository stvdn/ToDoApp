import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth-api'; // Importamos la función del feature
import { isAxiosError } from 'axios';
import { Toaster, toast } from 'react-hot-toast';

export const RegisterForm = () => {
    const navigate = useNavigate();

    // Local state
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Form state
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (generalError) setGeneralError(null);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
        }
    };

    const parseBackendError = (error: any): string => {
        if (isAxiosError(error) && error.response?.data) {
            const data = error.response.data;

            // Simple error message
            if (data.detail) return data.detail;

            // Object error by field (ej: { username: ["Ya existe"], password: [...] })
            const firstErrorKey = Object.keys(data)[0];
            if (firstErrorKey) {
                const errorMsg = Array.isArray(data[firstErrorKey])
                    ? data[firstErrorKey][0]
                    : data[firstErrorKey];
                return `${firstErrorKey.toUpperCase()}: ${errorMsg}`;
            }
        }
        return "Ocurrió un error inesperado. Inténtalo de nuevo.";
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setGeneralError(null);

        if (formData.password !== formData.confirmPassword) {
            setGeneralError("Las contraseñas no coinciden");
            return;
        }

        setIsLoading(true);

        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('role', 'USER');

        if (file) {
            data.append('profile_picture', file);
        }

        try {
            await registerUser(data);
            toast("¡Cuenta creada con éxito! Por favor inicia sesión.");
            navigate('/login');
        } catch (error) {
            const message = parseBackendError(error);
            setGeneralError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">

                {/* Encabezado */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Crear Cuenta</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Únete a nuestra plataforma de tareas
                    </p>
                </div>

                {/* Mensaje de Error Global */}
                {generalError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4" role="alert">
                        <p className="text-sm text-red-700 font-bold">Error</p>
                        <p className="text-sm text-red-600">{generalError}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

                    {/* Inputs Principales */}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Usuario</label>
                            <input
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Ej. juanperez"
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="juan@ejemplo.com"
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none rounded w-full px-3 py-2 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirmar</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="appearance-none rounded w-full px-3 py-2 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Campos Extra (Opcionales) */}
                    <div className="space-y-2">


                    </div>

                    {/* Subida de Imagen con Previsualización */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
                        <div className="mt-1 flex items-center space-x-4">
                            {preview ? (
                                <img src={preview} alt="Previsualización" className="h-12 w-12 rounded-full object-cover border" />
                            ) : (
                                <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </span>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={isLoading}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                    </div>

                    {/* Botón de Acción */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registrando...
                                </span>
                            ) : (
                                "Registrarse"
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
            <Toaster position="top-right" />
        </div>
    );
};
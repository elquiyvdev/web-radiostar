import { login, getUser } from '../../services/apiradio.js'; // Asegúrate de tener estas funciones
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario

  async function handleLogin(event) {
    event.preventDefault();

    try {
      // Realiza el login
      await login(email, password);

      // Llama a la API para obtener los datos del usuario
      const userData = await getUser();
      setUser(userData); // Almacena los datos del usuario en el estado

      window.location.href = '/admin'; // Redirige al dashboard
    } catch (err) {
      setError(err.message || 'Error desconocido'); // Captura el mensaje de error
    }
  }

  async function fetchUser() {
    try {
      const userData = await getUser(); // Obtiene los datos del usuario
      setUser(userData); // Almacena los datos en el estado
    } catch (err) {
      setError(err.message || 'Error al obtener los datos del usuario');
    }
  }

  return (
    <form onSubmit={handleLogin} className="text-white">
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
          focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
          dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="@radiostar.com"
          required
        />
      </div>
      <div className="mb-5">
        <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
          focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
          dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none 
        focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center 
        dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Entrar
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <div className="mt-4">
          <p>Bienvenido, {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      {/* Botón para obtener los datos del usuario */}
      <button
        type="button"
        onClick={fetchUser}
        className="mt-4 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none 
        focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
        dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Obtener Datos del Usuario
      </button>
    </form>
  );
}
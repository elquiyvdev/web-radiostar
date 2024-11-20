function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      // Obtén y descodifica el valor de la cookie
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return null;
}

export async function login(email, password) {
  try {
    // Obtén el token CSRF
    await fetch('http://localhost:8000/sanctum/csrf-cookie', {
      credentials: 'include', // Incluye cookies
    });

    // Realiza la solicitud de inicio de sesión
    const response = await fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'), // Token CSRF
      },
      credentials: 'include', // Incluye cookies
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud de inicio de sesión');
    }
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error;
  }
}

export async function getUser() {
  const response = await fetch(`http://localhost:8000/api/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  return response.json(); // Devuelve los datos del usuario
}

export async function logout(token) {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json(); // Devuelve un mensaje de éxito
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../css/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleLogin = (e) => {
    e.preventDefault();
    // Guardar el nombre de usuario en localStorage
    localStorage.setItem('username', username);
    // Aquí iría la lógica de autenticación real. Para este ejemplo, usaremos una autenticación simple.
    if (username === 'diego' && password === '1') {
      // Redirigir a la página de reportes si el login es exitoso
      navigate('/report');
    } else {
     // alert('Credenciales incorrectas');
      MySwal.fire({
        title: 'Credenciales incorrectas',
        icon: 'error',
        confirmButtonText: 'Cerrar',
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          confirmButton: 'swal2-confirm'
        }
      });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        <div>
          <label>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;

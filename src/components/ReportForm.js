import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios'; // Importar axios
import '../css/ReportForm.css';

const ReportForm = () => {
  const [selectedOption, setSelectedOption] = useState('registro');
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    nombre: '',
    detalle: '',
    usuario: ''
  });

  const [searchUser, setSearchUser] = useState('');
  const [searchActivity, setSearchActivity] = useState('');

  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setNewActivity(prevActivity => ({
        ...prevActivity,
        usuario: storedUsername
      }));
    }
  }, []);

  const filterActivities = useCallback(() => {
    let filtered = activities;

    if (searchUser) {
      filtered = filtered.filter(activity =>
        activity.usuario.toLowerCase().includes(searchUser.toLowerCase())
      );
    }

    if (searchActivity) {
      filtered = filtered.filter(activity =>
        activity.nombre.toLowerCase().includes(searchActivity.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  }, [activities, searchUser, searchActivity]);

  useEffect(() => {
    filterActivities();
  }, [searchUser, searchActivity, activities, filterActivities]);

  const handleOptionChange = option => {
    setSelectedOption(option);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewActivity({ ...newActivity, [name]: value });
  };

  const handleSearchUserChange = e => {
    setSearchUser(e.target.value);
    fetchActivitiesByUser(e.target.value);
  };

  const handleSearchActivityChange = e => {
    setSearchActivity(e.target.value);
    fetchActivitiesByActivity(e.target.value);
  };

  const getUserIdByUsername = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/obtenerUsuarioPorNombre?username=${username}`);
      return response.data.id; // Suponiendo que la respuesta contiene el ID del usuario
    } catch (error) {
      throw new Error(`Error al obtener el ID del usuario: ${error.message}`);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();
    const { fecha, horaInicio, horaFin, nombre, detalle, usuario } = newActivity;

    try {
      const usuarioId = await getUserIdByUsername(usuario); // Obtener el ID del usuario

      if (fecha.substring(0, 4) < currentYear) {
        MySwal.fire({
          title: 'Error',
          text: 'El año no puede ser inferior al año actual.',
          icon: 'error'
        });
        return;
      }

      if (horaFin <= horaInicio) {
        MySwal.fire({
          title: 'Error',
          text: 'La hora fin no puede ser inferior a la hora de inicio.',
          icon: 'error'
        });
        return;
      }

      // Realizar la inserción en la base de datos
      const response = await axios.post(
        'http://localhost:5000/api/guardarRegistro',
        { ...newActivity, usuario_id: usuarioId }, // Añadir usuario_id obtenido
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data;

      setActivities([...activities, result]);
      setNewActivity({
        fecha: '',
        horaInicio: '',
        horaFin: '',
        nombre: '',
        detalle: '',
        usuario: localStorage.getItem('username')
      });

      MySwal.fire({
        title: 'El registro ha sido guardado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Cerrar',
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          confirmButton: 'swal2-confirm'
        }
      });
    } catch (error) {
      MySwal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    }
  };

  const handleConfirm = async (usuarioId) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/guardarRegistro',
        { ...newActivity, usuario_id: usuarioId }, // Incluir usuario_id en la solicitud
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data;

      setActivities([...activities, result]);
      setNewActivity({
        fecha: '',
        horaInicio: '',
        horaFin: '',
        nombre: '',
        detalle: '',
        usuario: localStorage.getItem('username')
      });

      MySwal.fire({
        title: 'El registro ha sido guardado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Cerrar',
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          confirmButton: 'swal2-confirm'
        }
      });
    } catch (error) {
      MySwal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const fetchActivitiesByUser = async usuario_id => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/buscarPorUsuario?usuario_id=${usuario_id}`
      );
      const result = response.data;
      setFilteredActivities(result);
    } catch (error) {
      MySwal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    }
  };

  const fetchActivitiesByActivity = async nombre_actividad => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/buscarPorActividad?nombre_actividad=${nombre_actividad}`
      );
      const result = response.data;
      setFilteredActivities(result); // Asegúrate de que result contenga los datos esperados
    } catch (error) {
      MySwal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      });
    }
  };

  const renderFormFields = () => {
    if (selectedOption === 'registro') {
      return (
        <div className="form-fields">
          <h3>AGREGAR ACTIVIDADES</h3>
          <form onSubmit={handleAddActivity}>
            <div>
              <label>Fecha *:</label>
              <input
                type="date"
                name="fecha"
                value={newActivity.fecha}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Hora Inicio *:</label>
              <input
                type="time"
                name="horaInicio"
                value={newActivity.horaInicio}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Hora Fin *:</label>
              <input
                type="time"
                name="horaFin"
                value={newActivity.horaFin}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Nombre de Actividad *:</label>
              <input
                type="text"
                name="nombre"
                value={newActivity.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Detalle de Actividad *:</label>
              <input
                type="text"
                name="detalle"
                value={newActivity.detalle}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="submit-button-container">
              <button type="submit">Agregar Actividad</button>
            </div>
          </form>
        </div>
      );
    } else if (selectedOption === 'consulta') {
      return (
        <div className="form-fields">
          <h3>CONSULTAR ACTIVIDADES</h3>
          <div className="search-fields">
            <div>
              <label>Buscar por Usuario:</label>
              <input
                type="text"
                value={searchUser}
                onChange={handleSearchUserChange}
              />
            </div>
            <div>
              <label>Buscar por Nombre de Actividad:</label>
              <input
                type="text"
                value={searchActivity}
                onChange={handleSearchActivityChange}
              />
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Nombre de Actividad</th>
                <th>Detalle de Actividad</th>
                <th>Usuario</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.fecha}</td>
                  <td>{activity.HORA_INICIO}</td>
                  <td>{activity.HORA_FIN}</td>
                  <td>{activity.NOMBRE_ACTIVIDAD}</td>
                  <td>{activity.DETALLE_ACTIVIDAD}</td>
                  <td>{activity.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className="report-container">
      <h2>MÓDULO DE REGISTRO DE HORAS</h2>
      <div className="options-container">
        <button
          onClick={() => handleOptionChange('registro')}
          className={`option-button ${selectedOption === 'registro' ? 'active' : ''
            }`}
        >
          Registro
        </button>
        <button
          onClick={() => handleOptionChange('consulta')}
          className={`option-button ${selectedOption === 'consulta' ? 'active' : ''
            }`}
        >
          Consulta
        </button>
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
      {renderFormFields()}
    </div>
  );
};

export default ReportForm;

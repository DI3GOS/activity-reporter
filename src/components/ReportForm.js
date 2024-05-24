import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal'; // Importa el componente de modal de react-modal
import '../css/ReportForm.css';

const ReportForm = () => {
  const [selectedOption, setSelectedOption] = useState('registro');
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    nombre: '',
    detalle: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const navigate = useNavigate();

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity({ ...newActivity, [name]: value });
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    setConfirmationMessage("¿Estás seguro de que deseas agregar esta actividad?");
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setActivities([...activities, newActivity]);
    setNewActivity({
      fecha: '',
      horaInicio: '',
      horaFin: '',
      nombre: '',
      detalle: ''
    });
    setShowConfirmation(false);
    setRegistrationSuccess(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleLogout = () => {
    // Lógica para cerrar sesión, por ejemplo, limpiar el estado de autenticación
    navigate('/');
  };

  const renderFormFields = () => {
    if (selectedOption === 'registro') {
      return (
        <div className="form-fields">
          <h3>AGREGAR ACTIVIDADES</h3>
          <form onSubmit={handleAddActivity}>
            <div>
              <label>Fecha *:</label>
              <input type="date" name="fecha" value={newActivity.fecha} onChange={handleInputChange} required />
            </div>
            <div>
              <label>Hora Inicio *:</label>
              <input type="time" name="horaInicio" value={newActivity.horaInicio} onChange={handleInputChange} required />
            </div>
            <div>
              <label>Hora Fin *:</label>
              <input type="time" name="horaFin" value={newActivity.horaFin} onChange={handleInputChange} required />
            </div>
            <div>
              <label>Nombre de Actividad *:</label>
              <input type="text" name="nombre" value={newActivity.nombre} onChange={handleInputChange} required />
            </div>
            <div>
              <label>Detalle de Actividad *:</label>
              <input type="text" name="detalle" value={newActivity.detalle} onChange={handleInputChange} required />
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
          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Nombre de Actividad</th>
                <th>Detalle de Actividad</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.fecha}</td>
                  <td>{activity.horaInicio}</td>
                  <td>{activity.horaFin}</td>
                  <td>{activity.nombre}</td>
                  <td>{activity.detalle}</td>
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
          className={`option-button ${selectedOption === 'registro' ? 'active' : ''}`}
        >
          Registro
        </button>
        <button
          onClick={() => handleOptionChange('consulta')}
          className={`option-button ${selectedOption === 'consulta' ? 'active' : ''}`}
        >
          Consulta
        </button>
        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
      </div>
      {renderFormFields()}
      {/* Componente de modal para mostrar el mensaje de confirmación */}
      <Modal
        isOpen={showConfirmation}
        onRequestClose={handleCancel}
        style={{
          content: {
            maxWidth: '400px',
            maxHeight: '180px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
        contentLabel="Confirmación"
      >
        <div className="confirmation-popup-content">
          <h2>{confirmationMessage}</h2>
          <div className="button-container">
            <button className="primary" onClick={handleConfirm}>Sí</button>
            <button className="secondary" onClick={handleCancel}>No</button>
          </div>
        </div>
      </Modal>

      {/* Modal para mostrar el mensaje de registro exitoso */}
      <Modal
        isOpen={registrationSuccess}
        onRequestClose={() => setRegistrationSuccess(false)}
        style={{
          content: {
            maxWidth: '400px',
            maxHeight: '180px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <div className="registration-success-popup">
          <h2>El registro ha sido guardado exitosamente.</h2>
          <button onClick={() => setRegistrationSuccess(false)}>Cerrar</button>
        </div>
      </Modal>
    </div>
  );
};

export default ReportForm;

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';
import moment from 'moment';


const app = express();

// settings
app.set('port', process.env.PORT || 5000);

// middleware
app.use(cors());
app.use(bodyParser.json());

// static files
const dir_front = "/activity-reporter/public/";
const dir = path.resolve();
app.use(express.static(dir_front));

// Crear la conexión a la base de datos MySQL
const dbConfig = {
  host: 'db-instance.cp4o0syu45q7.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Diego9105',
  database: 'REPORTERO'
};

const pool = mysql.createPool(dbConfig);

// authentication route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Consulta a la base de datos para verificar las credenciales
    const [rows] = await pool.query('SELECT * FROM USUARIOS WHERE USUARIO = ? AND PASS = ?', [username, password]);

    if (rows.length > 0) {
      res.status(200).json({ message: 'Autenticación exitosa' });
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error en la autenticación:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// record hours route
app.post('/api/guardarRegistro', async (req, res) => {
  const { fecha, horaInicio, horaFin, nombre, detalle, usuario_id } = req.body;

  try {
    // Insertar el registro en la base de datos
    const [result] = await pool.query(
      'INSERT INTO REGISTRO_HORAS (fecha, hora_inicio, hora_fin, nombre_actividad, detalle_actividad, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
      [fecha, horaInicio, horaFin, nombre, detalle, usuario_id]
    );

    res.status(201).json({ message: 'Registro de horas guardado exitosamente', id: result.insertId });
  } catch (error) {
    console.error('Error al guardar el registro de horas:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// query records by user route
app.get('/api/buscarPorUsuario', async (req, res) => {
  const { usuario_id } = req.query;

  try {
    // Query the database for records matching the usuario_id
    const [rows] = await pool.query(
      'SELECT RH.FECHA, RH.HORA_INICIO,  RH.HORA_FIN, RH.NOMBRE_ACTIVIDAD , RH.DETALLE_ACTIVIDAD,  U.usuario AS usuario FROM REGISTRO_HORAS RH INNER JOIN USUARIOS U ON RH.USUARIO_ID = U.id WHERE U.usuario  = ?',
      [usuario_id]
    );

    // Formatear la fecha antes de enviar la respuesta
    const formattedRows = rows.map(row => ({
      ...row,
      fecha: moment(row.FECHA).format('DD/MM/YYYY')
    }));

    res.status(200).json(formattedRows);
  } catch (error) {
    console.error('Error al consultar los registros:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ejemplo de ruta para obtener usuario por nombre de usuario
app.get('/api/obtenerUsuarioPorNombre', async (req, res) => {
  const { username } = req.query;
  try {
    const [rows] = await pool.query('SELECT id FROM USUARIOS WHERE USUARIO = ?', [username]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado.' });
    } else {
      res.json({ id: rows[0].id });
    }
  } catch (error) {
    console.error('Error al obtener usuario por nombre:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud.' });
  }
});

// query records by activity route
app.get('/api/buscarPorActividad', async (req, res) => {
  const { nombre_actividad } = req.query;

  try {
    // Query the database for records matching the nombre_actividad
    const [rows] = await pool.query(
      'SELECT RH.FECHA, RH.HORA_INICIO,  RH.HORA_FIN, RH.NOMBRE_ACTIVIDAD , RH.DETALLE_ACTIVIDAD,  U.usuario AS usuario FROM REGISTRO_HORAS RH  INNER JOIN USUARIOS U ON RH.USUARIO_ID = U.id WHERE RH.nombre_actividad LIKE ?',
     [`%${nombre_actividad}%`]
    );
    // Formatear la fecha antes de enviar la respuesta
    const formattedRows = rows.map(row => ({
      ...row,
      fecha: moment(row.FECHA).format('DD/MM/YYYY')
    }));

    res.status(200).json(formattedRows);
  } catch (error) {
    console.error('Error al consultar los registros:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// colocamos las rutas
app.get('/', function(req, res) {
  res.sendFile(path.join(dir, dir_front, 'index.html'));
  console.log("Pase por enviar archivo");
});

app.get('/report', function(req, res) {
  console.log("Entre a la ruta de reporte de actividades");
  res.sendFile(path.join(dir, 'activity-reporter', 'src', 'index.js'));
  console.log("ruta= " + path.join(dir, 'activity-reporter', 'src', 'index.js'));
});

app.listen(app.get('port'), () => {
  console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});

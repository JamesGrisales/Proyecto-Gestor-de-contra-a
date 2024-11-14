require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de conexión PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'tu_usuario',
    password: process.env.DB_PASS || 'tu_contraseña',
    database: process.env.DB_NAME || 'password_manager',
    port: process.env.DB_PORT || 5432,
});

// Verificar la conexión a la base de datos
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    }
    console.log('Conectado a la base de datos');
    release(); // Liberar el cliente
});

// Ruta de inicio
app.get('/', (req, res) => {
    res.send('Backend del Gestor de Contraseñas funcionando');
});

// Crear un nuevo registro de contraseña
app.post('/api/passwords', async (req, res) => {
    const { service, username, password } = req.body;

    if (!service || !username || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO passwords (service, username, password) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(sql, [service, username, hashedPassword]);

        res.status(201).json({ message: 'Contraseña guardada correctamente', data: result.rows[0] });
    } catch (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).json({ message: 'Error al guardar la contraseña' });
    }
});

// Obtener todas las contraseñas
app.get('/api/passwords', async (req, res) => {
    try {
        const sql = 'SELECT id, service, username FROM passwords';
        const results = await pool.query(sql);

        res.json(results.rows);
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ message: 'Error al obtener las contraseñas' });
    }
});

// Obtener una contraseña por ID
app.get('/api/passwords/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'SELECT service, username, password FROM passwords WHERE id = $1';
        const result = await pool.query(sql, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Contraseña no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ message: 'Error al obtener la contraseña' });
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

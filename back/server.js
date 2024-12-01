require('dotenv').config();


const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { encryptPassword, decryptPassword } = require('./utils/encryption'); // Importa funciones de cifrado


const app = express();
app.use(express.json());
app.use(cors());

// Configuración de conexión PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'admin',
    database: process.env.DB_NAME || 'password_manager',
    port: process.env.DB_PORT || 5432,
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
        // Cifra la contraseña antes de guardarla
        const encryptedPassword = encryptPassword(password);

        const sql = 'INSERT INTO passwords (service, username, password) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(sql, [service, username, encryptedPassword]);

        res.status(201).json({ message: 'Contraseña guardada correctamente', data: result.rows[0] });
    } catch (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).json({ message: 'Error al guardar la contraseña' });
    }
});

// Obtener todas las contraseñas
app.get('/api/passwords', async (req, res) => {
    try {
        const sql = 'SELECT id, service, username, password FROM passwords';
        const results = await pool.query(sql);

        // Descifra las contraseñas antes de enviarlas
        const decryptedPasswords = results.rows.map(row => {
            return {
                ...row,
                password: decryptPassword(row.password) // Descifra la contraseña
            };
        });

        res.json(decryptedPasswords);
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ message: 'Error al obtener las contraseñas' });
    }
});

// Obtener una contraseña por ID
app.get('/api/passwords/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'SELECT id, service, username, password FROM passwords WHERE id = $1';
        const result = await pool.query(sql, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Contraseña no encontrada' });
        }

        const passwordData = result.rows[0];
        passwordData.password = decryptPassword(passwordData.password); // Descifra la contraseña

        res.json(passwordData);
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

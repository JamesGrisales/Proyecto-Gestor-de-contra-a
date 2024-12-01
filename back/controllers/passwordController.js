const { encryptPassword, decryptPassword } = require('../utils/encryption');
const pool = require('../db'); // O tu configuración de base de datos

// Función para crear una nueva contraseña
async function createPassword(req, res) {
    const { service, username, password } = req.body;

    if (!service || !username || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const encryptedPassword = encryptPassword(password);

        const sql = 'INSERT INTO passwords (service, username, password) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(sql, [service, username, encryptedPassword]);

        res.status(201).json({ message: 'Contraseña guardada correctamente', data: result.rows[0] });
    } catch (error) {
        console.error('Error al insertar datos:', error);
        res.status(500).json({ message: 'Error al guardar la contraseña' });
    }
}

// Función para obtener todas las contraseñas
async function getAllPasswords(req, res) {
    try {
        const sql = 'SELECT id, service, username, password FROM passwords';
        const results = await pool.query(sql);

        const decryptedPasswords = results.rows.map(row => {
            return {
                ...row,
                password: decryptPassword(row.password)
            };
        });

        res.json(decryptedPasswords);
    } catch (error) {
        console.error('Error al obtener datos:', error);
        res.status(500).json({ message: 'Error al obtener las contraseñas' });
    }
}

module.exports = { createPassword, getAllPasswords };

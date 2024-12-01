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

const crypto = require('crypto');

// Verifica que las variables de entorno no estén vacías
if (!process.env.ENCRYPTION_KEY || !process.env.ENCRYPTION_IV) {
    throw new Error('Las claves de cifrado no están definidas correctamente en el archivo .env');
}

// Función para cifrar la contraseña
function encryptPassword(password) {
    if (!password) {
        throw new Error('No se proporcionó una contraseña para cifrar');
    }
    
    // Asegura que la clave y el IV estén en el formato correcto
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Función para descifrar la contraseña
function decryptPassword(encryptedPassword) {
    if (!encryptedPassword) {
        throw new Error('No se proporcionó una contraseña cifrada para descifrar');
    }

    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encryptPassword, decryptPassword };

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];  // Извлекаем токен из заголовка Authorization

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    // Проверка токена
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;

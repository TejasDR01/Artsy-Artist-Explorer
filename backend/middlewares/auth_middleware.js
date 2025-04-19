const jwt = require('jsonwebtoken');
const JWT_SECRET = "artsy_proj"

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).clearCookie('token').json({ error: 'Expired or Invalid token' });

        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;

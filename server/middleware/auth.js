import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decodedData = jwt.verify(token, process.env.JWT_SECRET || 'test');
        req.userId = decodedData?.id;
        req.userRole = decodedData?.role;

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: "Unauthorized" });
    }
};

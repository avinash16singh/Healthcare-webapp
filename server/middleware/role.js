export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.userRole)) {
            return res.status(403).json({ message: "Forbidden: insufficient permissions" });
        }
        next();
    };
};

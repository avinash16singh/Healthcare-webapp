export const attachSocketIO = (io) => (req, res, next) => {
  req.io = io;
  next();
};

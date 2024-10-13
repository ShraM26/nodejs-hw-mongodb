import createError from 'http-errors';

const notFoundHandler = (req, res, next) => {
    console.log("Route not found");
    next(createError(404, 'Route not found'));
};

export default notFoundHandler;
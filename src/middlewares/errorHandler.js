const errorHandler = (err, req, res, next) => {
    console.error('Error:', err); // Лог помилки для дебагу

    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || "Something went wrong",
        data: err.data || null,
    });
};

export default errorHandler;
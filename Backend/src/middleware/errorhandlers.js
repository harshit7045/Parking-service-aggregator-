import { app } from "../app.js";

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  res.status(status).json({
    success: false,
    error: error.message,
    status: status,
    stack: error.stack
  });
});


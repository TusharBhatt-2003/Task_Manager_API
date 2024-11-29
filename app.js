const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const tasksRoute = require("./routes/tasks");

const app = express();

const errorHandler = require("./middleware/errorHandler");

const morgan = require("morgan");

app.use(errorHandler);

app.use(morgan("dev"));

// Middleware
app.use(express.json());

// Routes
app.use("/api/tasks", tasksRoute);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((error) => console.error(error));

// Start Server
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const apiRoutes = require('./routes/api');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
  origin: "https://cpu-schedulling-2.onrender.com"
}));

app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

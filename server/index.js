const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

const { dbConnection } = require('./database/database');
const { userRouter } = require('./routes/user');
const { otpRouter } = require('./routes/otp');

// Load environment variables
dotenv.config();

// Check for necessary environment variables
if (!process.env.PORT) {
    console.error('Environment variable PORT is missing');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/otp', otpRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Start the server and connect to the database
const port = process.env.PORT || 3000;
(async () => {
    try {
        await dbConnection(); // Initialize the database connection
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit the process with an error code
    }
})();

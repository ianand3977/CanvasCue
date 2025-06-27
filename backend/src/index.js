require('dotenv').config();
const express = require('express');
const cors = require('cors');
const winston = require('winston');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const artworkRoutes = require('./routes/artwork');
const feedbackRoutes = require('./routes/feedback');
const tagRoutes = require('./routes/tag');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// Logger setup
const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/artwork', artworkRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/tag', tagRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

// Swagger setup (self-populating from JSDoc comments)
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Digital Art Submission Portal API',
      version: '1.0.0',
      description: 'API for Artists and Curators with OTP-based authentication, role-based access, and artwork management.'
    },
    servers: [
      { url: 'http://localhost:' + (process.env.PORT || 5000) + '/api' }
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

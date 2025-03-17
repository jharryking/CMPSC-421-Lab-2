const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const mongoose = require('mongoose');

const app = express();

//config
console.log(`app env is ${app.get('env')}`);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

//routes
const orders = require('./routes/orders')

//swagger def
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation using Swagger',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
   components: {
     securitySchemes: {
         bearerAuth: {
             type: 'http',
             scheme: 'bearer',
             bearerFormat: 'JWT', 
         },
     },
 },
    },
    apis: ['./routes/*.js'], // Path to your API docs
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);


//middleware
app.use(express.json());
app.use('/api/orders', orders);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//mongoDB connection
mongoose.connect('mongodb://localhost/order-database')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Could not connect to Mongodb', err));
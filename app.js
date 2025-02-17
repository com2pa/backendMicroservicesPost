require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const { MONGO_URL } = require('./config');

const postRouter = require('./controllers/posts');




// const morgan=require('morgan')
// conexion base de datos
(async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Conectado a MongoDB :)');
  } catch (error) {
    console.log(error);
  }
})();

const allowedOrigins = [
  'https://blog-microservices.onrender.com',
  'http://localhost:5173',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser())
// app.use(morgan('tiny'))

// rutas backEnd

app.use('/api/post' , postRouter)




module.exports = app;
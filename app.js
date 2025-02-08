require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const { MONGO_URL } = require('./config');

const postRouter = require('./controllers/posts');
const { usertExtractor } = require('./middleware/auth');



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

app.use(cors())
app.use(express.json());
app.use(cookieParser())
// app.use(morgan('tiny'))

// rutas backEnd

app.use('/api/post' ,usertExtractor, postRouter)




module.exports = app;
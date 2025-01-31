require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./controllers/users');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const { usertExtractor } = require('./middleware/auth');
const { MONGO_URL } = require('./config');
const loginRouter = require('./controllers/login');
const refresRouter = require('./controllers/refres');
const logoutRouter = require('./controllers/logout');
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

app.use(cors())
app.use(express.json());
app.use(cookieParser())
// app.use(morgan('tiny'))

// rutas backEnd
app.use('/api/users', usersRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/login', loginRouter);
app.use('/api/refres', usertExtractor, refresRouter)
app.use('/api/post' ,usertExtractor, postRouter)




module.exports = app;
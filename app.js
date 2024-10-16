const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose")
const dotenv = require("dotenv")


//** routes */
const testRouter = require('./src/routes/test.routes');
const regisRouter = require('./src/routes/regis.routes');
const loginRouter = require('./src/routes/login.routes');
const bookingRouter = require('./src/routes/booking.routes');
const reserveRouter = require('./src/routes/reserve.routes');
const paymentRouter = require('./src/routes/payment.routes');
const snackRouter = require('./src/routes/snack.routes');

const app = express();
dotenv.config(); 

app.use(cors({
  origin: 'http://localhost:3001',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//** path */
app.use('/api/test', testRouter);
app.use('/api/regis', regisRouter);
app.use('/api/login', loginRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/reserve', reserveRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/snack', snackRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected")
  })
  .catch((err) => console.log(err)
  );

const PORT = process.env.PORTTTT 
app.listen(PORT, () => console.log(`Sever running on port ${PORT}`))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

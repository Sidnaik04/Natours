const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = require('./app');

// console.log(process.env);

// Uncaught Exceptions
process.on('uncaughtException', err =>{
  console.log('UNHANDLED EXCEPTION!!! Shuting down... 💥');
  console.log(err.name, err.messsage);
  process.exit(1)
})

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection successful'));

/*
const testTour = new Tour({
  name: 'A Forest Hiker',
  rating: 4.7,
  price: 497,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('Error 💥: ', err);
  });
*/

const port = 3000 || process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server listening in port : ${port}...`);
});

// Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.messsage);
  console.log('UNHANDLED REJECTION!!! Shuting down... 💥');
  server.close(() => {
    process.exit(1);
  });
});

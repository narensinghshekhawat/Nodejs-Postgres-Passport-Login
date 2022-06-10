if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const port = process.env.SERVER_PORT
const express = require('express')
const path = require('path')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


const index = require('./routes/index')
const admin = require('./routes/admin')

app.use('/',index)
app.use('/admin', admin)

app.listen(port, () => {
  console.log(`App is running on ${port} `);
})
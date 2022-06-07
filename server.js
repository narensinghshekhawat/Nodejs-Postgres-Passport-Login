  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

  const port = process.env.SERVER_PORT
  const express = require('express')
  const app = express()
  app.set('view-engine', 'ejs')

  const route = require('./route')
  app.use('/',route)

  app.listen(port, () => {
    console.log(`App is running on ${port} `);
  })
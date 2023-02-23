const express = require('express')
const app = express()

app.get('/', (req, res) => {
  console.log(req)
  res.send('Hello World!')
})

app.post('/', (req, res) => {
  console.log(req)
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port`)
})
const { Client } = require('@notionhq/client')
var safeAwait = require('safe-await')

var express = require('express')
var app = express()
app.use(express.json())

app.post('/v1/databases', async function (req, res) {
  const notion = new Client({ auth: req.body.token })
  const [errData, data] = await safeAwait(notion.databases.create(req.body.payload))
  if (errData) return res.json(JSON.parse(errData.body))
  return res.json(data)
})

app.post('/v1/pages', async function (req, res) {
  const notion = new Client({ auth: req.body.token })
  const [errData, data] = await safeAwait(notion.pages.create(req.body.payload))
  if (errData) return res.json(JSON.parse(errData.body))
  return res.json(data)
})

module.exports = app;

// Local Test
// var port = 3000
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
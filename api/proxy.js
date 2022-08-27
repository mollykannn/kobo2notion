const { Client } = require('@notionhq/client')
var safeAwait = require('safe-await')

module.exports = async (req, res) => {
  if (req.url === '/v1/databases') {
    const notion = new Client({ auth: req.body.token })
    const [errData, data] = await safeAwait(notion.databases.create(req.body.payload))
    if (errData) return res.json(JSON.parse(errData.body))
    return res.json(data)
  } else if (req.url === '/v1/pages') {
    const notion = new Client({ auth: req.body.token })
    const [errData, data] = await safeAwait(notion.pages.create(req.body.payload))
    if (errData) return res.json(JSON.parse(errData.body))
    return res.json(data)
  }
}

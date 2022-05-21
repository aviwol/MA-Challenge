const fs = require('fs');
const fastify = require('fastify')({ logger: false })
const port = +process.argv[2] || 3000

const client = require('redis').createClient()

client.on('ready', () => {
    fastify.listen(port)
})

const cards = JSON.parse(fs.readFileSync('./cards.json'));

fastify.get('/card_add', async (req, res) => {
    const index = await client.INCR(req.query.id)
    let missingCard = cards[index - 1];
    return missingCard === undefined ? {"id": "ALL CARDS"} : missingCard;
})

fastify.get('/ready', async (request, reply) => {
  return {"ready": true}
})

client.connect();
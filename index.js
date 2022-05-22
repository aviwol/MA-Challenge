const turbo = require("turbo-http");
const fs = require('fs');
const client = require('redis').createClient()
const cards = JSON.parse(fs.readFileSync('./cards.json'));
const fastJson = require('fast-json-stringify');
const port = +process.argv[2] || 3000

const host = '127.0.0.1';

const stringify = fastJson({
  title: 'Example Schema',
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string'
    }
  }
})


const server = turbo.createServer(async function (req, res) {
    requesturl = req.url;
    if (requesturl.indexOf("/re") > -1){
        response = '{"ready": true}'
        res.setHeader('Content-Length', 15)
        res.write(response); 

    } else {
        let uuid = requesturl.substr(13);
        let index = await client.INCR(uuid);
        let missingCard = cards[index-1]; 

        if(missingCard === undefined){
            response = '{"id": "ALL CARDS"}'
            res.setHeader('Content-Length', 19)
        } else {
            response = stringify(missingCard);  
            res.setHeader('Content-Length', 91)
        }    
        res.write(response);        
    }
})

server.listen(port)
client.connect();

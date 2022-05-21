const http = require("http");
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

const requestListener = async function (req, res) {
    const requesturl = req.url;
    if (requesturl.indexOf("/c") > -1){
        let uuid = requesturl.substr(13);
        const index = await client.INCR(uuid);
        let missingCard = cards[index - 1]; 

        if(missingCard === undefined){
            response = '{"id": "ALL CARDS"}'
        } else {
            response = stringify(missingCard);            
        }
    
        res.writeHead(200);
        res.end(response);

    } else {
        res.writeHead(200);
        res.end('{"ready": true}');        
    }
};

const server = http.createServer(requestListener);
server.listen(port, host);
client.connect();

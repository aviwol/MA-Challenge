const turbo = require("turbo-http");
const fs = require('fs');
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

const indexes = {};
if(port === 4002){
    max = 100
    start = 50
} else {
    max = 50
    start = 0
}


const server = turbo.createServer(async function (req, res) {
    requesturl = req.url;
    if (requesturl.indexOf("/re") > -1){
        response = '{"ready": true}'
        res.setHeader('Content-Length', 15)
        res.end(response); 

    } else {
        if(indexes[requesturl] === undefined){
            indexes[requesturl] = start
        }
        const index = ++indexes[requesturl];
        let missingCard = cards[index-1]; 

        if(index <= max){
            response = stringify(missingCard);  
            res.setHeader('Content-Length', 91)
        } else {
            response = '{"id": "ALL CARDS"}'
            res.setHeader('Content-Length', 19)
        }    
        res.end(response);        
    }
})

server.listen(port)

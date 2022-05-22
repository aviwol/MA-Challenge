const turbo = require("turbo-http");
const fs = require('fs');
const cards = JSON.parse(fs.readFileSync('./cards.json'));
const fastJson = require('fast-json-stringify');
const port = +process.argv[2] || 3000

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

newCards = [];
for(i in cards){newCards.push(stringify(cards[i]))}

const indexes = {};
if(port === 4002){
    max = 100
    start = 50
} else if(port === 3000){
    max = newCards.length
    start = 0    
}
else {
    max = 50
    start = 0
}

const server = turbo.createServer(async function (req, res) {
    requesturl = req.url;
    if (requesturl.indexOf("/r") > -1){
        response = '{"ready": true}'
        res.setHeader('Content-Length', 15)
        res.end(response); 
        return
    } 

    if(indexes[requesturl] === undefined){
        indexes[requesturl] = start
    }
    const index = ++indexes[requesturl];
    let missingCard = newCards[index-1]; 

    if(index <= max){
        response = missingCard;  
        res.setHeader('Content-Length', 91)
    } else {
        response = '{"id": "ALL CARDS"}'
        res.setHeader('Content-Length', 19)
    }    
    res.end(response);    
    return    
    
})

server.listen(port)

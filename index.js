const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemp = require("./modules/replaceTemplate");

const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf-8'
);
const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf-8'
);
const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf-8'
);

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
   const { query, pathname} = url.parse(req.url, true)

    if (pathname === "/overview" || pathname === "/") {
        res.writeHead(200, { "Content-type":"text/html"})
        const cardsHtml = dataObj.map(el => replaceTemp(tempCard, el)).join("")
        const output = tempOverview.replace("{%PRODUCT_CARDS%}" , cardsHtml)
        res.end(output)
        console.log(output)

   } else if ( pathname ==="/product"){  
       res.writeHead(200, {"Content-type": "text/html"});
       const product = dataObj[query.id]
       const output = replaceTemp( tempProduct, product)
       res.end(output)

    // API
   } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not found!</h1>');
  }
    
})

server.listen(8008, () => {
    console.log("8008 is listening...")
})
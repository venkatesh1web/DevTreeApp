const http = require('http');

const server = http.createServer((req,res) =>{
  const url = req.url;

  if(url === '/'){
    res.setHeader('content-type','text/html');
    res.write('<html><head>DevSpace</head><body><h2>hello from the server</h2></html></body>');
    res.end();
  }
  if(url === '/about'){
    res.setHeader('content-type','text/html');
    res.write('<html><head>DevSpace</head><body><h2>About the server</h2></html></body>');
    res.end();
  }

  if(url === '/other'){
    res.setHeader('content-type','text/html');
    res.write('<html><head>DevSpace</head><body><h2>other page!!!</h2></html></body>');
    res.end();
  }
})

server.listen(8000,() =>{
  console.log("server is listening on port 8000");
})
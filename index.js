const express = require('express');
const app = express();

app.set('view engine','ejs');

app.get('/',(req,res) =>{
  res.render('home',{name: 'john'});
})


// render static pages using sendFile
app.get('/posts',(req,res) =>{
  res.sendFile('template.html',{root: __dirname});
})

app.listen(8000,() =>{
  console.log('listening on 8000');
})
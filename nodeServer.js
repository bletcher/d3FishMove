var express = require('express');
var app = express()
var compression = require('compression')

app.use(compression());

app.use(express.static('/home/ben/d3FishMove'));

app.listen(4444);

console.log("Running on 4444...");
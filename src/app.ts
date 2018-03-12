/**
 * App JS
 *
 * @author Christian Bartram
 */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

import {Block, next, getBlockchain} from './Block';
// import { getSockets, initServer} from './net/PeerNetwork';

let app = express();
const peerToPeerPort = parseInt(process.env.P2P_PORT) || 6001;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Middleware Setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.get('/', function(req, res){
  res.sendFile('/Users/ilp281/Downloads/Synchronicity-master/public/index.html');
});

app.get('/blocks', (req, res) => {
  res.send(getBlockchain());
});
app.post('/mineBlock', (req, res) => {
  const newBlock: Block = next(req.body.data);
  res.send(newBlock);
});
app.get('/peers', (req, res) => {
 // res.send(getSockets().map(( s: any ) => s._socket.remoteAddress + ':' + s._socket.remotePort));
});
app.post('/addPeer', (req, res) => {
  //connectToPeers(req.body.peer);
  res.send();
});


//initServer(peerToPeerPort);
module.exports = app;

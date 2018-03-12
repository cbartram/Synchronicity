import Message from "./net/Message";

export {}

/**
 * Module dependencies.
 */
const app = require('./app');
const debug = require('debug')('synchronicity:server');
const http = require('http');
const chalk = require('chalk');

import {PeerNetwork} from './net/PeerNetwork'
import {MessageType} from "./net/MessageType";

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(chalk.red(bind + ' requires elevated privileges'));
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(chalk.red(bind + ' is already in use'));
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
const io = require('socket.io')(server);

class Main{
  constructor() {
    const peerNetwork:PeerNetwork = new PeerNetwork();

    //Callback WebSocket events to the Peer network
    io.on('connection', (socket) => {
      //Store local variable because of issue with disconnect
       let localSocket = socket;

      peerNetwork.onConnect(socket);
        socket.on('message', (msg) => {
           let type = null;

          //Find the correct message type
          switch(msg.type) {
              case "QUERY_ALL":
                type = MessageType.QUERY_ALL;
                break;
              case "QUERY_LATEST":
                type = MessageType.QUERY_LATEST;
                break;
              case "RESPONSE_BLOCKCHAIN":
                type = MessageType.RESPONSE_BLOCKCHAIN;
                break;
          }

          //Callback peerNetwork to make it aware that a new message arrived
          peerNetwork.onMessage(new Message(type, msg.message), socket);
        });

        socket.on('disconnect', () => peerNetwork.onDisconnect(localSocket));

    });
    server.listen(port);
    server.on('error', onError);
    server.on('listening', () => {
      console.log(chalk.blue('Running version 1.0.0'));
      console.log(chalk.blue('---------------------------------'));
      console.log(chalk.blue(`| Server Listening on Port 3000 |`));
      console.log(chalk.blue('---------------------------------'));
    });
  }
}


//Instantiate Main Class
new Main();
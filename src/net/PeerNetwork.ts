/**
 * Peer to Peer Network Implementation
 * @author Christian Bartram
 */
import {Block, add, getBlockchain, getLatestBlock, isValidBlockStructure, replace} from '../Block';
import Message from './Message';
import {MessageType} from './MessageType';
import AbstractSocketListener from "./AbstractSocketListener";
import Broadcastable from "./Broadcastable";
import chalk from 'chalk';
const _ = require('lodash');


const socketConnection = (socket: object) => {
  console.log("We got the socket!", socket);
};

// const getSockets = () => sockets;

const initConnection = (ws) => {
    //initMessageHandler(ws);
    // initErrorHandler(ws);
    // write(ws, queryChainLengthMsg());
};


const JSONToObject = <T>(data: string): T => {
    try {
        return JSON.parse(data);
    } catch (e) {
        console.log(e);
        return null;
    }
};

// const initMessageHandler = (ws: WebSocket) => {

// };

// const write = (ws: WebSocket, message: Message): void => ws.send(JSON.stringify(message));
// const broadcast = (message: Message): void => sockets.forEach((socket) => write(socket, message));
// const queryChainLengthMsg = (): Message => ({'type': MessageType.QUERY_LATEST, 'data': null});
// const queryAllMsg = (): Message => ({'type': MessageType.QUERY_ALL, 'data': null});
//
// const responseChainMsg = (): Message => ({'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(getBlockchain())});
//
// const responseLatestMsg = (): Message => ({
//     'type': MessageType.RESPONSE_BLOCKCHAIN,
//     'data': JSON.stringify([getLatestBlock()])
// });

// const initErrorHandler = (ws: WebSocket) => {
//     const closeConnection = (myWs: WebSocket) => {
//         console.log('connection failed to peer: ' + myWs.url);
//         sockets.splice(sockets.indexOf(myWs), 1);
//     };
//     ws.on('close', () => closeConnection(ws));
//     ws.on('error', () => closeConnection(ws));
// };

const handleBlockchainResponse = (receivedBlocks: Block[]) => {
    if (receivedBlocks.length === 0) {
        console.log('received block chain size of 0');
        return;
    }
    const latestBlockReceived: Block = receivedBlocks[receivedBlocks.length - 1];
    if (!isValidBlockStructure(latestBlockReceived)) {
        console.log('block structure not valid');
        return;
    }
    const latestBlockHeld: Block = getLatestBlock();
    if (latestBlockReceived.getIndex() > latestBlockHeld.getIndex()) {
        console.log('block-chain possibly behind. We got: ' + latestBlockHeld.getIndex() + ' Peer got: ' + latestBlockReceived.getIndex());
        if (latestBlockHeld.getHash() === latestBlockReceived.getPrevHash()) {
            if (add(latestBlockReceived)) {
            }
        } else if (receivedBlocks.length === 1) {
            console.log('We have to query the chain from our peer');
        } else {
            console.log('Received blockchain is longer than current blockchain');
            replace(receivedBlocks);
        }
    } else {
        console.log('received blockchain is not longer than received blockchain. Do nothing');
    }
};

// const connectToPeers = (newPeer: string): void => {
//     const ws: WebSocket = new WebSocket(newPeer);
//     ws.on('open', () => {
//         console.log("Opening Connection for New Peer: ", newPeer);
//         initConnection(ws);
//     });
//     ws.on('error', (err) => {
//         console.log('connection failed', err);
//     });
// };


class PeerNetwork extends AbstractSocketListener implements Broadcastable {
    public sockets: object[];

    constructor() {
        super();

        this.sockets = [];
    }

    onConnect(socket): void {
        console.log(chalk.green('---------------------------------------------------------------'));
        console.log(chalk.green(`| New WebSocket (${socket.id}) Connected to -> message |`));
        console.log(chalk.green('---------------------------------------------------------------'));

        //Add custom socket obj to stack { socket: socket, id: socket.id }
        this.sockets.push({socket, id:socket.id});
    }

    onDisconnect(socket): void {
        console.log(chalk.red('------------------------------------------'));
        console.log(chalk.red(`| Peer Disconnected (${socket.id}) |`));
        console.log(chalk.red('-------------------------------------------'));

        //Remove socket (connected peer) from list
        let index: number = _.findIndex(this.sockets, i => i.id === socket.id);
        this.sockets = this.sockets.splice(index, 1);

    }

    onMessage(message, socket): void {
            if (message === null) {
                console.log('The Message is null or undefined.');
                return;
            }
            console.log('Received message' + JSON.stringify(message));
            socket.disconnect();
            switch (message.getMessageType()) {
                case MessageType.QUERY_LATEST:
                    this.send(socket, message);
                    break;
                case MessageType.QUERY_ALL:
                    this.send(socket, message);
                    break;
                case MessageType.RESPONSE_BLOCKCHAIN:
                    const receivedBlocks: Block[] = JSONToObject<Block[]>(message.getMessageData());
                    if (receivedBlocks === null) {
                        console.log('invalid blocks received:');
                        console.log(message.getMessageData());
                        break;
                    }
                    handleBlockchainResponse(receivedBlocks);
                    break;
            }
    }

    /**
     * Broadcasts to every connected socket within the network
     */
    broadcast(): void {

    }

    /**
     * Sends a message back to an individual socket
     * @param {object} socket
     * @param {Message} message
     */
    send(socket: object, message: Message): void {

    }

    getConnectedUsers(): object[] {
        return this.sockets;
    }
}
const broadcastLatest = () => {};

export { PeerNetwork, broadcastLatest, socketConnection };
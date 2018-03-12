/**
 * Peer to Peer Network Implementation
 * @author Christian Bartram
 */
import {Block, add, getBlockchain, getLatestBlock, isValidBlockStructure, replace} from '../Block';
import Message from './Message';
import {MessageType} from './MessageType';
import AbstractSocketListener from "./AbstractSocketListener";

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
//     ws.on('message', (data: string) => {
//         const message: Message = JSONToObject<Message>(data);
//         if (message === null) {
//             console.log('could not parse received JSON message: ' + data);
//             return;
//         }
//         console.log('Received message' + JSON.stringify(message));
//         switch (message.type) {
//             case MessageType.QUERY_LATEST:
//                 write(ws, responseLatestMsg());
//                 break;
//             case MessageType.QUERY_ALL:
//                 write(ws, responseChainMsg());
//                 break;
//             case MessageType.RESPONSE_BLOCKCHAIN:
//                 const receivedBlocks: Block[] = JSONToObject<Block[]>(message.data);
//                 if (receivedBlocks === null) {
//                     console.log('invalid blocks received:');
//                     console.log(message.data);
//                     break;
//                 }
//                 handleBlockchainResponse(receivedBlocks);
//                 break;
//         }
//     });
// };

// const write = (ws: WebSocket, message: Message): void => ws.send(JSON.stringify(message));
// const broadcast = (message: Message): void => sockets.forEach((socket) => write(socket, message));
const queryChainLengthMsg = (): Message => ({'type': MessageType.QUERY_LATEST, 'data': null});
const queryAllMsg = (): Message => ({'type': MessageType.QUERY_ALL, 'data': null});

const responseChainMsg = (): Message => ({'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(getBlockchain())});

const responseLatestMsg = (): Message => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN,
    'data': JSON.stringify([getLatestBlock()])
});

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
                broadcast(responseLatestMsg());
            }
        } else if (receivedBlocks.length === 1) {
            console.log('We have to query the chain from our peer');
            broadcast(queryAllMsg());
        } else {
            console.log('Received blockchain is longer than current blockchain');
            replace(receivedBlocks);
        }
    } else {
        console.log('received blockchain is not longer than received blockchain. Do nothing');
    }
};

const broadcast = (foo) => {};
const broadcastLatest = (): void => {
    broadcast(responseLatestMsg());
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


class PeerNetwork extends AbstractSocketListener {


    onConnect(socket) {
        console.log("We have socket");
    }

    onDisconnect(socket) {
        console.log("Weve lost socket")
    }

    onMessage(message, socket) {
        console.log(`Message -> ${message}`);
    }
}


export { PeerNetwork, broadcastLatest, initServer, socketConnection };
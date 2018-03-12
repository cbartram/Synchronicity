import io from 'socket.io-client';


/**
 * Client sided socket.io wrapper to communicate with server P2P Network
 * @author Christian Bartram
 */

class AbstractQuery {
    queryLatest() { throw new Error("This method requires implementation before use")}
    queryAll() { throw new Error("This method requires implementation before use")}
    responseBlockchain() { throw new Error("This method requires implementation before use")}
    disconnect() { throw new Error("This method requires implementation before use")}
}


/**
 * Simple wrapper for Socket.io to ensure the right channel and
 * MessageType is sent correctly
 */
export default class Client extends AbstractQuery {
    socket;

    constructor() {
        super();
        this.socket = io('http://localhost:3000');
    }

    queryLatest(message) {
        this.socket.emit('message', {type: "QUERY_LATEST", message});
    }

    queryAll(message) {
        this.socket.emit('message', {type: "QUERY_ALL", message});
    }

    responseBlockchain(message) {
        this.socket.emit('message', {type: "RESPONSE_BLOCKCHAIN", message});
    }

    disconnect() {
        this.socket.disconnect();
    }

}
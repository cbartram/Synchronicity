/**
 *
*/
import Message from "./Message";

interface Broadcastable {
    broadcast(): void; //todo could be boolean perhaps later on
    getConnectedUsers(): object[]; //Array of sockets
    send(socket: object, message: Message): void
}

export default Broadcastable;
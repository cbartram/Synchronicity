/**
 * AbstractSocketListener provides the method declarations needed to listen for
 * key websocket events over a network
 * Created by christianbartram on 3/11/18.
 */
abstract class AbstractSocketListener {
    abstract sockets: object;

    abstract onConnect(socket): void;
    abstract onDisconnect(socket): void;
    abstract onMessage(message, socket): void;
}

export default AbstractSocketListener;
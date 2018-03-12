/**
 * Message Class represents how messages are sent across P2P Network
 * @Author cbartram
 */
import { MessageType } from './MessageType'

export default class Message {
    private type: MessageType;
    private data: any;

    constructor(type: MessageType, data: any) {
        this.type = type;
        this.data = data;
    }

    getMessageType(): MessageType {
        return this.type;
    }

    getMessageData<T>(): T {
        return this.data;
    }
}

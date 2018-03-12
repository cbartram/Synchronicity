/**
 * Message Class represents how messages are sent across P2P Network
 * @Author cbartram
 */
import { MessageType } from './MessageType'

export default class Message {
    public type: MessageType;
    public data: any;
}

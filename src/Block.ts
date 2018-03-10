/**
 * Class Block
 * This class creates the basic block structure for use in the block chain
 * @author Christian Bartram
 */
import * as CryptoJS from 'crypto-js';
import {broadcastLatest} from './net/PeerNetwork';

class Block {
    private index: number;
    private hash: string;
    private previousHash: string;
    private timestamp: number;
    private data: string;
    private nextIndex: number;

    constructor(index: number, hash: string, previousHash: string, timestamp: number, data: string) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.nextIndex = index + 1;
    }

    public getIndex = (): number => this.index;
    public getHash = (): string => this.hash;
    public getPrevHash = (): string => this.previousHash;
    public getTimestamp = (): number => this.timestamp;
    public getData = (): string => this.data;
    public getNextIndex = (): number => this.nextIndex;
}

const calculateHash = (index: number, previousHash: string, timestamp: number, data: string): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
const calculateHashForBlock = (block: Block): string => calculateHash(block.getIndex(), block.getPrevHash(), block.getTimestamp(), block.getData());

//Create the genesis block
const genesisBlock: Block = new Block(0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', null, 1465154705, 'my genesis block!!');

//todo abstract blockchain out into its own class
let blockchain: Block[] = [genesisBlock];
const getBlockchain = (): Block[] => blockchain;
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const next = (blockData: string) => {
    const previousBlock: Block = getLatestBlock();
    const nextIndex: number = previousBlock.getIndex() + 1; //[1, 2, 3] => 3 is the next index we need to insert at
    const nextTimestamp: number = new Date().getTime() / 1000;
    const nextHash: string = calculateHash(nextIndex, previousBlock.getHash(), nextTimestamp, blockData);
    const newBlock: Block = new Block(nextIndex, nextHash, previousBlock.getHash(), nextTimestamp, blockData);

    addBlock(newBlock)
};

const addBlock = (block: Block) => {
    if(isValidNewBlock(block, getLatestBlock())) {
        blockchain.push(block);
    }
};

//todo this will need updated if the data is going to be an object and not a string
const isValidBlockStructure = (block: Block): boolean => {
    return typeof block.getIndex() === 'number'
        && typeof block.getHash() === 'string'
        && typeof block.getPrevHash() === 'string'
        && typeof block.getTimestamp() === 'number'
        && typeof block.getData() === 'string';
};

const isValidNewBlock = (newBlock: Block, previousBlock: Block): boolean => {
    if(!isValidBlockStructure(newBlock)) {
        console.log("Block structure is invalid.");
        return false;
    }

    if(previousBlock.getNextIndex()  !== newBlock.getIndex()) {
        //[1, 2, 3] => prev.getNextIndex() => 3  new.getIndex() => 3
        console.log(`Index is invalid: Prev => ${previousBlock.getNextIndex()} new => ${newBlock.getIndex()}`);
        return false;
    } else if (previousBlock.getHash() !== newBlock.getPrevHash()) {
        console.log(`Invalid Previous Hash: Prev => ${previousBlock.getHash()} new => ${newBlock.getPrevHash()}`);
        return false;
    } else if(calculateHashForBlock(newBlock) !== newBlock.getHash()) {
        console.log(`New Hash Type => ${typeof (newBlock.getHash())}`);
        console.log(`Invalid Hash: ${calculateHashForBlock(newBlock)} New blocks Hash => ${newBlock.getHash()}`);
        return false;
    }

    return true;
};

const isValidChain = (blockchainToValidate: Block[]): boolean => {
    const isValidGenesis = (block: Block): boolean => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };

    if (!isValidGenesis(blockchainToValidate[0])) {
        return false;
    }

    for (let i = 1; i < blockchainToValidate.length; i++) {
        if (!isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
};

const add = (newBlock: Block) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
};

const replace = (newBlocks: Block[]) => {
    if (isValidChain(newBlocks) && newBlocks.length > getBlockchain().length) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        blockchain = newBlocks;
        broadcastLatest();
    } else {
        console.log('Received blockchain invalid');
    }
};

export {Block, getBlockchain, getLatestBlock, next, isValidBlockStructure, replace, add};

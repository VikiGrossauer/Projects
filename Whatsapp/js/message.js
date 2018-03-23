export default class Message {
    constructor(text,time,senderId,isGroupMsg){
        this.text = text;
        this.time = time;
        this.senderId = senderId;
        this.isGroupMsg = isGroupMsg;
    }
}
export default class Contact{

    constructor(id,name,img){
        this.id = id;
        this.name = name;
        this.img = img;
        this.hasNewMsg = false;
        this.messages = new Array();

    }

    addMessage(msg) {
        this.messages.push(msg);
    }
}


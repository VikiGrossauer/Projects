export default class Message {
    constructor(text,time,senderId,isGroupMsg){
        this.text = text;
        this.time = time;
        this.senderId = senderId;
        this.isGroupMsg = isGroupMsg;
    }

    print(userId, parent,contactList) {
        let username ="";
        if(this.isGroupMsg && userId !== this.senderId){
            username = "<b>"+contactList.getContactById(this.senderId).name + "</b></br>";
        }
        let html = $('<div class="chatmessage '+(userId===this.senderId?'me':'others')+'">'+
            '<div><div>'+username+this.text+'</div>'+
            '<div class="chatmessage_time">'+this.time+'</div>'+
            '</div></div>');
        parent.append(html);

    }
}
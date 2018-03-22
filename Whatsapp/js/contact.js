export default class Contact{

    constructor(id,name,img){
        this.id = id;
        this.name = name;
        this.img = img;
        this.hasNewMsg = false;
        this.messages = [];

    }

    addMessage(msg) {
        this.messages.push(msg);
    }

    printHeader(){
        $(".chatimage").attr("src",this.img);
        $(".chatname").empty();
        $(".chatname").append("<h2>"+this.name+"</h2>");
    }

    printMessages(userId,parent,contactList){
        for(let m of this.messages){
            m.print(userId,parent,contactList);
        }
    }
}
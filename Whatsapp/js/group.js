import Contact from './contact.js';

export default class Group extends Contact{
    constructor(id,name,img){
        super(id,name,img)
        this.contacts = [];

    }
    addContact(person) {
        this.contacts.push(person);
    }

    printHeader(){
        super.printHeader();
        let html = "<p>";
        for(let i=0; i<this.contacts.length;i++){
            html += this.contacts[i].name;
            if(i < this.contacts.length-1){
                html += ", ";
            }
        }
        html += "</p>";
        $(".chatname").append(html);
    }
}
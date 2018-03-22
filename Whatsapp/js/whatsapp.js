import ContactList from './contactList.js';
import Person from './person.js';
import * as WhatsAppGroup from './group.js';
import Message from './message.js';

//private Methods
let loadFromJSON = Symbol();
let addEventHandler = Symbol();
let addMessageToContact = Symbol();

export default class WhatsApp {
    constructor(){
        this.contactList = new ContactList();
        this.personnelId = undefined;
        this.currentChatPartner = undefined;
    }

    init(){
        this[loadFromJSON]();
        this[addEventHandler]();
    }

    [addEventHandler](){
        //Handler anlegen
        $("#chatlist").on("click",".chatinfo",(e)=>{
            //Eingabefeld einblenden
            $(".chatinput").show();

            //alte Chats löschen
            $(".chatmessage").remove(); //chatbody.empty

            //raus finden (über DOM id) welcher Kontakt gelickt wurde
            //um Obejkt zu finden
            let id = e.currentTarget.id;
            //contact_2
            let index = id.lastIndexOf("_");
            id = id.substring(index+1);
            let selectedContact = this.contactList.getContactById(Number(id));
            this.currentChatPartner = selectedContact;

            //Nachrichten anzeigen
            selectedContact.printMessages(this.personnelId, $("#chatbody>div"), this.contactList);

            //Header aktualisieren
            selectedContact.printHeader();
            $(e.currentTarget).removeClass("new-message");
        });

        $(".chatinput").hide();
        $("#chatinput").keyup(ev => {
           if(ev.which == 13 || ev.keyCode == 13){
               this.insertMessage($(ev.currentTarget).val(), this.personnelId, this.currentChatPartner.id);
               $(ev.currentTarget).val("");
           }
        });
    }

    insertMessage(text, senderId, receiverId){
        let currentDate = new Date();
        let dateTime = currentDate.getHours() + ":" + currentDate.getMinutes();
        let receiverContact = this.contactList.getContactById(receiverId);
        let msg = new Message(text, dateTime, senderId, receiverContact instanceof WhatsAppGroup.Group);
        receiverContact.addMessage(msg);
        if(this.currentChatPartner && this.currentChatPartner.id == receiverId){
            //Nachricht an aktuell ausgewählten Kontakt
            msg.print(this.personnelId, $("#chatbody>div"), this.contactList);
        } else{
            $(receiverContact.contactDiv).addClass("new-message");
        }
    }

    [loadFromJSON](){
        //let that = this;
        $.getJSON("json/contacts.json",(data)=>{
            console.log(this);
            this.personnelId = data.personnelId;

            for(let person of data.persons){
                let contact = new Person(person.id,person.name,person.img,person.online);
                console.log(contact);
                this.contactList.addContact(contact);
                this[addMessageToContact](contact,person,false);
            }
            for(let group of data.groups) {
                let g = new WhatsAppGroup.Group(group.id, group.name, group.img);
                this.contactList.addContact(g);
                this[addMessageToContact](g,group,true);
                for(let contactId of group.members){
                    if(contactId !== this.personnelId){
                        let c = this.contactList.getContactById(contactId);
                        if(c){
                            g.addContact(c);
                            c.addGroup(g);
                        }
                    }
                }
            }

            this.contactList.printContactList();
        });
    }

    [addMessageToContact](contact,jsonContact,isGroupMsg){
        for(let msg of jsonContact.messages){
            let message = new Message(msg.text,msg.time,msg.senderId,isGroupMsg);
            contact.addMessage(message);
        }
    }
}


/*class WhatsApp{
    constructor(){
        this.contactList = new ContactList();
        this.personnelId = undefined;
    }

    init(){
        this[loadFromJSON]();
    }

    [loadFromJSON](){
        let that = this;
        $.getJSON("json/contacts.json", (data)=>{
            console.log(this);
            this.personnelId = data.personnelId
            for(let person of data.persons){
                let contact = new Person(person.id, person.name, person.img, person.online);
                console.log(contact);
                this.contactList.addContact(contact);
                this.addMessageToContact(contact, person, false);
            }

            for(let group of data.groups){
                let newGroup = new Group(group.id, group.name, group.img);
                console.log(newGroup);
                this.contactList.addGroup(newGroup);
                this.addMessageToContact(newGroup, group, true);
                for(let contactId of group.members){
                    if(contactId !== this.personnelId){
                        let c = this.contactList.getContactById(contactId);
                        if(c){
                            newGroup.addContact(c);
                            c.addGroup(newGroup);
                        }
                    }
                }
            }

            this.contactList.printContactList();
        });
    }

    addMessageToContact(contact, jsonContact, isGroupMsg){
        for(let msg of jsonContact.messages){
            let message = new Message(msg.text, msg.time, msg.senderId, isGroupMsg);
            contact.addMessage(message);
        }
    }
}*/
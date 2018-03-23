/**
 *  Model holds data with access and modify methods.
 *  register() adds items to subject.  When model state
 *  changes calls subject.notifyObservers() to redraw list.
 */
import Subject from './subject.js';
import Person from './person.js';
import Group from './group.js';
import Message from './message.js'

let whatsAppModel;

//private methods
let loadFromJSON = Symbol();
//let addEventHandler = Symbol();
let addMessageToContact = Symbol();

class WhatsAppModel extends Subject {
    constructor() {
        super();
        this.contactList = [];
        this.personnelId = undefined;
        this.currentChatPartner = undefined;
        this[loadFromJSON]();
    }

    getList () {
        return this.contactList;
    }

    addContact(contact){
        this.contactList.push(contact);
        super.notifyObservers("addContact",contact);
    }

    getContactById(contactId){
        for(let contact of this.contactList){
            if(contact.id === contactId){
                return contact;
            }
        }
        return undefined;
    }

    changeContact(newContactId,domElement){
        let selectedContact = this.getContactById(Number(newContactId));
        this.currentChatPartner = selectedContact;
        super.notifyObservers("contactChanged",{contact:selectedContact,elem:domElement,userId:this.personnelId});
    }


    insertOwnMessage(text){
        var currentDate = new Date();
        var datetime = currentDate.getHours() + ":" + currentDate.getMinutes() ;
        let receiverContact = this.getContactById(this.currentChatPartner.id);
        let msg = new Message(text,datetime,this.personnelId,receiverContact instanceof Group);
        receiverContact.addMessage(msg);

        super.notifyObservers("newMessage",{currentChatPartner: this.currentChatPartner, receiver: this.currentChatPartner.id,msg:msg,userId:this.personnelId})
    }

    insertExternalMessage(text,senderId,receiverId){
        var currentDate = new Date();
        var datetime = currentDate.getHours() + ":" + currentDate.getMinutes() ;
        let receiverContact = this.getContactById(receiverId);
        let msg = new Message(text,datetime,senderId,receiverContact instanceof Group);
        receiverContact.addMessage(msg);

        super.notifyObservers("newMessage",{currentChatPartner: this.currentChatPartner, receiver: receiverId,msg:msg,userId:this.personnelId})
    }

    [loadFromJSON](){
        $.getJSON("json/contacts.json", (data) => {
            this.personnelId = data.personnelId;
            for (let person of data.persons) {
                let contact = new Person(person.id,person.name, person.img, person.online);
                this[addMessageToContact](contact,person,false);
                this.addContact(contact);
            }
            for(let group of data.groups){
                let g = new Group(group.id,group.name, group.img);
                this[addMessageToContact](g,group,true);
                //add members to group
                for(let contactId of group.members){
                    if(contactId !== this.personnelId){
                        let c = this.getContactById(contactId);
                        if(c){
                            g.addContact(c);
                            c.addGroup(g);
                        }
                    }
                }
                this.addContact(g);
            }
        });
    }

    [addMessageToContact](contact,jsonContact,isGroupMsg){
        for(let msg of jsonContact.messages){
            let message = new Message(msg.text,msg.time,msg.senderId,isGroupMsg);
            contact.addMessage(message);
        }
    }
}


export function getInstance() {
    if(!whatsAppModel) {
        whatsAppModel = new WhatsAppModel();
    }
    return whatsAppModel;
}

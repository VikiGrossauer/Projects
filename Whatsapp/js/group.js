import Contact from './contact.js';

export default class Group extends Contact {
    constructor(id,name,img){
        super(id,name,img);
        this.contacts=[];
    }

    addContact(person){
        this.contacts.push(person);
    }
}
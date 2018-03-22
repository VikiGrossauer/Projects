export default class ContactList {
    constructor(){
        this.contactList=[];
    }

    addContact(contact){
        this.contactList.push(contact);
    }

    getContactById(contactId){
        for(let contact of this.contactList){
            if(contact.id === contactId){
                return contact;
            }
        }
        return undefined;
    }

    printContactList(){
        for(let contact of this.contactList){
            contact.printContact();
        }
    }
}
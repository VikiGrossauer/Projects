/**
 *  Controllers handle input.  Gets DOM refs from View.
 *  then sets event handlers for input text box to add new
 *  item.  Performs register() of both View and itself
 *  to set up list checkbox and remove click event handlers
 *  after DOM rebuilt.
 */
import {getInstance as Model} from "./model.js";
import {getInstance as View} from "./view.js";

let controller;

let init = Symbol()

class Controller {
    constructor(){
        this[init]();
    }

    insertExternalMessage(text,senderId,receiverId){
        Model().insertExternalMessage(text,senderId,receiverId);
    }

    [init](){
        let DOM = View().getDOM();
        // input handler
        DOM.input.blur(() => {
            Model().insertOwnMessage(DOM.input.val());
            DOM.input.val("");
            console.log("hui i am in the controller!")
        });

        DOM.input.keyup((ev) => {
            if (ev.which == 13 || ev.keyCode == 13) {
                DOM.input.blur();
            }
        });

        DOM.list.on('click','.chatinfo',(ev)=> {
            //fetch the contact
            let id = ev.currentTarget.id;
            let index = id.lastIndexOf("_");
            id = id.substring(index + 1);
            Model().changeContact(id,$(ev.currentTarget));
            console.log("hii i am a message!")
        });
    }
}

export function getInstance() {
    if(!controller) {
        controller = new Controller();
    }
    return controller;
}
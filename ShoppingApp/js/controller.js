import {getInstance as Model} from "./model.js";
import {getInstance as View} from "./view.js";

let controller;

let init = Symbol();

class Controller {

    constructor(){
        this[init]();
    }

    [init](){
        let DOM = View().getDOM();

        $("#showInput").click(()=> {
            Model().showInput();
        });

        //Reads the value of the input field, prints and adds new list
        $("#addBtn").click(()=> {
            Model().readValueAndAddList(DOM.inputField);
        });

        //Hides the input field for new list name
        $("#cancel").click(()=> {
            Model().hideInput();
        });

        DOM.shoppingList.on("click", ".list", (e)=> {
            Model().openList(e);
        });

        DOM.shoppingList.on("click", "i", (e)=> {
            Model().deleteList(e);
        });

        DOM.catList.on("click", "li", (e)=> {
            $(".shoppinglist_item.new").show();
            Model().openCategory(e);
        });

        $("#producthover_icon").click((e)=> {
            Model().addListItem(e);
        });

        //Removes Shopping Item of current list
        $("#producthover_icon_rem").click((e)=> {
            Model().removeListItem(e);
        });

        //Adds Details to a product in the current category
        $("#producthover_detail").click((e)=> {
            Model().addDetailsInCategory(e);
        });

        //Adds Details to a product in the current list
        $("#producthover_detail_rem").click((e)=> {
            Model().addDetailsInList(e);
        });
    }
}

export function getInstance() {
    if(!controller) {
        controller = new Controller();
    }
    return controller;
}
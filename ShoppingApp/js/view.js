import {getInstance as Model} from "./model.js";
import Category from './Category.js';
import List from './List.js';
import ShoppingItem from './ShoppingItem.js';
import Article from './Article.js';

let view;

let printShoppingItem = Symbol();

let openCategory = Symbol();
let openList = Symbol();
let deleteList = Symbol();
let removeListItem = Symbol();
let showInputField = Symbol();
let removeHover = Symbol();
let setHover = Symbol();
let cancelInput = Symbol();
let hideInputField = Symbol();
let hideInput = Symbol();
let printShoppingItems = Symbol();
let addProductHover = Symbol();


class View {
    constructor(){
        this.lists = [];
        this.categories = [];
        this.DOM = {
            listheader: $(".listheader"),
            shoppingList: $("#shoppinglist ul"),
            listbody: $("#listbody"),
            catList: $("#categorylist ul"),
            catbody: $("#categoryitems"),
            inputField: $("#newList")
        }
        //this.DOM.listheader.hide();
    }

    getDOM(){
        return this.DOM;
    }

    eventHandling(param){

        //collection of lists (html)
        let $listSidebar = $("#shoppinglist ul")


        //Opens the list and shows content (when clicked)
        $listSidebar.on("click", ".list", (e)=> {
            this[openList](e);
        });

        $listSidebar.on("click", "i", (e)=> {
            this[deleteList](e);
        });


        let $catList = $("#categorylist ul");

        $catList.on("click", "li", (e)=> {
            this[openList](e);
        });

    }

    //shows Input-Field for new list name
    showInput() {
        $("#listheading").hide();
        $("#showInput").hide();
        $("#addBtn").show();
        $("#cancel").show();
        $("#newList").show();
    }

    hideInput() {
        $("#newList").hide();
        $("#cancel").hide();
        $("#addBtn").hide();
        $("#listheading").show();
        $("#showInput").show();
    }

    printCat(category){
        $("#categorylist ul").append("<li id='" + category.id
            + "' class='category'>" + category.name + "</li>");
    }

    printList(list){
        $("#shoppinglist ul").append("<li class='list' id='"+ list.id
            +"'>"+list.name+ " <i class='glyphicon glyphicon-trash'></i></li>");
    }

    printListItems(list) {
        this[printShoppingItems]($("#listitems .items_container"), list);
        let $listheader = $(".listheader");
        $listheader.empty();
        $listheader.append("<h1>"+ list.name +"</h1>");
        $listheader.append("<p>User1, User2, User3</p>");
    }

    printCatItems(category){
        let $products = $("#categoryitems .shoppinglist_item:not(.new)");
        $products.remove();
        this[printShoppingItems]($("#categoryitems .items_container"), category);
    }



    //prints alle shopping items in the category
    [printShoppingItems]($parent, list) {
        for (let a of list.shoppingItems) {
            this[printShoppingItem]($parent, a);
        }
    }

    //print
    //ShoppingItem
    //prints shopping item
    [printShoppingItem]($parent,item) {
        if(item.quantity > 1) {
            let $html = $("<div class='shoppinglist_item " + item.article.category + "' id='" + item.article.id + "'>" +
                "<div class='image_container'>" +
                "<img src='" + item.article.img + "' alt='" + item.article.name + "'>" +
                "</div>" +
                "<p>" + item.article.name + " (" + item.quantity + ")</p>" +
                "</div>");
            if(item.inList) {
                $html.addClass("inShoppingList");
            }
            $parent.append($html);
            this[addProductHover]($html,$parent);
        } else {
            let $html = $("<div class='shoppinglist_item " + item.article.category + "' id='" + item.article.id + "'>" +
                "<div class='image_container'>" +
                "<img src='" + item.article.img + "' alt='" + item.article.name + "'>" +
                "</div>" +
                "<p>" + item.article.name + "</p>" +
                "</div>");
            if(this.inList) {
                $html.addClass("inShoppingList");
            }
            $parent.append($html);
            this[addProductHover]($html,$parent);
        }
    }

    //adds hover to item
    [addProductHover]($html,$parent) {
        let producthover =  $("#producthover");
        let producthoverRem = $("#producthover_rem");

        let $categoryContainer = $("#categoryitems .items_container");

        if($parent.is($categoryContainer)) {
            $html.hover(function(e) {
                $(this).prepend(producthover);
                $(producthover).addClass('active');
            }, function(e) {
                $(producthover).removeClass('active');
                $('#producthover_container').prepend(producthover);
                $(this).find(producthover).remove();
            });
        } else {
            $html.hover(function(e) {
                $(this).prepend(producthoverRem);
                $(producthoverRem).addClass('active');
            }, function(e) {
                $(producthoverRem).removeClass('active');
                $('#producthover_container_rem').prepend(producthoverRem);
                $(this).find(producthoverRem).remove();
            });
        }
    }

    //shows content of category
    [openCategory](e) {
        let id = e.currentTarget.id;
        $("#categorylist li").removeClass("active");
        $(e.currentTarget).addClass("active");
        let category = this[getCategoryById](id);
        let $products = $("#categoryitems .shoppinglist_item:not(.new)");
        $products.remove();
        category.printShoppingItems($("#categoryitems .items_container"));
    }

    deleteList(target){
        $(target).parent().remove();
        let $listdesc = $(".listheader");
        $listdesc.empty();
    }

    printItem(newItem){
        this[printShoppingItem]($("#listitems .items_container"), newItem);
    }

    removeList(productId, target){
        /*
        let producthoverRem = $("#producthover_rem");
        $(producthoverRem).removeClass('active');
        $('#producthover_container_rem').prepend(producthoverRem);
        $(target).find(producthoverRem).remove();
        $("#listitems .items_container").find($("#"+productId)).remove();
        $("#categoryitems .items_container").find($("#"+productId)).removeClass("inShoppingList");
        let id = $("#shoppinglist").find(".active").attr("id");
        let list = Model().getListById(Number(id));
        list.removeItem(productId);*/
    }

    //removes item with parameter 'id'
    removeItem(id) {
        let item = this.getItemById(id);
        id.shoppingItems.splice($.inArray(item,this.shoppingItems),1);
    }

}

export function getInstance() {
    if(!view) {
        view = new View();
    }
    return view;
}

let model = Model();
model.subscribe("showInput",getInstance(),View.prototype.showInput);
model.subscribe("readValueAndAddList",getInstance(),View.prototype.readValueAndAddList);
model.subscribe("hideInput",getInstance(),View.prototype.hideInput);
model.subscribe("printListItems",getInstance(),View.prototype.printListItems);
model.subscribe("printCatItems",getInstance(),View.prototype.printCatItems);
model.subscribe("deleteList",getInstance(),View.prototype.deleteList);
model.subscribe("printCat",getInstance(),View.prototype.printCat);
model.subscribe("printList",getInstance(),View.prototype.printList);
model.subscribe("printItem",getInstance(),View.prototype.printItem);
model.subscribe("removeList",getInstance(),View.prototype.removeList);

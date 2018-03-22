//import {getInstance as View} from "./view.js";
import Subject from './subject.js';
import Category from './Category.js';
import List from './List.js';
import ShoppingItem from './ShoppingItem.js';
import Article from './Article.js';

let shoppingListModel;

//Private methods
//let addEventHandler = Symbol();
let loadFromJSON = Symbol();
let addItemsToCategory = Symbol();
let addToRecentlyUsed = Symbol();
let addList = Symbol();
let addCategory = Symbol();
let getListById = Symbol();
let getItemById = Symbol();
let getCategoryById = Symbol();
//let addListItem = Symbol();
let showInputField = Symbol();
let cancelInput = Symbol();
let addInputToItem = Symbol();
let hideInputField = Symbol();
let removeHover = Symbol();
let setHover = Symbol();



class ShoppingListModel extends Subject {
    constructor() {
        super();
        this.lists = [];
        this.categories = [];
        this.listId = 0;
        this.recentlyUsed = undefined;
        this[loadFromJSON]();
    }

    //Loads all ShoppingItems, Lists and Categories from json-File
    [loadFromJSON]() {
        this.recentlyUsed = new Category("Zuletzt verwendet", "recent");


        $.getJSON("json/itemstores.json", (data) => {
            this[addCategory](this.recentlyUsed);
            for (let category of data.categories) {
                let newCategory = new Category(category.name, category.id);
                this[addCategory](newCategory);
                this[addItemsToCategory](newCategory, category);
            }

            for (let list of data.lists) {
                let newList = new List(list.name, list.id);
                this[addList](newList);
                this[addItemsToCategory](newList, list);
            }
        });
    }

    //adds a new Category
    [addCategory](category) {
        //super.notifyObserver("addCategory",category);
        this.categories.push(category);
        super.notifyObservers("printCat", category);
    }

    //adds a new List
    [addList](list) {
        this.lists.push(list);
        super.notifyObservers("printList", list);
        this.listId++;
    }

    //adds all ShoppingItems to Category
    [addItemsToCategory](category, jsnCategory) {
        for (let item of jsnCategory.shoppingItems) {
            let article = new Article(item.article.id, item.article.name, item.article.img, item.article.category);
            let shoppingItem = new ShoppingItem(article, item.quantity);
            category.addShoppingItem(shoppingItem);
        }
    }

    //Stores item into the Category "recent", removes last one, if
    //more than 15 are stored.
    [addToRecentlyUsed](item) {
        if(this.recentlyUsed.shoppingItems.length < 15) {
            this.recentlyUsed.pushItem(item);
        } else {
            this.recentlyUsed.pushAndPopItem(item);
        }
    }

    showInput() {
        super.notifyObservers("showInput");
    }

    readValueAndAddList(){
        let $newList = $("#newList");
        let name = $newList.val();
        $newList.val("");
        this.hideInput();
        let list = new List(name,this.listId);
        this[addList](list);
        //super.notifyObservers("readValueAndAddList");
    }

    hideInput(){
        super.notifyObservers("hideInput");
    }

    openList(e) {
        let id = e.currentTarget.id;
        $(".list").removeClass("active");
        $(e.currentTarget).addClass("active");

        let list = this[getListById](Number(id));


        $("#listitems .shoppinglist_item").remove();
        if (list !== undefined) {
            super.notifyObservers("printListItems", list);

        }

        for (let i = 1; i < this.categories.length; i++) {
            this.categories[i].setItemsListState(list);
        }

        let catId = $("#categorylist").find(".active").attr("id");
        if (catId) {
            let category = this[getCategoryById](catId);
            let $products = $("#categoryitems .shoppinglist_item:not(.new)");
            $products.remove();
            category.printShoppingItems($("#categoryitems .items_container"));
        }
    }

    deleteList(e){
        let target = e.currentTarget;
        let id = $($(target).parent()).attr("id");
        let list = this[getListById](Number(id));

        if(confirm("Bist du sicher, dass du deine Liste löschen möchtest?")) {
            super.notifyObservers("deleteList", target);

            $.each(this.lists, (i) => {
                if (this.lists[i].id === list.id) {
                    this.lists.splice(i, 1);
                    return false;
                }
            });
        }

    }

    //Sets right InList state of the items
    setItemsListState(list) {
        for(let i = 0; i < this.shoppingItems.length; i++) {
            let currId = this.shoppingItems[i].article.id;
            let currItem = list.getItemById(currId);
            if(currItem === -1) {
                this.shoppingItems[i].setInList(false);
            } else {
                this.shoppingItems[i].setInList(true);
            }
        }
    }

    //shows content of category
    openCategory(e) {
        let id = e.currentTarget.id;
        $("#categorylist li").removeClass("active");
        $(e.currentTarget).addClass("active");
        let category = this[getCategoryById](id);

        super.notifyObservers("printCatItems", category);
    }



    //Looks for current shopping item in category and adds it to a selected list
    addListItem(e) {
        let target = e.currentTarget;
        let $product = $($($(target).parent()).parent());
        let productId = $product.attr("id");
        let categoryId = $product.attr("class").split(" ")[1];
        let category = this[getCategoryById](categoryId);
        let id = $("#shoppinglist").find(".active").attr("id");
        if(id !== undefined) {
            let list = this[getListById](Number(id));
            let item = category.getItemById(productId);
            let listitem = list.getItemById(productId);
            item.setInList(true);
            let newItem = new ShoppingItem(item.article,item.quantity);
            $product.addClass("inShoppingList");
            if(listitem === -1) {
                super.notifyObservers("printItem", newItem);


                list.addShoppingItem(newItem);
                this[addToRecentlyUsed](newItem);
            } else {
                alert("Dieser Artikel befindet sich bereits in der Liste!");
            }
        } else {
            alert("Keine Liste ausgewählt!");
        }
    }

    //removes item from current list --> !!!!
    removeListItem(e) {
        let target = e.currentTarget;
        let $product = $($($(target).parent()).parent());
        let productId = $product.attr("id");
        let categoryId = $product.attr("class").split(" ")[1];
        let category = this[getCategoryById](categoryId);
        let item = category.getItemById(productId);
        item.setInList(false);

        super.notifyObservers("removeList", {id:productId, liTarget:target});
        let producthoverRem = $("#producthover_rem");
        $(producthoverRem).removeClass('active');
        $('#producthover_container_rem').prepend(producthoverRem);
        $(target).find(producthoverRem).remove();
        $("#listitems .items_container").find($("#"+productId)).remove();
        $("#categoryitems .items_container").find($("#"+productId)).removeClass("inShoppingList");
        let id = $("#shoppinglist").find(".active").attr("id");
        let list = Model().getListById(Number(id));
        list.removeItem(productId);
    }

    //adds new Details to the item in a list
    addDetailsInList(e) {
        let target = e.currentTarget;
        let $hover = $(target).parent();
        let $product = $($($(target).parent()).parent());

        this[showInputField]($product,$hover);

        let $productDesc = $product.children("p");
        let $ok = $("#ok");
        let $cancel = $("#cancelInput");

        let id = $("#shoppinglist").find(".active").attr("id");
        let list = this[getListById](Number(id));
        let productId = $product.attr("id");
        let shoppingItem = list.getItemById(productId);

        $ok.off("click");

        $ok.click((e)=> {
            let $producthover =  $("#producthover_rem");
            this[addInputToItem]($product,$productDesc,shoppingItem,$producthover);
        });
    }

    //adds new Details to the item in a category
    addDetailsInCategory(e) {
        let target = e.currentTarget;
        let $hover = $(target).parent();
        let $product = $($($(target).parent()).parent());

        this[showInputField]($product,$hover);

        let $productDesc = $product.children("p");
        let $ok = $("#ok");

        let categoryId = $product.attr("class").split(" ")[1];
        let category = this[getCategoryById](categoryId);
        let productId = $product.attr("id");
        let shoppingItem = category.getItemById(productId);

        //removes all click-handlers
        $ok.off("click");

        $ok.click((e)=> {
            let $producthover =  $("#producthover");
            this[addInputToItem]($product,$productDesc,shoppingItem,$producthover);
        });
    }

    //shows input field to add details to product
    [showInputField]($product,$producthover) {
        this[removeHover]($product,$producthover);
        let $productDesc = $product.children("p");

        let text = $productDesc.text();
        $productDesc.empty();
        let $addDetails = $("#addDetails");
        let $ok = $("#ok");
        let $cancel = $("#cancelInput");
        $addDetails.val("");
        $productDesc.append($addDetails);
        $productDesc.append($cancel);
        $productDesc.append($ok);
        $cancel.off("click");
        $cancel.click((e)=> {
            this[cancelInput]($productDesc,$addDetails,$cancel,$ok,text,$product,$producthover);
        });
    }

    //hides all Input fields
    [cancelInput]($productDesc,$addDetails,$cancel,$ok,text,$product,$producthover) {
        this[hideInputField]($addDetails,$cancel,$ok);
        $productDesc.empty();
        $productDesc.append(text);
        this[setHover]($product,$producthover);
    }

    //adds value of input to the current item
    [addInputToItem]($product,$productDesc,shoppingItem,$producthover) {
        let $addDetails = $("#addDetails");
        let $cancel = $("#cancelInput");
        let $ok = $("#ok");
        let currVal = Number($addDetails.val());
        if(!isNaN(currVal)) {
            //Different
            this[hideInputField]($addDetails,$cancel,$ok);
            $productDesc.empty();
            $productDesc.append(shoppingItem.article.name + " (" + currVal + ")");
            shoppingItem.setQuantity(currVal);

            this[setHover]($product,$producthover);
        } else {
            alert("Bitte hier nur Nummern eingeben!");
        }
    }

    [hideInputField]($addDetails,$cancel,$ok) {
        let $inputContainer = $("#showDetailInput");
        $inputContainer.append($addDetails);
        $inputContainer.append($cancel);
        $inputContainer.append($ok);
    }

    //removes hover of current item
    [removeHover]($product,$producthover) {
        $product.off("mouseenter mouseleave");
        $producthover.removeClass('active');
        $('#producthover_container_rem').prepend($producthover);
    }

    //sets hover for new item
    [setHover]($product,$producthover) {
        $product.hover(function(e) {
            $(this).prepend($producthover);
            $producthover.addClass('active');
        }, function(e) {
            $producthover.removeClass('active');
            $('#producthover_container').prepend($producthover);
            $(this).find($producthover).remove();
        });
    }


    //GET ID
    //delivers List with parameter 'id'
    [getListById](id) {
        for (let list of this.lists) {
            if (list.id == id) {
                return list;
            }
        }
        return undefined;
    }

    //delivers Category with parameter 'id'
    [getCategoryById](id) {
        for(let category of this.categories) {
            if(category.id == id) {
                return category;
            }
        }
        return undefined;
    }


    [getItemById](id) {
        for(let item of this.shoppingItems) {
            if(item.article.id == id) {
                return item;
            }
        }
        return undefined;
    }
}


export function getInstance() {
    if(!shoppingListModel) {
        shoppingListModel = new ShoppingListModel();
    }
    return shoppingListModel;
}
let addProductHover = Symbol();

export default class ShoppingItem {
    constructor(article,quantity) {
        this.article = article;
        this.quantity = quantity;
        this.inList = false;
    }

    //sets state of item (if it's in a list or not) true or false
    setInList(inList) {
        this.inList = inList;
    }

    //edits quantity of the item
    setQuantity(newQuantity) {
        this.quantity = newQuantity;
    }

}
export default class ItemStore {
    constructor(name,id) {
        this.name = name;
        this.id = id;
        this.shoppingItems = [];
    }


    addShoppingItem(item) {
        for(let currItem of this.shoppingItems) {
            if(currItem.article.id === item.article.id) {
                return -1;
            }
        }
        this.shoppingItems.push(item);
    }

}
import ItemStore from './ItemStore.js';

export default class Category extends ItemStore {
    constructor(id, name) {
        super(id, name);
    }

    //adds shopping item to category
    addShoppingItem(item) {
        for (let currItem of this.shoppingItems) {
            if (currItem.article.id === item.article.id) {
                return -1;
            }
        }
        this.shoppingItems.push(item);
    }

    //adds shopping item at the beginning - if it already exists
    //it removes item and adds it at the beginning again
    pushItem(item) {
        $.each(this.shoppingItems, (i)=>{
            if(this.shoppingItems[i].article.id === item.article.id) {
                this.shoppingItems.splice(i,1);
                return false;
            }
        });
        this.shoppingItems.unshift(item);
    }


    //removes last item and adds the new item at the beginning of
    //the array
    pushAndPopItem(item) {
        this.shoppingItems.splice(this.shoppingItems.length-1, 1);
        this.pushItem(item);
    }

    //delivers item with parameter 'id'
    getItemById(id) {
        for (let item of this.shoppingItems) {
            if (item.article.id === id) {
                return item;
            }
        }
        return undefined;
    }
}
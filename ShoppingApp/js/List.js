import ItemStore from './ItemStore.js';

export default class List extends ItemStore {
    constructor(name,id) {
        super(name,id);
    }


    //adds shopping item to category
    addShoppingItem(item) {
        super.addShoppingItem(item);
    }

    //delivers item with parameter 'id'
    getItemById(id) {
        for(let item of this.shoppingItems) {
            if(item.article.id === id) {
                return item;
            }
        }
        return -1;
    }
}
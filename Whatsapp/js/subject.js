//BASISKLASSE

export default class Subject {
    constructor(){
        //assoziativer Array mit Array
        this.observers = [];
    }


    //standardmäßig zwei Methoden

    //anmelden--> für observer immer object und function
    subscribe(eventName, listenerObj, callbackFct){
        if(this.observers[eventName]==undefined){
            this.observers[eventName] = [];
        }
        this.observers[eventName].push({
            obj:listenerObj,
            fct: callbackFct
        });
    }

    unsubscribe(eventName, listenerObj){
        if(this.observers[eventName]){
           let observersForEvent = this.observers[eventName];
            for(let i=0; i<observersForEvent.length;i++){
                if(observersForEvent[i].obj == listenerObj){
                    observersForEvent.splice(i,1);
                    break;
                }
            }
        }

    }

    //Name ändern - Event feuern - jedesmal wenn sich Vorname ändert
    notifyObserver(eventName, param){
        let observersForEvent = this.observers[eventName];
        for(let observer of observersForEvent){
            observer.fct.call(observer.obj,param) //anstatt von this-Obj
        }
    }
}
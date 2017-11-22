
// create into topmost __proto__ to prevent the function 
// from being saved in memory for every object created by myObject
var myObject = {
    create: function(prototypeList) {
        let newObj = {};
        // Necessary? This is bad since these functions will now be stored in memory for all instances of created objects
        // Alternative? Chuck them into __proto__, since we are overriding protos is this reliable? 
        //      Should be since whatever chain you make it will end with the original __proto__
        newObj.call = this.call;
        newObj.addPrototype = this.addPrototype;
        newObj.checkIfPrototypeExistsInChain = this.checkObjectExistsInPrototypesChain;
        if (prototypeList == null)
            return newObj;
        let currentPrototypeLevel = newObj;
        //fix naming...
        prototypeList.forEach(function(prototype, index, array) {
            // if the object already has prototypes that is not the original(i.e. myObject.__proto__) 
            if (currentPrototypeLevel.__proto__ != this.__proto__) {
                //iterate through the prototypes and add the them at the top of the chain to give them "lowest priority" lookup
                for (let proto = currentPrototypeLevel.__proto__; proto.__proto__.__proto__ != null; proto = proto.__proto__) {
                    currentPrototypeLevel = proto;
                }
            // if the object does not have other prototypes just add prototype from prototypeList.forEach as __proto__ 
            // and set currentPrototypeLevel to prototype to advance in the chain
            } else {
                currentPrototypeLevel.__proto__ = prototype;
                currentPrototypeLevel = prototype;
            }
        }, this);
        return newObj;
    },
    // Call overshadowing
    call: function(funcName, parameters) {
        // Iterate through the prototype chain starting from the called object until default proto is reached.
        for (var proto = this; proto.__proto__ != null; proto = proto.__proto__) {
            // if proto has the property funcName then we call the function with .apply(this, parameters) where this is the context, i.e. the original called object
            if (proto.hasOwnProperty(funcName))
                return proto[funcName].apply(this,parameters);
        }

    },
    // Add prototype to called, replaces all previous inheritence.
    addPrototype: function(prototype) { 
        if (!this.checkObjectExistsInPrototypesChain(prototype))
            this.__proto__ = prototype;
        else
            throw new Error("Prototype exists in the inheritance chain");
    },
    // Check if the called object is anywhere in the prototypes prototype chain. 
    checkObjectExistsInPrototypesChain: function(prototype) {
        for (var proto = prototype; proto.__proto__ != null; proto = proto.__proto__) {
            if (proto === this)
               return true;
        }
        return false;
    }

}


/*
*******************************************
*              TESTS                      *
*******************************************
*/

/*
* Example
*/
var obj0 = myObject.create(null);
obj0.func = function(arg) { return "func0: " + arg; };
var obj1 = myObject.create([obj0]);
var obj2 = myObject.create([]);
obj2.func = function(arg) { return "func2: " + arg; };
var obj3 = myObject.create([obj1, obj2]);
var result = obj3.call("func", ["hello"]);
console.log("should print ’func0: hello’ ->", result);

/*
* Another example of method lookup testing that the call method searches
* through all properties:
*/
obj0 = myObject.create(null);
obj0.func = function(arg) { return "func0: " + arg; };
obj1 = myObject.create([obj0]);
obj2 = myObject.create([]);
obj3 = myObject.create([obj2, obj1]);
result = obj3.call("func", ["hello"]);
console.log("should print ’func0: hello’ ->", result);

/*
* Another example of method lookup testing that the call method finds 
* methods defined in the object that is the receiver:
*/
obj0 = myObject.create(null);
obj0.func = function(arg) { return "func0: " + arg; };
result = obj0.call("func", ["hello"]);
console.log("should print ’func0: hello’ ->", result);

/*
* Preventing circular inheritance
*/
obj0 = myObject.create(null);
obj1 = myObject.create([obj0]);
try {
    obj0.addPrototype(obj1);
    console.log("Failed to detect circular inheritence: 1");
} catch (error) {
    console.log("Detected circular logic"); // Should be printed as "Error: Prototype exists in the inheritance chain"
}

/*
*   Multiple prototypes circular inheritence
*/
obj0 = myObject.create(null);
obj1 = myObject.create([obj0]);
obj2 = myObject.create([obj1]);
obj3 = myObject.create([obj2]);
try {
    obj0.addPrototype(obj3);
    console.log("Failed to detect circular inheritence: 2");
} catch (error) {
    console.log("Detected circular logic"); // Should be printed as "Error: Prototype exists in the inheritance chain"
}

/*
* Middle circular inheritence
*/
obj0 = myObject.create(null);
obj1 = myObject.create([obj0]);
obj2 = myObject.create([obj1]); 
obj3 = myObject.create([obj2, obj1]);
try {
    obj0.addPrototype(obj3);
    console.log("Failed to detect circular inheritence: 3");
} catch (error) {
    console.log("Detected circular logic"); // Should be printed as "Error: Prototype exists in the inheritance chain"
}
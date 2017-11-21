
// create into topmost __proto__ to prevent the function 
// from being saved in memory for every object of myObject
var myObject = {

    create: function(prototypeList) {
        let newObj = {};
        newObj.call = this.call;
        newObj.addPrototype = this.addPrototype;
        newObj.checkIfPrototypeExistsInChain = this.checkIfPrototypeExistsInChain;
        if (prototypeList == null)
            return newObj;
        let currentPrototypeLevel = newObj;
        //fix naming...
        prototypeList.forEach(function(prototype, index, array) {
            if (currentPrototypeLevel != null) {
                if (currentPrototypeLevel.__proto__ != this.__proto__) {
                    for (var proto = currentPrototypeLevel.__proto__; proto.__proto__.__proto__ != null; proto = proto.__proto__) {
                        currentPrototypeLevel = proto;
                    }
                } else {
                    currentPrototypeLevel.__proto__ = prototype;
                    currentPrototypeLevel = prototype;
                }
            
            }
        }, this);
        return newObj;
    },
    // TODO check for method overloading on parameters
    call: function(funcName, parameters) {
        for (var proto = this; proto.__proto__ != null; proto = proto.__proto__) {
            if (proto.hasOwnProperty(funcName))
                return proto[funcName].apply(this,parameters);
        }

    },
    addPrototype: function(prototype) { 
        if (!this.checkIfPrototypeExistsInChain(prototype))
            this.__proto__ = prototype;
        else
            throw new Error("Prototype exists in the inheritance chain");
    },
    // since all objects are key value pairs how do you even check if the objects are the same? 
    // iterate through properties of object?
    checkIfPrototypeExistsInChain: function(prototype) {
        for (var proto = prototype; proto.__proto__ != null; proto = proto.__proto__) {
            if (proto === this)
               return true;
        }
        return false;
    }

}

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
} catch (error) {
    console.error(error); // Should be printed as "Error: Prototype exists in the inheritance chain"
}
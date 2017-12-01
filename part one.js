// Fredrik Larsson frla9839, Louise Flinta loflXXXX

var myObject = {
    create: function(prototypeList) {
        let newObj = {};
        // myObject should be the top prototype (bar the default one, which is myObjects prototype) so we inherit the functions from this
        newObj.__proto__ = this;

        if (prototypeList == null)
            return newObj;

        let currentPrototypeLevel = newObj;
        prototypeList.forEach(function(prototype, index, array) {
            if (prototype != null) {

                // if the currentPrototype in the iteration has one(or more) prototype(s) that is not this(myObject) i.e. it has a prototype chain of its own 
                if (currentPrototypeLevel.__proto__ != this) {

                    //iterate through the prototypes and add the them at the top of the chain to give them "lowest priority" lookup
                    // note: stops on the object before default __proto__ (i.e. proto.__proto__ != null)
                    for (let proto = currentPrototypeLevel.__proto__; proto != this; proto = proto.__proto__) {
                        currentPrototypeLevel = proto;
                    }

                // if the object does not have other prototypes just add prototype from prototypeList.forEach as __proto__ 
                // and set currentPrototypeLevel to prototype to advance in the chain
                }                
                currentPrototypeLevel.__proto__ = prototype;
                currentPrototypeLevel = prototype;
            }
        }, this);

        // Add this to the topmost prototype before default proto to inherit functions
        // currentPrototypeLevel.__proto__ = this;
        return newObj;
    },
    call: function(funcName, parameters) {
        // Iterate through the prototype chain starting from the called object until default proto is reached.
        for (let proto = this; proto.__proto__ != null; proto = proto.__proto__) {
            // if proto has the property funcName then we call the function with .apply(this, parameters) where this is the context, i.e. the original called object
            if (proto.hasOwnProperty(funcName))
                return proto[funcName].apply(this,parameters);
        }
    },
    // Add prototype to called, places it in the top spot before myObject.
    addPrototype: function(prototype) {
        if (!this.checkObjectExistsInPrototypesChain(prototype)) {
            let currentPrototypeLevel = this; 
            for (let proto = currentPrototypeLevel.__proto__; proto.__proto__.__proto__ != null; proto = proto.__proto__) {
                currentPrototypeLevel = proto;
            }
            currentPrototypeLevel.__proto__ = prototype; // should probably add after the prototypes chain that we are adding??
        }
        else
            throw new Error("Prototype exists in the inheritance chain");
    },
    // Check if the called object is anywhere in the prototypes prototype chain. 
    // TODO: Do i need to check both the prototypes chain and this since i cant access the object of which this is prototype TO?
    checkObjectExistsInPrototypesChain: function(prototype) {
        for (var proto = prototype; proto.__proto__ != null; proto = proto.__proto__) {
            if (proto === this)
               return true;
        }
        return false;
    }

};


/*
            %%%%%%%%%%%%%%%%%%%%%%%
            %@@@@@@@@@@@@@@@@@@@@@%
            %@###################@%
            %@#*****************#@%
            %@#*     TESTS     *#@%
            %@#*****************#@%
            %@###################@%
            %@@@@@@@@@@@@@@@@@@@@@%
            %%%%%%%%%%%%%%%%%%%%%%%
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
* Check adds all correct 
*/
obj0 = myObject.create(null);
obj0.ident = 0;
obj1 = myObject.create([obj0]);
obj1.ident = 1;
obj2 = myObject.create([null]);
obj2.ident = 2;
obj3 = myObject.create([obj1,obj2]);
obj3.ident = 3;

result = "should print: ’3 1 0 2’ ->";
for (let obj = obj3; obj.__proto__ != null; obj = obj.__proto__) {
    result += " " + obj.ident;
}
console.log(result);
 

/*
* Preventing circular inheritance
*/
obj0 = myObject.create(null);
obj1 = myObject.create([obj0]);
console.log("should print ’Detected circular prototype logic’ x2")
try {
    obj0.addPrototype(obj1);
    console.log("\tFailed to detect circular inheritence: 1");
} catch (error) {
    console.log("\tDetected circular prototype logic: 1");
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
    console.log("\tFailed to detect circular inheritence: 2");
} catch (error) {
    console.log("\tDetected circular prototype logic: 2");
}

console.log("should print ’added prototype’")
/*
*   functional addPrototype
*/
obj0 = myObject.create(null);
obj0.ident = 0;
obj1 = myObject.create([obj0]);
obj1.ident = 1;
obj2 = myObject.create([obj1]);
obj2.ident = 2;
obj3 = myObject.create([]);
obj3.ident = 3;
try {
    obj2.addPrototype(obj3);
    console.log("\tadded prototype");
} catch (error) {
    console.log("\tdetected circular prototype logic");
}

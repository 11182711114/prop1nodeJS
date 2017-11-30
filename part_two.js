// Fredrik Larsson frla9839, Louise Flinta loflXXXX

var superDuperClass = {
    call: function(funcName, param) {
        if (this.hasOwnProperty(funcName))
            return this[funcName].apply(this, param);

        // Fix return? -> tail recursion should not be necessary since the return value
        // is not dependent on the previous stack windows(except branch points, i.e. classes with multiple super-classes)
        // which means that they should not be saved on the stack?
        let result = this.__proto__.callInClass(funcName, param);
        return result;
    },
    callInClass: function(funcName, param) {
        if (this.hasOwnProperty(funcName)) {
           return this[funcName].apply(this, param);
        } else {
            //      Cannot break out of forEach since we are breaking the function which the forEach is calling
            //      and not the forEach itself
            //      same applies to return, it simply returns for the function given to forEach
            /* 
            this.superClasses.forEach(function(superClass) {
                result = superClass.callTail(funcName, param, result);
                if (result != null)
                    return result;
            }, this); 
            */
            for(let i = 0; i < this.superClasses.length; i++) {
                let superClass = this.superClasses[i];
                result = superClass.callInClass(funcName, param, result);
                if (result != null)
                    return result;
            }
        }
        return null;
    },
    addSuperClass: function(superClass) {
        if (!superClass.checkIfClassExistsInInheritence(this))
            this.superClasses.push(superClass);
        else
            throw new Error("Class exists in the inheritance chain");
    },
    checkIfClassExistsInInheritence: function(classToAdd) {
        if (this == classToAdd) {
            return true;
        } else {
            for (let i = 0; i < this.superClasses.length; i++) {
                if (this.superClasses[i].checkIfClassExistsInInheritence(classToAdd))
                    return true;
            }
        }
        // default
        return false;
    }
};

var createClass = function(className, superClassList) {
    let newClass = {
        superClasses: [], 
        name: className,
        new: function() {
            var newInstance = {};
            newInstance.__proto__ = this;
            return newInstance;
        } 
    };

    // Does not handle null values inside the superClassList array, 
    // if they should be allowed then this needs to iterate through the list and add them manually
    if (superClassList != null)
        newClass.superClasses = superClassList;

    newClass.__proto__ = superDuperClass;
    return newClass;
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
*   Example
*/
var class0 = createClass("Class0", null);
class0.func = function(arg) { return "func0: " + arg; };
var class1 = createClass("Class1", [class0]);
var class2 = createClass("Class2", []);
class2.func = function(arg) { return "func2: " + arg; };
var class3 = createClass("Class3", [class1, class2]);
var obj3 = class3.new();
var result = obj3.call("func", ["hello"]);
console.log("should print ’func0: hello’ -> " + result)

/*
*   Another example of method lookup testing
*/
class0 = createClass("Class0", null);
class0.func = function(arg) { return "func0: " + arg; };
class1 = createClass("Class1", [class0]);
class2 = createClass("Class2", []);
class3 = createClass("Class3", [class2, class1]);
obj3 = class3.new();
result = obj3.call("func", ["hello"]);
console.log("should print ’func0: hello’ -> " + result);

/*
*   Another example of method lookup testing that the method 
*   will be found in the object’s own class:
*/
class0 = createClass("Class0", null);
class0.func = function(arg) { return "func0: " + arg; };
var obj0 = class0.new();
result = obj0.call("func", ["hello"]);
console.log("should print ’func0: hello’ -> " + result);

console.log("should print ’Detected circular inheritence logic’");
// Another example for the class-based part
var class0 = createClass("Class 0", null);
var class1 = createClass("Class 1", [class0]);
try {
    class0.addSuperClass(class1);
    console.log("\tFailed to detect circular inheritence");
} catch (error) {
    console.log("\tDetected circular inheritence logic");
}

console.log("should print ’Detected circular inheritence logic’");
// More complex circular inheritence
var class0 = createClass("Class 0", null);
var class1 = createClass("Class 1", [class0]);
var class2 = createClass("Class2",[]);
var class3 = createClass("Class3", [class2]);
var class4 = createClass("Class4", [class3,class0]);
try {
    class0.addSuperClass(class4);
    console.log("\tFailed to detect circular inheritence");
} catch (error) {
    console.log("\tDetected circular inheritence logic");
}

var superDuperClass = {
    call: function(funcName, param) {
        if (this.hasOwnProperty(funcName))
            return this[funcName].apply(this, param);

        let result = null;
        __proto__.callTail(funcName, param, result);
        return result;

        // let instanceClass = this.__proto__;
        // let result;
        // if (instanceClass.hasOwnProperty(funcName))
        //     result = curClass[funcName].apply(this, parameters);
        // else {
        //     superClasses.forEach(function(superClass) {
        //         superClass.callTail(funcName,param, result)
        //         if (result != null)
        //             break;
        //     })
        // }
        // return result;
    },
    callTail: function(funcName, param, result) {
        if (this.hasOwnProperty(funcName)) {
            result = curClass[funcName].apply(this, parameters);
        } else {
            this.superClasses.forEach(function(superClass){
                superClass.callTail(funcName, param, result)
            }, this);
        }
        return;
    },
    addSuperClass: function(superClass) {

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

    // superClassList.forEach(function(prototype, index, array) {
    //     newClass.superClasses.push(prototype);
    // }, this);
    newClass.superClasses = superClassList;

    newClass.__proto__ = superDuperClass;
    return newClass;
};


var class0 = createClass("class0", []);
class0.ident = 0;
class0.func = function(arg) { return "func0: " + arg; };
var class1 = createClass("class1", [class0]);
class1.ident = 1;

var inst = class1.new();

var result = inst.call("func", ["hello"]);
console.log("should print ’func0: hello’ ->", result);




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

// /*
// *   Example
// */
// var class0 = createClass("Class0", null);
// class0.func = function(arg) { return "func0: " + arg; };
// var class1 = createClass("Class1", [class0]);
// var class2 = createClass("Class2", []);
// class2.func = function(arg) { return "func2: " + arg; };
// var class3 = createClass("Class3", [class1, class2]);
// var obj3 = class3.new();
// var result = obj3.call("func", ["hello"]);

// /*
// *   Another example of method lookup testing
// */
// class0 = createClass("Class0", null);
// class0.func = function(arg) { return "func0: " + arg; };
// class1 = createClass("Class1", [class0]);
// class2 = createClass("Class2", []);
// class3 = createClass("Class3", [class2, class1]);
// obj3 = class3.new();
// result = obj3.call("func", ["hello"]);

// /*
// *   Another example of method lookup testing that the method 
// *   will be found in the object’s own class:
// */
// class0 = createClass("Class0", null);
// class0.func = function(arg) { return "func0: " + arg; };
// var obj0 = class0.new();
// result = obj0.call("func", ["hello"]);
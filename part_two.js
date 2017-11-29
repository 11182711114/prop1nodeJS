
var superDuperClass = {
    call: function() {

    },
    addSuperClass: function() {

    }
};

var createClass = function(className, superClassList) {
    let newClass = {
        superClasses: [], 
        name: className 
    };

    superClassLis.forEach(function(prototype, index, array) {
        superClasses.push(prototype);
    }, this);
    newClass.__proto__ = superDuperClass;
    return newClass;
};


var newClass = createClass("Test", null);
console.log("new class: " + newClass.name);
var newObj = newClass.new();
console.log("new class instance: " + newObj.name);





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
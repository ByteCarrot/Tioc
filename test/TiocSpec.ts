/// <reference path="jasmine.d.ts" />
/// <reference path="../src/Tioc.ts" />

describe('Value', () => {
    var Value = ByteCarrot.Tioc.Value;
    describe('isString', () => {
        it('should return true if value is a string', () => {
            expect(Value.isString('')).toBeTruthy();
            expect(Value.isString('    ')).toBeTruthy();
            expect(Value.isString('lkasjd laskdj')).toBeTruthy();
        });
        it('should return false if value is not a string', () => {
            expect(Value.isString(undefined)).toBeFalsy();
            expect(Value.isString(null)).toBeFalsy();
            expect(Value.isString({})).toBeFalsy();
            expect(Value.isString([])).toBeFalsy();
        });
    });
    describe('isNotEmptyString', () => {
        it('should return true if value is not an empty string', () => {
            expect(Value.isNotEmptyString('d')).toBeTruthy();
            expect(Value.isNotEmptyString(' asdas    ')).toBeTruthy();
        });
        it('should return false if value is not a string nor empty string', () => {
            expect(Value.isNotEmptyString(undefined)).toBeFalsy();
            expect(Value.isNotEmptyString(null)).toBeFalsy();
            expect(Value.isNotEmptyString({})).toBeFalsy();
            expect(Value.isNotEmptyString('   ')).toBeFalsy();
            expect(Value.isNotEmptyString('')).toBeFalsy();
        });
    });
    describe('isFunction', () => {
        function testFunction(){}
        it('should return true if value is a function', () => {
            expect(Value.isFunction(function(){})).toBeTruthy();
            expect(Value.isFunction(testFunction)).toBeTruthy();
        });
        it('should return false if value is not a function', () => {
            expect(Value.isFunction(undefined)).toBeFalsy();
            expect(Value.isFunction(null)).toBeFalsy();
            expect(Value.isFunction('')).toBeFalsy();
            expect(Value.isFunction({})).toBeFalsy();
        });
    });
    describe('isIdentifier', () => {
        it('should return true if value is a valid identifier', () => {
            expect(Value.isIdentifier('AlaMaKota')).toBeTruthy();
            expect(Value.isIdentifier('alaMaKota33_33')).toBeTruthy();
            expect(Value.isIdentifier('_alaMa_KOTA')).toBeTruthy();
        });
        it('should return false if value is not a valid identifier', () => {
            expect(Value.isIdentifier(undefined)).toBeFalsy();
            expect(Value.isIdentifier(null)).toBeFalsy();
            expect(Value.isIdentifier('  ')).toBeFalsy();
            expect(Value.isIdentifier('3alaMaKota'));
        });
    });
});



describe('Reflector', function () {
    var reflector:ByteCarrot.Tioc.Reflector;
    beforeEach(() => {
        reflector = new ByteCarrot.Tioc.Reflector();
    });

    describe('analyze', () => {
        it('should be able to analyze anonymous function', () => {
            var fn = function (arg1, arg2) {};
            var info = reflector.analyze(fn);
            expect(info.name).toBe(null);
            expect(info.kind).toBe('function');
            expect(info.members.length).toBe(2);
            expect(info.members[0]).toBe('arg1');
            expect(info.members[1]).toBe('arg2');
        });
        it('should be able to analyze anonymous function without arguments', () => {
            var fn = function() {};
            var info = reflector.analyze(fn);
            expect(info.name).toBe(null);
            expect(info.kind).toBe('function');
            expect(info.members.length).toBe(0);
        });
        it('should be able to analyze standard JavaScript function', () => {
            function SomeTestFunction(argx, argy) {
            }
            var info = reflector.analyze(SomeTestFunction);
            expect(info.name).toBe('SomeTestFunction');
            expect(info.kind).toBe('function');
            expect(info.members.length).toBe(2);
            expect(info.members[0]).toBe('argx');
            expect(info.members[1]).toBe('argy');
        });
        it('should be able to analyze class constructor', () => {
            var info = reflector.analyze(TestClass);
            expect(info.name).toBe('TestClass');
            expect(info.kind).toBe('function');
            expect(info.members.length).toBe(2);
            expect(info.members[0]).toBe('someString');
            expect(info.members[1]).toBe('someNumber');
        });
        it('should throw error when argument is not a function', () => {
            expect(() => reflector.analyze('')).toThrow();
            expect(() => reflector.analyze(undefined)).toThrow();
            expect(() => reflector.analyze(null)).toThrow();
            expect(() => reflector.analyze({})).toThrow();
        });
    });
});

describe('Activator', () => {
    var activator:ByteCarrot.Tioc.Activator;
    beforeEach(() => {
        activator = new ByteCarrot.Tioc.Activator();
    });

    describe('createInstance', () => {
        function Test() {
            this.value = 'Test class';
        }
        function Test2(value:string) {
            this.value = value;
        }
        it('should create instance using parameterless constructor', () => {
            var obj = activator.createInstance(Test, []);
            expect(typeof obj).toBe('object');
            expect(obj.value).toBe('Test class');
        });
        it('should create instance using constructor with a single argument', () => {
            var obj = activator.createInstance(Test2, ['alamakota']);
            expect(typeof obj).toBe('object');
            expect(obj.value).toBe('alamakota');
        });
    });
});

describe('Container', () => {
    var container:ByteCarrot.Tioc.Container;
    beforeEach(() => {
        container = new ByteCarrot.Tioc.Container();
    });

    describe('IsRegistered', () => {
        beforeEach(() => {
            container.Register(TestClass);
        });

        it('should return true if specified function is registered', () => {
            expect(container.IsRegistered(TestClass)).toBeTruthy();
            expect(container.IsRegistered('TestClass')).toBeTruthy();
        });
        it('should return false if specified function is not registered', () => {
            expect(container.IsRegistered(OtherClass)).toBeFalsy();
            expect(container.IsRegistered('OtherClass')).toBeFalsy();
        });
        it('should throw error if function is null', () => {
            expect(() => container.IsRegistered(null)).toThrow();
        });
        it('should throw error if function is undefined', () => {
            expect(() => container.IsRegistered(undefined)).toThrow();
        });
        it('should throw error if argument is not a function nor a string', () => {
            expect(() => container.IsRegistered([])).toThrow();
        });
        it('should throw error if argument is an empty string', () => {
            expect(() => container.IsRegistered('')).toThrow();
            expect(() => container.IsRegistered('   ')).toThrow();
        });
        it('should throw error if argument is an anonymous function', () => {
            expect(() => container.IsRegistered(function(arg) {})).toThrow();
        });
    });

    describe('Register', () => {
        it('should provide possibility to register class', () => {
            container.Register(TestClass);
            expect(container.IsRegistered(TestClass)).toBeTruthy();
        });
        it('should accept registration of anonymous functions', () => {
            container.Register('anonymousService', function(arg1, arg2) {});
            expect(container.IsRegistered('anonymousService')).toBeTruthy();
        });
        it('should throw error if function is already registered', () => {
            container.Register(TestClass);
            expect(() => container.Register(TestClass)).toThrow();
        });
        it('should throw error if invoked without arguments', () => {
            expect(() => container.Register()).toThrow();
        });
        it('should throw error if invoked with more than two arguments',() => {
            expect(() => container.Register('one', 'two', 'three')).toThrow();
        });
        it('should throw error if argument is not a function', () => {
            expect(() => container.Register('one')).toThrow();
        });
        it('should throw error if argument is null', () => {
            expect(() => container.Register(null)).toThrow();
        });
        it('should throw error if argument is undefined', () => {
            expect(() => container.Register(undefined)).toThrow();
        });
        it('should throw error if function is anonymous', () => {
            expect(() => container.Register(function(arg) {})).toThrow();
        });
        it('should throw error if first argument is null', () => {
            expect(() => container.Register(null, function(arg) {})).toThrow();
        });
        it('should throw error if first argument is undefined', () => {
            expect(() => container.Register(undefined, function(arg) {})).toThrow();
        })
        it('should throw error if first argument is not a string', () => {
            expect(() => container.Register([], function (arg){})).toThrow();
        });
        it('should throw error if first argument is an empty string', () => {
            expect(() => container.Register('', function (arg) {})).toThrow();
            expect(() => container.Register('  ', function (arg) {})).toThrow();
        });
        it('should throw error if second argument is null', () => {
            expect(() => container.Register('functionName', null)).toThrow();
        });
        it('should throw error if second argument is undefined', () => {
            expect(() => container.Register('functionName', undefined)).toThrow();
        });
        it('should throw error if second argument is not a function', () => {
            expect(() => container.Register('functionName','not a function')).toThrow();
        });
        it('should throw error if anonymous function is registered as a class (with UpperCamelCase key)', () => {
            expect(() => container.Register('SomeClass', () => { return 'function'; })).toThrow();
        });
        it('should throw error if key is not a valid identifier', () => {
            expect(() => container.Register('some Identifier', () => {})).toThrow();
            expect(() => container.Register('Some Identifier', TestClass)).toThrow();
        });
    });

    describe('Resolve', () => {
        function function1() {
            return 'function1';
        }
        function function3() {
            this.value = 'function3';
        }
        beforeEach(() => {
            container.Register(function1);
            container.Register('function2', () => { return 'function2'; });
            container.Register(TestClass);
            container.Register('TestClass2', function3);
        });
        it('should resolve function registered with its original name', () => {
            var fn = container.Resolve('function1');
            expect(fn()).toBe('function1');
        });
        it('should resolve anonymous function registered with custom name', () => {
            var fn = container.Resolve('function2');
            expect(fn()).toBe('function2');
        });
        it('should resolve class registered with its original name', () => {
            var obj = container.Resolve('TestClass');
            expect(typeof obj).toBe('object');
            expect(obj.value).toBe('TestClass');
        });
        it('should resolve class registered with custom name', () => {
            var obj = container.Resolve('TestClass2');
            expect(typeof obj).toBe('object');
            expect(obj.value).toBe('function3');
        });
    });
});

class TestClass {
    value:string = 'TestClass';
    someString:string;
    someNumber:number;
    static $inject = ['SomeStringService','SomeNumberService'];
    constructor (someString:string, someNumber:number) {
        this.someString = someString;
        this.someNumber = someNumber;
    }
}

class OtherClass {
}
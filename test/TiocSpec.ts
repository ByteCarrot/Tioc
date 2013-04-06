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
    describe('isObject', () => {
        it('should return true if value is an object', () => {
            expect(Value.isObject({})).toBeTruthy();
            expect(Value.isObject(new TestClass2())).toBeTruthy();
        });
        it('should return false if value is not an object', () => {
            expect(Value.isObject(undefined)).toBeFalsy();
            expect(Value.isObject(null)).toBeFalsy();
            expect(Value.isObject('')).toBeFalsy();
            expect(Value.isObject([])).toBeFalsy();
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
        function testFunction() {}
        it('should return true if value is a function', () => {
            expect(Value.isFunction(function () {
            })).toBeTruthy();
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
            var fn = function (arg1, arg2) {
            };
            var info = reflector.analyze(fn);
            expect(info.name).toBe(null);
            expect(info.kind).toBe('function');
            expect(info.members.length).toBe(2);
            expect(info.members[0]).toBe('arg1');
            expect(info.members[1]).toBe('arg2');
        });
        it('should be able to analyze anonymous function without arguments', () => {
            var fn = function () {
            };
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
            expect(info.members[0]).toBe('dependency1');
            expect(info.members[1]).toBe('dependency2');
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
    describe('isRegistered', () => {
        beforeEach(() => {
            container.registerClass(TestClass);
            container.registerClass('TestClass2', TestClass);
            container.registerFunction(testFunction);
            container.registerFunction('testFunction2', testFunction);
        });
        it('should return true if specified class is registered', () => {
            expect(container.isRegistered('testClass')).toBeTruthy();
        });
        it('should return true if specified function is registered', () => {
            expect(container.isRegistered('testFunction')).toBeTruthy();
        });
        it('should return false if specified class is not registered', () => {
            expect(container.isRegistered('OtherClass')).toBeFalsy();
        });
        it('should return false if specified function is not registered', () => {
            expect(container.isRegistered('otherFunction')).toBeFalsy();
        });
        it('should throw error if key is undefined', () => {
            expect(() => container.isRegistered(undefined)).toThrow();
        });
        it('should throw error if key is null', () => {
            expect(() => container.isRegistered(null)).toThrow();
        });
        it('should throw error if key is not a string', () => {
            expect(() => container.isRegistered([])).toThrow();
            expect(() => container.isRegistered(function (){})).toThrow();
        });
        it('should throw error if key is an empty string', () => {
            expect(() => container.isRegistered('')).toThrow();
            expect(() => container.isRegistered('   ')).toThrow();
        });
    });
    describe('registerClass method', () => {
        describe('invoked with one argument', () => {
            it('should throw error if argument is not a valid class definition', () => {
                expect(() => container.registerClass(undefined)).toThrow();
                expect(() => container.registerClass(null)).toThrow();
                expect(() => container.registerClass('')).toThrow();
                expect(() => container.registerClass({})).toThrow();
            });
            it('should throw error if argument is anonymous function', () => {
                expect(() => container.registerClass(function (arg) {})).toThrow();
            });
            it('should throw error if element with specified key is already registered', () => {
                container.registerClass(TestClass);
                expect(() => container.registerClass(TestClass)).toThrow();
            });
            it('should register class using its original name', () => {
                container.registerClass(TestClass);
                expect(container.isRegistered('testClass')).toBeTruthy();
            });
            it('should register class with lower camel case name', () => {
                container.registerClass(TestClass);
                expect(container.isRegistered('testClass')).toBeTruthy();
            });
        });
        describe('invoked with two arguments', () => {
            it('should throw error if key is not a string', () => {
                expect(() => container.registerClass(undefined, TestClass)).toThrow();
                expect(() => container.registerClass(null, TestClass)).toThrow();
                expect(() => container.registerClass('', TestClass)).toThrow();
                expect(() => container.registerClass({}, TestClass)).toThrow();
                expect(() => container.registerClass('      ', TestClass)).toThrow();
            });
            it('should throw error if key is not a valid JavaScript identifier', () => {
                expect(() => container.registerClass(' 5_asd-? ', TestClass)).toThrow();
            });
            it('should throw error if value is not a valid class definition', () => {
                expect(() => container.registerClass('someKey', undefined)).toThrow();
                expect(() => container.registerClass('someKey', null)).toThrow();
                expect(() => container.registerClass('someKey', '')).toThrow();
                expect(() => container.registerClass('someKey', {})).toThrow();
            });
            it('should throw error if value is anonymous function', () => {
                expect(() => container.registerClass('someKey', function () {})).toThrow();
            });
            it('should throw error if element with specified key is already registered', () => {
                container.registerClass('someKey', TestClass);
                expect(() => container.registerClass('someKey', TestClass)).toThrow();
            });
            it('should register class using specified key', () => {
                container.registerClass('someKey', TestClass);
                expect(container.isRegistered('someKey')).toBeTruthy();
            });
        });
        describe('invoked with invalid count of arguments', () => {
            it('should throw error', () => {
                expect(() => container.registerClass()).toThrow();
                expect(() => container.registerClass('someKey', TestClass, 123)).toThrow();
            });
        });
    });
    describe('registerFunction method', () => {
        describe('invoked with one argument', () => {
            it('should throw error if argument is not a valid function', () => {
                expect(() => container.registerFunction(undefined)).toThrow();
                expect(() => container.registerFunction(null)).toThrow();
                expect(() => container.registerFunction('')).toThrow();
                expect(() => container.registerFunction({})).toThrow();
            });
            it('should throw error if argument is anonymous function', () => {
                expect(() => container.registerFunction(function (arg) {
                })).toThrow();
            });
            it('should throw error if element with specified key is already registered', () => {
                function someFunction() {};
                container.registerFunction(someFunction);
                expect(() => container.registerFunction(someFunction)).toThrow();
            });
            it('should register function using its original name', () => {
                function someFunction() {};
                container.registerFunction(someFunction);
                expect(container.isRegistered('someFunction')).toBeTruthy();
            });
            it('should register function with lower camel case name', () => {
                function SomeUpperCamelCaseFunction() {};
                container.registerFactory(SomeUpperCamelCaseFunction);
                expect(container.isRegistered('someUpperCamelCaseFunction')).toBeTruthy();
            });
        });
        describe('invoked with two arguments', () => {
            it('should throw error if key is not a string', () => {
                expect(() => container.registerFunction(undefined, testFunction)).toThrow();
                expect(() => container.registerFunction(null, testFunction)).toThrow();
                expect(() => container.registerFunction('', testFunction)).toThrow();
                expect(() => container.registerFunction({}, testFunction)).toThrow();
                expect(() => container.registerFunction('    ', testFunction)).toThrow();
            });
            it('should throw error if key is not a valid JavaScript identifier', () => {
                expect(() => container.registerFunction(' 4_asd-? ', testFunction)).toThrow();
            });
            it('should throw error if value is not a valid function', () => {
                expect(() => container.registerFunction('someKey', undefined)).toThrow();
                expect(() => container.registerFunction('someKey', null)).toThrow();
                expect(() => container.registerFunction('someKey', '')).toThrow();
                expect(() => container.registerFunction('someKey', {})).toThrow();
            });
            it('should throw error if element with specified key is already registered', () => {
                container.registerFunction('someKey', testFunction);
                expect(() => container.registerFunction('someKey', testFunction)).toThrow();
            });
            it('should register function using specified key', () => {
                container.registerFunction('someKey', testFunction);
                expect(container.isRegistered('someKey')).toBeTruthy();
            });
        });
        describe('invoked with invalid count of arguments', () => {
            it('should throw error', () => {
                expect(() => container.registerFunction('someKey', testFunction, 123)).toThrow();
            });
        });
    });
    describe('registerFactory method', () => {
        describe('invoked with one argument', () => {
            it('should throw error if argument is not a valid function', () => {
                expect(() => container.registerFactory(undefined)).toThrow();
                expect(() => container.registerFactory(null)).toThrow();
                expect(() => container.registerFactory('')).toThrow();
                expect(() => container.registerFactory({})).toThrow();
            });
            it('should throw error if argument is anonymous function', () => {
                expect(() => container.registerFactory(function (arg) {})).toThrow();
            });
            it('should throw error if element with specified key is already registered', () => {
                function someFunction() {};
                container.registerFactory(someFunction);
                expect(() => container.registerFactory(someFunction)).toThrow();
            });
            it('should register function using its original name', () => {
                function someFunction() {};
                container.registerFactory(someFunction);
                expect(container.isRegistered('someFunction')).toBeTruthy();
            });
            it('should register function with lower camel case name', () => {
                function SomeUpperCamelCaseFactory() {};
                container.registerFactory(SomeUpperCamelCaseFactory);
                expect(container.isRegistered('someUpperCamelCaseFactory')).toBeTruthy();
            });
        });
        describe('invoked with two arguments', () => {
            it('should throw error if key is not a string', () => {
                expect(() => container.registerFactory(undefined, testFunction)).toThrow();
                expect(() => container.registerFactory(null, testFunction)).toThrow();
                expect(() => container.registerFactory('', testFunction)).toThrow();
                expect(() => container.registerFactory({}, testFunction)).toThrow();
                expect(() => container.registerFactory('    ', testFunction)).toThrow();
            });
            it('should throw error if key is not a valid JavaScript identifier', () => {
                expect(() => container.registerFactory(' 4_asd-? ', testFunction)).toThrow();
            });
            it('should throw error if value is not a valid function', () => {
                expect(() => container.registerFactory('someKey', undefined)).toThrow();
                expect(() => container.registerFactory('someKey', null)).toThrow();
                expect(() => container.registerFactory('someKey', '')).toThrow();
                expect(() => container.registerFactory('someKey', {})).toThrow();
            });
            it('should throw error if element with specified key is already registered', () => {
                container.registerFactory('someKey', testFunction);
                expect(() => container.registerFactory('someKey', testFunction)).toThrow();
            });
            it('should register function using specified key', () => {
                container.registerFactory('someKey', testFunction);
                expect(container.isRegistered('someKey')).toBeTruthy();
            });
        });
        describe('invoked with invalid count of arguments', () => {
            it('should throw error', () => {
                expect(() => container.registerFactory('someKey', testFunction, 123)).toThrow();
            });
        });
    });
    describe('registerValue method', () => {
        it('should throw error if key is not a string', () => {
            expect(() => container.registerValue(undefined, {})).toThrow();
            expect(() => container.registerValue(null, {})).toThrow();
            expect(() => container.registerValue('', {})).toThrow();
            expect(() => container.registerValue({}, {})).toThrow();
            expect(() => container.registerValue('     ', {})).toThrow();
        });
        it('should throw error if key is not a valid JavaScript identifier', () => {
            expect(() => container.registerValue(' 4_asd-? ', {})).toThrow();
        });
        it('should throw error if value is undefined', () => {
            expect(() => container.registerValue('someKey', undefined)).toThrow();
        });
        it('should throw error if element with specified key is already registered', () => {
            container.registerValue('someKey', {});
            expect(() => container.registerValue('someKey', {})).toThrow();
        });
        it('should register value using specified key', () => {
            container.registerValue('someKey', { value: 'someValue' });
            expect(container.isRegistered('someKey')).toBeTruthy();
        });
    });
    describe('registerModule method', () => {
        it('should throw error if value is not a valid module', () => {
            expect(() => container.registerModule(undefined)).toThrow();
            expect(() => container.registerModule(null)).toThrow();
            expect(() => container.registerModule('')).toThrow();
            expect(() => container.registerModule(testFunction)).toThrow();
            expect(() => container.registerModule({})).toThrow();
        });
        it('should register all exported types from registered module', () => {
            container.registerModule(ByteCarrot.TestModule);
            expect(container.isRegistered('class1')).toBeTruthy();
            expect(container.isRegistered('class2')).toBeTruthy();
        });
        it('should register all exported classes with lower camel case names', () => {
            container.registerModule(ByteCarrot.TestModule);
            expect(container.isRegistered('class1')).toBeTruthy();
            expect(container.isRegistered('class2')).toBeTruthy();
        });
    });
    describe('resolve method', () => {
        beforeEach(() => {
            container.registerClass(TestClass);
            container.registerClass('dependency1', TestClass2);
            container.registerFunction(testFunction);
            container.registerFunction('dependency2', testFunction2);
            container.registerFactory(testFactory);
            container.registerFactory(testFactory2);
            container.registerFactory('dependency3', () => { return 'dependency3'; });
        });
        describe('should return class', () => {
            it('registered with its original name', () => {
                var obj = container.resolve('testClass');
                expect(typeof obj).toBe('object');
                expect(obj.value).toBe('TestClass');
            });
            it('registered with custom name', () => {
                var obj = container.resolve('dependency1');
                expect(typeof obj).toBe('object');
                expect(obj.value).toBe('TestClass2');
            });
            it('with dependencies injected', () => {
                var obj = container.resolve('testClass');
                expect(obj.value).toBe('TestClass');
                expect(obj.dependency1.value).toBe('TestClass2');
                expect(obj.dependency2()).toBe('testFunction2');
            });
        });
        describe('should return function', () => {
            it('registered with its original name', () => {
                var fn = container.resolve('testFunction');
                expect(typeof fn).toBe('function');
                expect(fn()).toBe('testFunction');
            });
            it('registered with custom name', () => {
                var fn = container.resolve('dependency2');
                expect(typeof fn).toBe('function');
                expect(fn()).toBe('testFunction2');
            });
        });
        describe('should return factory result', () => {
            it('registered with its original name', () => {
                var res = container.resolve('testFactory');
                expect(res).toBe('testFactory');
            });
            it('registered with custom name', () => {
                var res = container.resolve('testFactory2');
                expect(res).toBe('<dependency3>');
            });
            it('registered as anonymous function', () => {
                var res = container.resolve('dependency3');
                expect(res).toBe('dependency3');
            });
        });
        it('should throw error if key not found', () => {
            expect(() => container.resolve('NotExistingKey')).toThrow();
        });
    });
    it('should register itself with "container" key', () => {
        expect(container.isRegistered('container')).toBeTruthy();
    });
    it('should inject itself as dependency when required', () => {
        container.registerFactory('something', (container) => { return container; });
        var c = container.resolve('something');
        expect(c).toBe(container);
    });
    it('should throw error if dependency cannot be resolved', () => {
        container.registerFactory('something', (notExistingDependency) => { return null; });
        expect(() => container.resolve('something')).toThrow();
    })
    it('should prevent circular dependencies and throw error', () => {
        container.registerFactory('something', (something) => { return null; })
        expect(() => container.resolve('something')).toThrow("Circular dependency found");
    });
    it('should resolve more complex types of dependencies', () => {
        container.registerFactory('something1', () => { return null; });
        container.registerFactory('something2', (something1) => { return null; });
        container.registerFactory('something3', (something1, something2) => { return null; });
        container.resolve('something3');
    });
});

class TestClass {
    public value:string = 'TestClass';
    constructor(public dependency1, public dependency2) {
    }
}

class TestClass2 {
    public value:string = 'TestClass2';
}

function testFunction() {
    return 'testFunction';
}

function testFunction2() {
    return 'testFunction2';
}

function testFactory() {
    return 'testFactory';
}

function testFactory2(dependency3) {
    return '<' + dependency3 + '>';
}

module ByteCarrot.TestModule {
    export class Class1 {
    }

    export class Class2 {
        constructor(public class1:Class1) {
        }
    }
}
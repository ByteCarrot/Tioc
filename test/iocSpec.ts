/// <reference path="jasmine.d.ts" />
/// <reference path="../src/ioc.ts" />

class TestClass {
    someString:string;
    someNumber:number;
    $inject:string[] = ['SomeClass','SomeClass2'];
    constructor (someString:string, someNumber:number) {
        this.someString = someString;
        this.someNumber = someNumber;
    }
}

class OtherClass {
}

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
            expect(info.args.length).toBe(2);
            expect(info.args[0]).toBe('arg1');
            expect(info.args[1]).toBe('arg2');
        });
        it('should be able to analyze anonymous function without arguments', () => {
            var fn = function() {};
            var info = reflector.analyze(fn);
            expect(info.name).toBe(null);
            expect(info.kind).toBe('function');
            expect(info.args.length).toBe(0);
        });
        it('should be able to analyze standard JavaScript function', () => {
            function SomeTestFunction(argx, argy) {
            }
            var info = reflector.analyze(SomeTestFunction);
            expect(info.name).toBe('SomeTestFunction');
            expect(info.kind).toBe('function');
            expect(info.args.length).toBe(2);
            expect(info.args[0]).toBe('argx');
            expect(info.args[1]).toBe('argy');
        });
        it('should be able to analyze class constructor', () => {
            var info = reflector.analyze(TestClass);
            expect(info.name).toBe('TestClass');
            expect(info.kind).toBe('function');
            expect(info.args.length).toBe(2);
            expect(info.args[0]).toBe('someString');
            expect(info.args[1]).toBe('someNumber');
        });
        it('should throw error when argument is not a function', () => {
            expect(() => reflector.analyze('')).toThrow();
            expect(() => reflector.analyze(undefined)).toThrow();
            expect(() => reflector.analyze(null)).toThrow();
            expect(() => reflector.analyze({})).toThrow();
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
            expect(() => container.Register(function(arg) {}).toThrow());
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
    });

    describe('Resolve', () => {
        beforeEach(() => { 
        });
    });
});
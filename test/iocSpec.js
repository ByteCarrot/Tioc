var TestClass = (function () {
    function TestClass(someString, someNumber) {
        this.$inject = [
            'SomeClass', 
            'SomeClass2'
        ];
        this.someString = someString;
        this.someNumber = someNumber;
    }
    return TestClass;
})();
var OtherClass = (function () {
    function OtherClass() { }
    return OtherClass;
})();
describe('Reflector', function () {
    var reflector;
    beforeEach(function () {
        reflector = new ByteCarrot.Tioc.Reflector();
    });
    describe('analyze', function () {
        it('should be able to analyze anonymous function', function () {
            var fn = function (arg1, arg2) {
            };
            var info = reflector.analyze(fn);
            expect(info.name).toBe(null);
            expect(info.kind).toBe('function');
            expect(info.args.length).toBe(2);
            expect(info.args[0]).toBe('arg1');
            expect(info.args[1]).toBe('arg2');
        });
        it('should be able to analyze anonymous function without arguments', function () {
            var fn = function () {
            };
            var info = reflector.analyze(fn);
            expect(info.name).toBe(null);
            expect(info.kind).toBe('function');
            expect(info.args.length).toBe(0);
        });
        it('should be able to analyze standard JavaScript function', function () {
            function SomeTestFunction(argx, argy) {
            }
            var info = reflector.analyze(SomeTestFunction);
            expect(info.name).toBe('SomeTestFunction');
            expect(info.kind).toBe('function');
            expect(info.args.length).toBe(2);
            expect(info.args[0]).toBe('argx');
            expect(info.args[1]).toBe('argy');
        });
        it('should be able to analyze class constructor', function () {
            var info = reflector.analyze(TestClass);
            expect(info.name).toBe('TestClass');
            expect(info.kind).toBe('function');
            expect(info.args.length).toBe(2);
            expect(info.args[0]).toBe('someString');
            expect(info.args[1]).toBe('someNumber');
        });
        it('should throw error when argument is not a function', function () {
            expect(function () {
                return reflector.analyze('');
            }).toThrow();
            expect(function () {
                return reflector.analyze(undefined);
            }).toThrow();
            expect(function () {
                return reflector.analyze(null);
            }).toThrow();
            expect(function () {
                return reflector.analyze({
                });
            }).toThrow();
        });
    });
});
describe('Container', function () {
    var container;
    beforeEach(function () {
        container = new ByteCarrot.Tioc.Container();
    });
    describe('IsRegistered', function () {
        beforeEach(function () {
            container.Register(TestClass);
        });
        it('should return true if specified function is registered', function () {
            expect(container.IsRegistered(TestClass)).toBeTruthy();
            expect(container.IsRegistered('TestClass')).toBeTruthy();
        });
        it('should return false if specified function is not registered', function () {
            expect(container.IsRegistered(OtherClass)).toBeFalsy();
            expect(container.IsRegistered('OtherClass')).toBeFalsy();
        });
        it('should throw error if function is null', function () {
            expect(function () {
                return container.IsRegistered(null);
            }).toThrow();
        });
        it('should throw error if function is undefined', function () {
            expect(function () {
                return container.IsRegistered(undefined);
            }).toThrow();
        });
        it('should throw error if argument is not a function nor a string', function () {
            expect(function () {
                return container.IsRegistered([]);
            }).toThrow();
        });
        it('should throw error if argument is an empty string', function () {
            expect(function () {
                return container.IsRegistered('');
            }).toThrow();
            expect(function () {
                return container.IsRegistered('   ');
            }).toThrow();
        });
        it('should throw error if argument is an anonymous function', function () {
            expect(function () {
                return container.IsRegistered(function (arg) {
                });
            }).toThrow();
        });
    });
    describe('Register', function () {
        it('should provide possibility to register class', function () {
            container.Register(TestClass);
            expect(container.IsRegistered(TestClass)).toBeTruthy();
        });
        it('should accept registration of anonymous functions', function () {
            container.Register('anonymousService', function (arg1, arg2) {
            });
            expect(container.IsRegistered('anonymousService')).toBeTruthy();
        });
        it('should throw error if function is already registered', function () {
            container.Register(TestClass);
            expect(function () {
                return container.Register(TestClass);
            }).toThrow();
        });
        it('should throw error if invoked without arguments', function () {
            expect(function () {
                return container.Register();
            }).toThrow();
        });
        it('should throw error if invoked with more than two arguments', function () {
            expect(function () {
                return container.Register('one', 'two', 'three');
            }).toThrow();
        });
        it('should throw error if argument is not a function', function () {
            expect(function () {
                return container.Register('one');
            }).toThrow();
        });
        it('should throw error if argument is null', function () {
            expect(function () {
                return container.Register(null);
            }).toThrow();
        });
        it('should throw error if argument is undefined', function () {
            expect(function () {
                return container.Register(undefined);
            }).toThrow();
        });
        it('should throw error if function is anonymous', function () {
            expect(function () {
                return container.Register(function (arg) {
                }).toThrow();
            });
        });
        it('should throw error if first argument is null', function () {
            expect(function () {
                return container.Register(null, function (arg) {
                });
            }).toThrow();
        });
        it('should throw error if first argument is undefined', function () {
            expect(function () {
                return container.Register(undefined, function (arg) {
                });
            }).toThrow();
        });
        it('should throw error if first argument is not a string', function () {
            expect(function () {
                return container.Register([], function (arg) {
                });
            }).toThrow();
        });
        it('should throw error if first argument is an empty string', function () {
            expect(function () {
                return container.Register('', function (arg) {
                });
            }).toThrow();
            expect(function () {
                return container.Register('  ', function (arg) {
                });
            }).toThrow();
        });
        it('should throw error if second argument is null', function () {
            expect(function () {
                return container.Register('functionName', null);
            }).toThrow();
        });
        it('should throw error if second argument is undefined', function () {
            expect(function () {
                return container.Register('functionName', undefined);
            }).toThrow();
        });
        it('should throw error if second argument is not a function', function () {
            expect(function () {
                return container.Register('functionName', 'not a function');
            }).toThrow();
        });
    });
    describe('Resolve', function () {
        beforeEach(function () {
        });
    });
});
//@ sourceMappingURL=iocSpec.js.map

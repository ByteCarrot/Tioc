var TestClass = (function () {
    function TestClass(someString, someNumber) {
        this.value = 'TestClass';
        this.someString = someString;
        this.someNumber = someNumber;
    }
    TestClass.$inject = [
        'SomeStringService', 
        'SomeNumberService'
    ];
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
describe('Activator', function () {
    var activator;
    beforeEach(function () {
        activator = new ByteCarrot.Tioc.Activator();
    });
    describe('createInstance', function () {
        function Test() {
            this.value = 'Test class';
        }
        function Test2(value) {
            this.value = value;
        }
        it('should create instance using parameterless constructor', function () {
            var obj = activator.createInstance(Test, []);
            expect(typeof obj).toBe('object');
            expect(obj.value).toBe('Test class');
        });
        it('should create instance using constructor with a single argument', function () {
            var obj = activator.createInstance(Test2, [
                'alamakota'
            ]);
            expect(typeof obj).toBe('object');
            expect(obj.value).toBe('alamakota');
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
        it('should throw error if anonymous function is registered as a class (with UpperCamelCase key)', function () {
            expect(function () {
                return container.Register('SomeClass', function () {
                    return 'function';
                });
            }).toThrow();
        });
        it('should throw error if key is not a valid identifier', function () {
            expect(function () {
                return container.Register('some Identifier', function () {
                });
            }).toThrow();
            expect(function () {
                return container.Register('Some Identifier', TestClass);
            }).toThrow();
        });
    });
    describe('Resolve', function () {
        function function1() {
            return 'function1';
        }
        function function3() {
            this.value = 'function3';
        }
        beforeEach(function () {
            container.Register(function1);
            container.Register('function2', function () {
                return 'function2';
            });
            container.Register(TestClass);
            container.Register('TestClass2', function3);
        });
        it('should resolve function registered with its original name', function () {
            var fn = container.Resolve('function1');
            expect(fn()).toBe('function1');
        });
        it('should resolve anonymous function registered with custom name', function () {
            var fn = container.Resolve('function2');
            expect(fn()).toBe('function2');
        });
        it('should resolve class registered with its original name', function () {
            var obj = container.Resolve('TestClass');
            expect(typeof obj).toBe('object');
            expect(obj.value).toBe('TestClass');
        });
        it('should resolve class registered with custom name', function () {
            var obj = container.Resolve('TestClass2');
            expect(typeof obj).toBe('object');
            expect(obj.value).toBe('function3');
        });
    });
});
//@ sourceMappingURL=TiocSpec.js.map

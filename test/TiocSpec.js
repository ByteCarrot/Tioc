describe('Value', function () {
    var Value = ByteCarrot.Tioc.Value;
    describe('isString', function () {
        it('should return true if value is a string', function () {
            expect(Value.isString('')).toBeTruthy();
            expect(Value.isString('    ')).toBeTruthy();
            expect(Value.isString('lkasjd laskdj')).toBeTruthy();
        });
        it('should return false if value is not a string', function () {
            expect(Value.isString(undefined)).toBeFalsy();
            expect(Value.isString(null)).toBeFalsy();
            expect(Value.isString({
            })).toBeFalsy();
            expect(Value.isString([])).toBeFalsy();
        });
    });
    describe('isObject', function () {
        it('should return true if value is an object', function () {
            expect(Value.isObject({
            })).toBeTruthy();
            expect(Value.isObject(new TestClass2())).toBeTruthy();
        });
        it('should return false if value is not an object', function () {
            expect(Value.isObject(undefined)).toBeFalsy();
            expect(Value.isObject(null)).toBeFalsy();
            expect(Value.isObject('')).toBeFalsy();
            expect(Value.isObject([])).toBeFalsy();
        });
    });
    describe('isNotEmptyString', function () {
        it('should return true if value is not an empty string', function () {
            expect(Value.isNotEmptyString('d')).toBeTruthy();
            expect(Value.isNotEmptyString(' asdas    ')).toBeTruthy();
        });
        it('should return false if value is not a string nor empty string', function () {
            expect(Value.isNotEmptyString(undefined)).toBeFalsy();
            expect(Value.isNotEmptyString(null)).toBeFalsy();
            expect(Value.isNotEmptyString({
            })).toBeFalsy();
            expect(Value.isNotEmptyString('   ')).toBeFalsy();
            expect(Value.isNotEmptyString('')).toBeFalsy();
        });
    });
    describe('isFunction', function () {
        function testFunction() {
        }
        it('should return true if value is a function', function () {
            expect(Value.isFunction(function () {
            })).toBeTruthy();
            expect(Value.isFunction(testFunction)).toBeTruthy();
        });
        it('should return false if value is not a function', function () {
            expect(Value.isFunction(undefined)).toBeFalsy();
            expect(Value.isFunction(null)).toBeFalsy();
            expect(Value.isFunction('')).toBeFalsy();
            expect(Value.isFunction({
            })).toBeFalsy();
        });
    });
    describe('isIdentifier', function () {
        it('should return true if value is a valid identifier', function () {
            expect(Value.isIdentifier('AlaMaKota')).toBeTruthy();
            expect(Value.isIdentifier('alaMaKota33_33')).toBeTruthy();
            expect(Value.isIdentifier('_alaMa_KOTA')).toBeTruthy();
        });
        it('should return false if value is not a valid identifier', function () {
            expect(Value.isIdentifier(undefined)).toBeFalsy();
            expect(Value.isIdentifier(null)).toBeFalsy();
            expect(Value.isIdentifier('  ')).toBeFalsy();
            expect(Value.isIdentifier('3alaMaKota'));
        });
    });
});
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
            expect(info.members.length).toBe(2);
            expect(info.members[0]).toBe('arg1');
            expect(info.members[1]).toBe('arg2');
        });
        it('should be able to analyze anonymous function without arguments', function () {
            var fn = function () {
            };
            var info = reflector.analyze(fn);
            expect(info.name).toBe(null);
            expect(info.kind).toBe('function');
            expect(info.members.length).toBe(0);
        });
        it('should be able to analyze standard JavaScript function', function () {
            function SomeTestFunction(argx, argy) {
            }
            var info = reflector.analyze(SomeTestFunction);
            expect(info.name).toBe('SomeTestFunction');
            expect(info.kind).toBe('function');
            expect(info.members.length).toBe(2);
            expect(info.members[0]).toBe('argx');
            expect(info.members[1]).toBe('argy');
        });
        it('should be able to analyze class constructor', function () {
            var info = reflector.analyze(TestClass);
            expect(info.name).toBe('TestClass');
            expect(info.kind).toBe('function');
            expect(info.members.length).toBe(2);
            expect(info.members[0]).toBe('dependency1');
            expect(info.members[1]).toBe('dependency2');
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
    describe('isRegistered', function () {
        beforeEach(function () {
            container.registerClass(TestClass);
            container.registerClass('TestClass2', TestClass);
            container.registerFunction(testFunction);
            container.registerFunction('testFunction2', testFunction);
        });
        it('should return true if specified class is registered', function () {
            expect(container.isRegistered('testClass')).toBeTruthy();
        });
        it('should return true if specified function is registered', function () {
            expect(container.isRegistered('testFunction')).toBeTruthy();
        });
        it('should return false if specified class is not registered', function () {
            expect(container.isRegistered('OtherClass')).toBeFalsy();
        });
        it('should return false if specified function is not registered', function () {
            expect(container.isRegistered('otherFunction')).toBeFalsy();
        });
        it('should throw error if key is undefined', function () {
            expect(function () {
                return container.isRegistered(undefined);
            }).toThrow();
        });
        it('should throw error if key is null', function () {
            expect(function () {
                return container.isRegistered(null);
            }).toThrow();
        });
        it('should throw error if key is not a string', function () {
            expect(function () {
                return container.isRegistered([]);
            }).toThrow();
            expect(function () {
                return container.isRegistered(function () {
                });
            }).toThrow();
        });
        it('should throw error if key is an empty string', function () {
            expect(function () {
                return container.isRegistered('');
            }).toThrow();
            expect(function () {
                return container.isRegistered('   ');
            }).toThrow();
        });
    });
    describe('registerClass method', function () {
        describe('invoked with one argument', function () {
            it('should throw error if argument is not a valid class definition', function () {
                expect(function () {
                    return container.registerClass(undefined);
                }).toThrow();
                expect(function () {
                    return container.registerClass(null);
                }).toThrow();
                expect(function () {
                    return container.registerClass('');
                }).toThrow();
                expect(function () {
                    return container.registerClass({
                    });
                }).toThrow();
            });
            it('should throw error if argument is anonymous function', function () {
                expect(function () {
                    return container.registerClass(function (arg) {
                    });
                }).toThrow();
            });
            it('should throw error if element with specified key is already registered', function () {
                container.registerClass(TestClass);
                expect(function () {
                    return container.registerClass(TestClass);
                }).toThrow();
            });
            it('should register class using its original name', function () {
                container.registerClass(TestClass);
                expect(container.isRegistered('testClass')).toBeTruthy();
            });
            it('should register class with lower camel case name', function () {
                container.registerClass(TestClass);
                expect(container.isRegistered('testClass')).toBeTruthy();
            });
        });
        describe('invoked with two arguments', function () {
            it('should throw error if key is not a string', function () {
                expect(function () {
                    return container.registerClass(undefined, TestClass);
                }).toThrow();
                expect(function () {
                    return container.registerClass(null, TestClass);
                }).toThrow();
                expect(function () {
                    return container.registerClass('', TestClass);
                }).toThrow();
                expect(function () {
                    return container.registerClass({
                    }, TestClass);
                }).toThrow();
                expect(function () {
                    return container.registerClass('      ', TestClass);
                }).toThrow();
            });
            it('should throw error if key is not a valid JavaScript identifier', function () {
                expect(function () {
                    return container.registerClass(' 5_asd-? ', TestClass);
                }).toThrow();
            });
            it('should throw error if value is not a valid class definition', function () {
                expect(function () {
                    return container.registerClass('someKey', undefined);
                }).toThrow();
                expect(function () {
                    return container.registerClass('someKey', null);
                }).toThrow();
                expect(function () {
                    return container.registerClass('someKey', '');
                }).toThrow();
                expect(function () {
                    return container.registerClass('someKey', {
                    });
                }).toThrow();
            });
            it('should throw error if value is anonymous function', function () {
                expect(function () {
                    return container.registerClass('someKey', function () {
                    });
                }).toThrow();
            });
            it('should throw error if element with specified key is already registered', function () {
                container.registerClass('someKey', TestClass);
                expect(function () {
                    return container.registerClass('someKey', TestClass);
                }).toThrow();
            });
            it('should register class using specified key', function () {
                container.registerClass('someKey', TestClass);
                expect(container.isRegistered('someKey')).toBeTruthy();
            });
        });
        describe('invoked with invalid count of arguments', function () {
            it('should throw error', function () {
                expect(function () {
                    return container.registerClass();
                }).toThrow();
                expect(function () {
                    return container.registerClass('someKey', TestClass, 123);
                }).toThrow();
            });
        });
        it('should take into account $ioc.singleton setting', function () {
        });
        it('should accept $ioc.singleton === "true" if the class should be treated as a singleton', function () {
            TestSingleton.$ioc = {
                singleton: true
            };
            container.registerClass(TestSingleton);
            var value1 = container.resolve('testSingleton');
            var value2 = container.resolve('testSingleton');
            expect(value1).toBe(value2);
        });
        it('should throw error if value of $ioc.singleton will be different than "true"', function () {
            TestSingleton.$ioc = {
                singleton: false
            };
            expect(function () {
                return container.registerClass('singleton1', TestSingleton);
            }).toThrow();
            TestSingleton.$ioc = {
                singleton: 'abc'
            };
            expect(function () {
                return container.registerClass('singleton2', TestSingleton);
            }).toThrow();
            TestSingleton.$ioc = {
                singleton: null
            };
            expect(function () {
                return container.registerClass('singleton3', TestSingleton);
            }).toThrow();
        });
    });
    describe('registerFunction method', function () {
        describe('invoked with one argument', function () {
            it('should throw error if argument is not a valid function', function () {
                expect(function () {
                    return container.registerFunction(undefined);
                }).toThrow();
                expect(function () {
                    return container.registerFunction(null);
                }).toThrow();
                expect(function () {
                    return container.registerFunction('');
                }).toThrow();
                expect(function () {
                    return container.registerFunction({
                    });
                }).toThrow();
            });
            it('should throw error if argument is anonymous function', function () {
                expect(function () {
                    return container.registerFunction(function (arg) {
                    });
                }).toThrow();
            });
            it('should throw error if element with specified key is already registered', function () {
                function someFunction() {
                }
                ;
                container.registerFunction(someFunction);
                expect(function () {
                    return container.registerFunction(someFunction);
                }).toThrow();
            });
            it('should register function using its original name', function () {
                function someFunction() {
                }
                ;
                container.registerFunction(someFunction);
                expect(container.isRegistered('someFunction')).toBeTruthy();
            });
            it('should register function with lower camel case name', function () {
                function SomeUpperCamelCaseFunction() {
                }
                ;
                container.registerFactory(SomeUpperCamelCaseFunction);
                expect(container.isRegistered('someUpperCamelCaseFunction')).toBeTruthy();
            });
        });
        describe('invoked with two arguments', function () {
            it('should throw error if key is not a string', function () {
                expect(function () {
                    return container.registerFunction(undefined, testFunction);
                }).toThrow();
                expect(function () {
                    return container.registerFunction(null, testFunction);
                }).toThrow();
                expect(function () {
                    return container.registerFunction('', testFunction);
                }).toThrow();
                expect(function () {
                    return container.registerFunction({
                    }, testFunction);
                }).toThrow();
                expect(function () {
                    return container.registerFunction('    ', testFunction);
                }).toThrow();
            });
            it('should throw error if key is not a valid JavaScript identifier', function () {
                expect(function () {
                    return container.registerFunction(' 4_asd-? ', testFunction);
                }).toThrow();
            });
            it('should throw error if value is not a valid function', function () {
                expect(function () {
                    return container.registerFunction('someKey', undefined);
                }).toThrow();
                expect(function () {
                    return container.registerFunction('someKey', null);
                }).toThrow();
                expect(function () {
                    return container.registerFunction('someKey', '');
                }).toThrow();
                expect(function () {
                    return container.registerFunction('someKey', {
                    });
                }).toThrow();
            });
            it('should throw error if element with specified key is already registered', function () {
                container.registerFunction('someKey', testFunction);
                expect(function () {
                    return container.registerFunction('someKey', testFunction);
                }).toThrow();
            });
            it('should register function using specified key', function () {
                container.registerFunction('someKey', testFunction);
                expect(container.isRegistered('someKey')).toBeTruthy();
            });
        });
        describe('invoked with invalid count of arguments', function () {
            it('should throw error', function () {
                expect(function () {
                    return container.registerFunction('someKey', testFunction, 123);
                }).toThrow();
            });
        });
    });
    describe('registerFactory method', function () {
        describe('invoked with one argument', function () {
            it('should throw error if argument is not a valid function', function () {
                expect(function () {
                    return container.registerFactory(undefined);
                }).toThrow();
                expect(function () {
                    return container.registerFactory(null);
                }).toThrow();
                expect(function () {
                    return container.registerFactory('');
                }).toThrow();
                expect(function () {
                    return container.registerFactory({
                    });
                }).toThrow();
            });
            it('should throw error if argument is anonymous function', function () {
                expect(function () {
                    return container.registerFactory(function (arg) {
                    });
                }).toThrow();
            });
            it('should throw error if element with specified key is already registered', function () {
                function someFunction() {
                }
                ;
                container.registerFactory(someFunction);
                expect(function () {
                    return container.registerFactory(someFunction);
                }).toThrow();
            });
            it('should register function using its original name', function () {
                function someFunction() {
                }
                ;
                container.registerFactory(someFunction);
                expect(container.isRegistered('someFunction')).toBeTruthy();
            });
            it('should register function with lower camel case name', function () {
                function SomeUpperCamelCaseFactory() {
                }
                ;
                container.registerFactory(SomeUpperCamelCaseFactory);
                expect(container.isRegistered('someUpperCamelCaseFactory')).toBeTruthy();
            });
        });
        describe('invoked with two arguments', function () {
            it('should throw error if key is not a string', function () {
                expect(function () {
                    return container.registerFactory(undefined, testFunction);
                }).toThrow();
                expect(function () {
                    return container.registerFactory(null, testFunction);
                }).toThrow();
                expect(function () {
                    return container.registerFactory('', testFunction);
                }).toThrow();
                expect(function () {
                    return container.registerFactory({
                    }, testFunction);
                }).toThrow();
                expect(function () {
                    return container.registerFactory('    ', testFunction);
                }).toThrow();
            });
            it('should throw error if key is not a valid JavaScript identifier', function () {
                expect(function () {
                    return container.registerFactory(' 4_asd-? ', testFunction);
                }).toThrow();
            });
            it('should throw error if value is not a valid function', function () {
                expect(function () {
                    return container.registerFactory('someKey', undefined);
                }).toThrow();
                expect(function () {
                    return container.registerFactory('someKey', null);
                }).toThrow();
                expect(function () {
                    return container.registerFactory('someKey', '');
                }).toThrow();
                expect(function () {
                    return container.registerFactory('someKey', {
                    });
                }).toThrow();
            });
            it('should throw error if element with specified key is already registered', function () {
                container.registerFactory('someKey', testFunction);
                expect(function () {
                    return container.registerFactory('someKey', testFunction);
                }).toThrow();
            });
            it('should register function using specified key', function () {
                container.registerFactory('someKey', testFunction);
                expect(container.isRegistered('someKey')).toBeTruthy();
            });
        });
        describe('invoked with invalid count of arguments', function () {
            it('should throw error', function () {
                expect(function () {
                    return container.registerFactory('someKey', testFunction, 123);
                }).toThrow();
            });
        });
    });
    describe('registerValue method', function () {
        it('should throw error if key is not a string', function () {
            expect(function () {
                return container.registerValue(undefined, {
                });
            }).toThrow();
            expect(function () {
                return container.registerValue(null, {
                });
            }).toThrow();
            expect(function () {
                return container.registerValue('', {
                });
            }).toThrow();
            expect(function () {
                return container.registerValue({
                }, {
                });
            }).toThrow();
            expect(function () {
                return container.registerValue('     ', {
                });
            }).toThrow();
        });
        it('should throw error if key is not a valid JavaScript identifier', function () {
            expect(function () {
                return container.registerValue(' 4_asd-? ', {
                });
            }).toThrow();
        });
        it('should throw error if value is undefined', function () {
            expect(function () {
                return container.registerValue('someKey', undefined);
            }).toThrow();
        });
        it('should throw error if element with specified key is already registered', function () {
            container.registerValue('someKey', {
            });
            expect(function () {
                return container.registerValue('someKey', {
                });
            }).toThrow();
        });
        it('should register value using specified key', function () {
            container.registerValue('someKey', {
                value: 'someValue'
            });
            expect(container.isRegistered('someKey')).toBeTruthy();
        });
    });
    describe('registerModule method', function () {
        it('should throw error if value is not a valid module', function () {
            expect(function () {
                return container.registerModule(undefined);
            }).toThrow();
            expect(function () {
                return container.registerModule(null);
            }).toThrow();
            expect(function () {
                return container.registerModule('');
            }).toThrow();
            expect(function () {
                return container.registerModule(testFunction);
            }).toThrow();
            expect(function () {
                return container.registerModule({
                });
            }).toThrow();
        });
        it('should register all exported types from registered module', function () {
            container.registerModule(ByteCarrot.TestModule);
            expect(container.isRegistered('class1')).toBeTruthy();
            expect(container.isRegistered('class2')).toBeTruthy();
        });
        it('should register all exported classes with lower camel case names', function () {
            container.registerModule(ByteCarrot.TestModule);
            expect(container.isRegistered('class1')).toBeTruthy();
            expect(container.isRegistered('class2')).toBeTruthy();
        });
    });
    describe('resolve method', function () {
        beforeEach(function () {
            container.registerClass(TestClass);
            container.registerClass('dependency1', TestClass2);
            container.registerFunction(testFunction);
            container.registerFunction('dependency2', testFunction2);
            container.registerFactory(testFactory);
            container.registerFactory(testFactory2);
            container.registerFactory('dependency3', function () {
                return 'dependency3';
            });
        });
        describe('should return class', function () {
            it('registered with its original name', function () {
                var obj = container.resolve('testClass');
                expect(typeof obj).toBe('object');
                expect(obj.value).toBe('TestClass');
            });
            it('registered with custom name', function () {
                var obj = container.resolve('dependency1');
                expect(typeof obj).toBe('object');
                expect(obj.value).toBe('TestClass2');
            });
            it('with dependencies injected', function () {
                var obj = container.resolve('testClass');
                expect(obj.value).toBe('TestClass');
                expect(obj.dependency1.value).toBe('TestClass2');
                expect(obj.dependency2()).toBe('testFunction2');
            });
        });
        describe('should return function', function () {
            it('registered with its original name', function () {
                var fn = container.resolve('testFunction');
                expect(typeof fn).toBe('function');
                expect(fn()).toBe('testFunction');
            });
            it('registered with custom name', function () {
                var fn = container.resolve('dependency2');
                expect(typeof fn).toBe('function');
                expect(fn()).toBe('testFunction2');
            });
        });
        describe('should return factory result', function () {
            it('registered with its original name', function () {
                var res = container.resolve('testFactory');
                expect(res).toBe('testFactory');
            });
            it('registered with custom name', function () {
                var res = container.resolve('testFactory2');
                expect(res).toBe('<dependency3>');
            });
            it('registered as anonymous function', function () {
                var res = container.resolve('dependency3');
                expect(res).toBe('dependency3');
            });
        });
        it('should throw error if key not found', function () {
            expect(function () {
                return container.resolve('NotExistingKey');
            }).toThrow();
        });
    });
    it('should register itself with "container" key', function () {
        expect(container.isRegistered('container')).toBeTruthy();
    });
    it('should inject itself as dependency when required', function () {
        container.registerFactory('something', function (container) {
            return container;
        });
        var c = container.resolve('something');
        expect(c).toBe(container);
    });
    it('should throw error if dependency cannot be resolved', function () {
        container.registerFactory('something', function (notExistingDependency) {
            return null;
        });
        expect(function () {
            return container.resolve('something');
        }).toThrow();
    });
    it('should prevent circular dependencies and throw error', function () {
        container.registerFactory('something', function (something) {
            return null;
        });
        expect(function () {
            return container.resolve('something');
        }).toThrow("Circular dependency found");
    });
    it('should resolve more complex types of dependencies', function () {
        container.registerFactory('something1', function () {
            return null;
        });
        container.registerFactory('something2', function (something1) {
            return null;
        });
        container.registerFactory('something3', function (something1, something2) {
            return null;
        });
        container.resolve('something3');
    });
});
var TestClass = (function () {
    function TestClass(dependency1, dependency2) {
        this.dependency1 = dependency1;
        this.dependency2 = dependency2;
        this.value = 'TestClass';
    }
    return TestClass;
})();
var TestClass2 = (function () {
    function TestClass2() {
        this.value = 'TestClass2';
    }
    return TestClass2;
})();
var TestSingleton = (function () {
    function TestSingleton() {
        this.value = 'TestSingleton';
    }
    TestSingleton.$ioc = {
        singleton: true
    };
    return TestSingleton;
})();
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
var ByteCarrot;
(function (ByteCarrot) {
    (function (TestModule) {
        var Class1 = (function () {
            function Class1() { }
            return Class1;
        })();
        TestModule.Class1 = Class1;        
        var Class2 = (function () {
            function Class2(class1) {
                this.class1 = class1;
            }
            return Class2;
        })();
        TestModule.Class2 = Class2;        
    })(ByteCarrot.TestModule || (ByteCarrot.TestModule = {}));
    var TestModule = ByteCarrot.TestModule;
})(ByteCarrot || (ByteCarrot = {}));
//@ sourceMappingURL=TiocSpec.js.map

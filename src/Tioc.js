var ByteCarrot;
(function (ByteCarrot) {
    (function (Tioc) {
        var Value = (function () {
            function Value() { }
            Value.isString = function isString(value) {
                return value !== undefined && value !== null && typeof value === 'string';
            };
            Value.isNotEmptyString = function isNotEmptyString(value) {
                return Value.isString(value) && value.trim().length > 0;
            };
            Value.isFunction = function isFunction(value) {
                return value !== undefined && value !== null && typeof value === 'function';
            };
            Value.isIdentifier = function isIdentifier(value) {
                if(!Value.isNotEmptyString(value)) {
                    return false;
                }
                var regex = /^[$A-Z_][0-9A-Z_$]*$/i;
                return regex.test(value);
            };
            return Value;
        })();
        Tioc.Value = Value;        
        var ReflectionInfo = (function () {
            function ReflectionInfo() {
                this.members = [];
            }
            return ReflectionInfo;
        })();
        Tioc.ReflectionInfo = ReflectionInfo;        
        var Reflector = (function () {
            function Reflector() { }
            Reflector.prototype.analyze = function (fn) {
                if(!Value.isFunction(fn)) {
                    throw new Error('Function expected');
                }
                var result = new ReflectionInfo();
                result.name = fn.name === '' ? null : fn.name;
                result.kind = 'function';
                var source = fn.toString();
                var args = source.match(/\(.*?\)/)[0].replace(/[()]/gi, '').replace(/\s/gi, '').split(',');
                if(args.length !== 1 || args[0] !== '') {
                    result.members = args;
                }
                return result;
            };
            return Reflector;
        })();
        Tioc.Reflector = Reflector;        
        var Activator = (function () {
            function Activator() { }
            Activator.prototype.createInstance = function (fn, args) {
                function F() {
                    return fn.apply(this, args);
                }
                F.prototype = fn.prototype;
                return new F();
            };
            return Activator;
        })();
        Tioc.Activator = Activator;        
        var RegistryItem = (function () {
            function RegistryItem(key, type, value, deps) {
                this.key = key;
                this.type = type;
                this.value = value;
                this.dependencies = deps;
            }
            return RegistryItem;
        })();        
        var Container = (function () {
            function Container() {
                this.activator = new Activator();
                this.reflector = new Reflector();
                this.registry = {
                };
                this.registerValue('container', this);
            }
            Container.prototype.set = function (key, type, value, deps) {
                if (typeof deps === "undefined") { deps = []; }
                if(!Value.isIdentifier(key)) {
                    throw new Error(key + ' is not a valid JavaScript identifier');
                }
                if(this.registry[key] !== undefined && this.registry[key] !== null) {
                    throw new Error(key + ' already registered');
                }
                this.registry[key] = new RegistryItem(key, type, value, deps);
            };
            Container.prototype.get = function (key) {
                if(this.registry[key] === undefined || this.registry[key] === null) {
                    throw new Error(key + ' not found');
                }
                return this.registry[key];
            };
            Container.prototype.collectDependencies = function (item) {
                var deps = [];
                for(var i in item.dependencies) {
                    deps.push(this.resolve(item.dependencies[i]));
                }
                return deps;
            };
            Container.prototype.registerFunctionInternal = function (type, args) {
                if(args.length === 1 && Value.isFunction(args[0])) {
                    var info = this.reflector.analyze(args[0]);
                    if(info.name === null) {
                        throw new Error('Anonymous function can be only registered with key provided');
                    }
                    this.set(info.name, type, args[0], info.members);
                } else if(args.length === 2 && Value.isNotEmptyString(args[0]) && Value.isFunction(args[1])) {
                    var info = this.reflector.analyze(args[1]);
                    this.set(args[0], type, args[1], info.members);
                } else {
                    throw new Error('Invalid arguments');
                }
            };
            Container.prototype.registerClass = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if(args.length === 1 && Value.isFunction(args[0])) {
                    var info = this.reflector.analyze(args[0]);
                    if(info.name === null) {
                        throw new Error('Anonymous function cannot be a class constructor');
                    }
                    this.set(info.name, 'class', args[0], info.members);
                } else if(args.length === 2 && Value.isNotEmptyString(args[0]) && Value.isFunction(args[1])) {
                    var info = this.reflector.analyze(args[1]);
                    if(info.name === null) {
                        throw new Error('Anonymous function cannot be a class constructor');
                    }
                    this.set(args[0], 'class', args[1], info.members);
                } else {
                    throw new Error('Invalid arguments');
                }
            };
            Container.prototype.registerFunction = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                this.registerFunctionInternal('function', args);
            };
            Container.prototype.registerFactory = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                this.registerFunctionInternal('factory', args);
            };
            Container.prototype.registerValue = function (key, value) {
                if(!Value.isNotEmptyString(key)) {
                    throw new Error('Invalid key');
                }
                if(value === undefined) {
                    throw new Error('Value is undefined');
                }
                this.set(key, 'value', value, []);
            };
            Container.prototype.isRegistered = function (key) {
                if(!Value.isNotEmptyString(key) || !Value.isIdentifier(key)) {
                    throw new Error('Argument cannot be null or undefined');
                }
                return this.registry[key] !== undefined && this.registry[key] !== null;
            };
            Container.prototype.resolve = function (key) {
                var item = this.get(key);
                if(item.type === 'class') {
                    return this.activator.createInstance(item.value, this.collectDependencies(item));
                }
                if(item.type === 'factory') {
                    return item.value.apply(null, this.collectDependencies(item));
                }
                return this.get(key).value;
            };
            return Container;
        })();
        Tioc.Container = Container;        
    })(ByteCarrot.Tioc || (ByteCarrot.Tioc = {}));
    var Tioc = ByteCarrot.Tioc;
})(ByteCarrot || (ByteCarrot = {}));
//@ sourceMappingURL=Tioc.js.map

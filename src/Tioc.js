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
            function RegistryItem(key, type, value) {
                this.key = key;
                this.type = type;
                this.value = value;
            }
            return RegistryItem;
        })();        
        var Container = (function () {
            function Container() {
                this.activator = new Activator();
                this.reflector = new Reflector();
                this.registry = {
                };
            }
            Container.prototype.set = function (key, type, value) {
                if(!Value.isIdentifier(key)) {
                    throw new Error(key + ' is not a valid JavaScript identifier');
                }
                if(this.registry[key] !== undefined && this.registry[key] !== null) {
                    throw new Error(key + ' already registered');
                }
                this.registry[key] = new RegistryItem(key, type, value);
            };
            Container.prototype.get = function (key) {
                if(this.registry[key] === undefined || this.registry[key] === null) {
                    throw new Error(key + ' not found');
                }
                return this.registry[key];
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
                    this.set(info.name, 'class', args[0]);
                } else if(args.length === 2 && Value.isNotEmptyString(args[0]) && Value.isFunction(args[1])) {
                    var info = this.reflector.analyze(args[1]);
                    if(info.name === null) {
                        throw new Error('Anonymous function cannot be a class constructor');
                    }
                    this.set(args[0], 'class', args[1]);
                } else {
                    throw new Error('Invalid arguments');
                }
            };
            Container.prototype.registerFunction = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if(args.length === 1 && Value.isFunction(args[0])) {
                    var info = this.reflector.analyze(args[0]);
                    if(info.name === null) {
                        throw new Error('Anonymous function can be only registered with key provided');
                    }
                    this.set(info.name, 'function', args[0]);
                } else if(args.length === 2 && Value.isNotEmptyString(args[0]) && Value.isFunction(args[1])) {
                    this.set(args[0], 'function', args[1]);
                } else {
                    throw new Error('Invalid arguments');
                }
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
                    return this.activator.createInstance(item.value, []);
                }
                return this.get(key).value;
            };
            Container.prototype.isClass = function (key) {
                return key[0] === key[0].toUpperCase();
            };
            return Container;
        })();
        Tioc.Container = Container;        
    })(ByteCarrot.Tioc || (ByteCarrot.Tioc = {}));
    var Tioc = ByteCarrot.Tioc;
})(ByteCarrot || (ByteCarrot = {}));
//@ sourceMappingURL=Tioc.js.map

var ByteCarrot;
(function (ByteCarrot) {
    (function (Tioc) {
        var ReflectionInfo = (function () {
            function ReflectionInfo() {
                this.args = [];
            }
            return ReflectionInfo;
        })();
        Tioc.ReflectionInfo = ReflectionInfo;        
        var Reflector = (function () {
            function Reflector() { }
            Reflector.prototype.analyze = function (fn) {
                if(fn === undefined || fn === null || (typeof fn) !== 'function') {
                    throw new Error('Function expected');
                }
                console.log(typeof fn);
                var result = new ReflectionInfo();
                result.name = fn.name === '' ? null : fn.name;
                result.kind = 'function';
                var source = fn.toString();
                var args = source.match(/\(.*?\)/)[0].replace(/[()]/gi, '').replace(/\s/gi, '').split(',');
                if(args.length !== 1 || args[0] !== '') {
                    result.args = args;
                }
                return result;
            };
            return Reflector;
        })();
        Tioc.Reflector = Reflector;        
        var Container = (function () {
            function Container() {
                this.reflector = new Reflector();
                this.registry = {
                };
            }
            Container.prototype.Register = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                if(args.length === 0) {
                    throw new Error('Arguments required.');
                }
                if(args.length > 2) {
                    throw new Error('To many arguments.');
                }
                if(args.length === 1) {
                    this.Register1(args[0]);
                }
                if(args.length === 2) {
                    this.Register2(args[0], args[1]);
                }
            };
            Container.prototype.Register1 = function (fn) {
                if(fn === undefined || fn === null || typeof fn !== 'function') {
                    throw new Error('Argument should be a function');
                }
                var info = this.reflector.analyze(fn);
                if(info.name === null) {
                    throw new Error('Argument cannot be an anonymous function');
                }
                if(this.IsRegistered(info.name)) {
                    throw new Error('Function already registered');
                }
                this.registry[info.name] = fn;
            };
            Container.prototype.Register2 = function (key, fn) {
                if(key === undefined || key === null || typeof key !== 'string') {
                    throw new Error('First argument should be a string');
                }
                key = key.trim();
                if(key === '') {
                    throw new Error('First argument cannot be an empty string');
                }
                if(fn === undefined || fn === null || typeof fn !== 'function') {
                    throw new Error('Second argument should be a function');
                }
                if(this.IsRegistered(key)) {
                    throw new Error('Function already registered');
                }
                this.registry[key] = fn;
            };
            Container.prototype.IsRegistered = function (fn) {
                if(fn === undefined || fn === null) {
                    throw new Error('Argument cannot be null or undefined');
                }
                var key = '';
                if(typeof fn === 'string') {
                    key = fn.trim();
                    if(key === '') {
                        throw new Error('Argument cannot be an empty string');
                    }
                } else if(typeof fn === 'function') {
                    var info = this.reflector.analyze(fn);
                    if(info.name === null) {
                        throw new Error('Argument cannot be an anonymous function');
                    }
                    key = info.name;
                } else {
                    throw new Error('Argument is not a function nor string');
                }
                return this.registry[key] !== undefined && this.registry[key] !== null;
            };
            return Container;
        })();
        Tioc.Container = Container;        
    })(ByteCarrot.Tioc || (ByteCarrot.Tioc = {}));
    var Tioc = ByteCarrot.Tioc;
})(ByteCarrot || (ByteCarrot = {}));
//@ sourceMappingURL=ioc.js.map
module ByteCarrot.Tioc {
    export class Value {
        public static isString(value:any):bool {
            return value !== undefined && value !== null && typeof value === 'string';
        }
        public static isNotEmptyString(value:any):bool {
            return Value.isString(value) && value.trim().length > 0;
        }
        public static isFunction(value:any):bool {
            return value !== undefined && value !== null && typeof value === 'function';
        }
        public static isIdentifier(value:string):bool {
            if (!Value.isNotEmptyString(value)) {
                return false;
            }
            var regex = /^[$A-Z_][0-9A-Z_$]*$/i;
            return regex.test(value);
        }
    }

    export class ReflectionInfo {
        public name:string;
        public kind:string;
        public members:string[] = [];
    }

    export class Reflector {
        public analyze(fn:any):ReflectionInfo {
            if (!Value.isFunction(fn)) {
                throw new Error('Function expected');
            }
            var result = new ReflectionInfo();
            result.name = fn.name === '' ? null : fn.name;
            result.kind = 'function';
            var source = fn.toString();
            var args:string[] = source.match(/\(.*?\)/)[0].replace(/[()]/gi,'').replace(/\s/gi,'').split(',');
            if (args.length !== 1 || args[0] !== '') {
                result.members = args;
            }
            return result;
        }
    }

    export class Activator {
        public createInstance(fn:any, args:any[]) {
            function F() {
                return fn.apply(this, args);
            }
            F.prototype = fn.prototype;
            return new F();
        };
    }

    export class Container {
        private reflector:Reflector = new Reflector();
        private registry:{} = {};
        public Register(...args:any[]):void {
            if (args.length === 0) {
                throw new Error('Arguments required.');
            }
            if (args.length > 2) {
                throw new Error('To many arguments.');
            }
            if (args.length === 1 ) {
                this.Register1(args[0]);
            }
            if (args.length === 2) {
                this.Register2(args[0],args[1]);
            }
        }
        private Register1(fn:any):void {
            if (!Value.isFunction(fn)) {
                throw new Error('Argument should be a function');
            }
            var info = this.reflector.analyze(fn);
            if (info.name === null) {
                throw new Error('Argument cannot be an anonymous function');
            }
            if (this.IsRegistered(info.name)) {
                throw new Error('Function already registered');
            }
            this.registry[info.name] = fn;
        }
        private Register2(key:string, fn:any):void {
            if (!Value.isNotEmptyString(key)) {
                throw new Error('First argument should be a string');
            }
            key = key.trim();
            if (!Value.isIdentifier(key)) {
                throw new Error('Key is not a valid identifier');
            }
            if (!Value.isFunction(fn)) {
                throw new Error('Second argument should be a function');
            }
            var info = this.reflector.analyze(fn);
            if (info.name === null && this.isClass(key)) {
                throw new Error('Anonymous function cannot be register as a class');
            }
            if (this.IsRegistered(key)) {
                throw new Error('Function already registered');
            }
            this.registry[key] = fn;
        }
        public IsRegistered(fn:any):bool {
            if (fn === undefined || fn === null) {
                throw new Error('Argument cannot be null or undefined');
            }
            var key = '';
            if (typeof fn === 'string') {
                key = fn.trim();
                if (key === '') {
                    throw new Error('Argument cannot be an empty string');
                }
            } else if (typeof fn === 'function') {
                var info = this.reflector.analyze(fn);
                if (info.name === null) {
                    throw new Error('Argument cannot be an anonymous function');
                }
                key = info.name;
            } else {
                throw new Error('Argument is not a function nor string');
            }
            return this.registry[key] !== undefined && this.registry[key] !== null;
        }
        public Resolve(key:string):any {
            if (this.isClass(key)) {
                return new this.registry[key];
            }
            return this.registry[key];
        }
        private isClass(key:string):bool {
            return key[0] === key[0].toUpperCase();
        }
    }
}
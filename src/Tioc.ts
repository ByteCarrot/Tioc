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

    class RegistryItem {
        public key:string;
        public type:string;
        public value:any;
        constructor(key:string, type:string, value:any) {
            this.key = key;
            this.type = type;
            this.value = value;
        }
    }

    export class Container {
        private activator:Activator = new Activator();
        private reflector:Reflector = new Reflector();
        private registry:{} = {};
        private set(key:string, type:string, value:any):void {
            if (!Value.isIdentifier(key)) {
                throw new Error(key + ' is not a valid JavaScript identifier');
            }
            if (this.registry[key] !== undefined && this.registry[key] !== null) {
                throw new Error(key + ' already registered');
            }
            this.registry[key] = new RegistryItem(key, type, value);
        }
        private get(key:string):RegistryItem {
            if (this.registry[key] === undefined || this.registry[key] === null) {
                throw new Error(key + ' not found');
            }
            return this.registry[key];
        }
        public registerClass(...args:any[]):void {
            if (args.length === 1 && Value.isFunction(args[0])) {
                var info = this.reflector.analyze(args[0]);
                if (info.name === null) {
                    throw new Error('Anonymous function cannot be a class constructor');
                }
                this.set(info.name, 'class', args[0]);
            } else if (args.length === 2 && Value.isNotEmptyString(args[0]) && Value.isFunction(args[1])) {
                var info = this.reflector.analyze(args[1]);
                if (info.name === null) {
                    throw new Error('Anonymous function cannot be a class constructor');
                }
                this.set(args[0], 'class', args[1]);
            } else {
                throw new Error('Invalid arguments');
            }
        }
        public registerFunction(...args:any[]):void {
            if (args.length === 1 && Value.isFunction(args[0])) {
                var info = this.reflector.analyze(args[0]);
                if (info.name === null) {
                    throw new Error('Anonymous function can be only registered with key provided');
                }
                this.set(info.name, 'function', args[0]);
            } else if (args.length === 2 && Value.isNotEmptyString(args[0]) && Value.isFunction(args[1])) {
                this.set(args[0], 'function', args[1]);
            } else {
                throw new Error('Invalid arguments');
            }
        }
        public isRegistered(key:any):bool {
            if (!Value.isNotEmptyString(key) || !Value.isIdentifier(key)) {
                throw new Error('Argument cannot be null or undefined');
            }
            return this.registry[key] !== undefined && this.registry[key] !== null;
        }
        public resolve(key:string):any {
            var item = this.get(key);
            if (item.type === 'class') {
                return this.activator.createInstance(item.value, []);
            }
            return this.get(key).value;
        }
        private isClass(key:string):bool {
            return key[0] === key[0].toUpperCase();
        }
    }
}
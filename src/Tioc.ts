module ByteCarrot.Tioc {
    export class Value {
        public static isString(value:any):bool {
            return value !== undefined && value !== null && typeof value === 'string';
        }
        public static isObject(value:any):bool {
            return value !== undefined && value !== null && typeof value === 'object' && Object.prototype.toString.call(value) !== '[object Array]';
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
        public dependencies:string[];
        constructor(key:string, type:string, value:any, deps:string[]) {
            this.key = key;
            this.type = type;
            this.value = value;
            this.dependencies = deps;
        }
    }

    export class Container {
        private activator:Activator = new Activator();
        private reflector:Reflector = new Reflector();
        private registry:{} = {};
        constructor() {
            this.registerValue('container', this);
        }
        private set(key:string, type:string, value:any, deps:string[] = []):void {
            if (!Value.isIdentifier(key)) {
                throw new Error(key + ' is not a valid JavaScript identifier');
            }
            if (this.registry[key] !== undefined && this.registry[key] !== null) {
                throw new Error(key + ' already registered');
            }
            this.registry[key] = new RegistryItem(key, type, value, deps);
        }
        private get(key:string):RegistryItem {
            if (this.registry[key] === undefined || this.registry[key] === null) {
                throw new Error(key + ' not found');
            }
            return this.registry[key];
        }
        private collectDependencies(item:RegistryItem, allDeps:string[]):any[] {
            this.ensureNoCircularDependencies(item, allDeps);
            var deps = [];
            for (var i in item.dependencies) {
                deps.push(this.resolveInternal(item.dependencies[i], allDeps));
            }
            return deps;
        }
        private ensureNoCircularDependencies(item:RegistryItem, allDeps:string[]):void {
            for (var i in item.dependencies) {
                var dep = item.dependencies[i];
                if (allDeps.indexOf(dep) >= 0) {
                    throw new Error('Circular dependency found');
                }
                allDeps.push(dep);
            }
        }
        private toLowerCamelCase(value:string):string {
            return value.charAt(0).toLowerCase() + value.slice(1);
        }
        private registerFunctionInternal(type:string, args:any[]):void {
            if (args.length === 1 && Value.isFunction(args[0])) {
                var info = this.reflector.analyze(args[0]);
                if (info.name === null) {
                    throw new Error('Anonymous function can be only registered with key provided');
                }
                this.set(info.name, type, args[0], info.members);
            } else if (args.length === 2 && Value.isNotEmptyString(args[0]) && Value.isFunction(args[1])) {
                var info = this.reflector.analyze(args[1]);
                this.set(args[0], type, args[1], info.members);
            } else {
                throw new Error('Invalid arguments');
            }
        }
        private resolveInternal(key:string, allDeps:string[]):any {
            var item = this.get(key);

            if (item.type === 'class') {
                return this.activator.createInstance(item.value, this.collectDependencies(item, allDeps));
            }
            if (item.type === 'factory') {
                return item.value.apply(null, this.collectDependencies(item, allDeps));
            }
            return this.get(key).value;
        }
        public registerClass(...args:any[]):void {
            if (args.length === 1 && Value.isFunction(args[0])) {
                var info = this.reflector.analyze(args[0]);
                if (info.name === null) {
                    throw new Error('Anonymous function cannot be a class constructor');
                }
                this.set(this.toLowerCamelCase(info.name), 'class', args[0], info.members);
            } else if (args.length === 2 && Value.isNotEmptyString(args[0]) && Value.isFunction(args[1])) {
                var info = this.reflector.analyze(args[1]);
                if (info.name === null) {
                    throw new Error('Anonymous function cannot be a class constructor');
                }
                this.set(args[0], 'class', args[1], info.members);
            } else {
                throw new Error('Invalid arguments');
            }
        }
        public registerFunction(...args:any[]):void {
            this.registerFunctionInternal('function', args);
        }
        public registerFactory(...args:any[]):void {
            this.registerFunctionInternal('factory', args);
        }
        public registerValue(key:any, value:any):void {
            if (!Value.isNotEmptyString(key)) {
                throw new Error('Invalid key');
            }
            if (value === undefined) {
                throw new Error('Value is undefined');
            }
            this.set(key, 'value', value, []);
        }
        public registerModule(mod:any):void {
            if (mod === undefined || mod === null || typeof mod !== 'object') {
                throw new Error('Passed value is not a module');
            }
            var counter = 0;
            for(var member in mod) {
                if (!Value.isFunction(mod[member])) {
                    continue;
                }
                var info = this.reflector.analyze(mod[member]);
                if (info.name === null) {
                    continue;
                }
                this.registerClass(this.toLowerCamelCase(info.name), mod[member]);
                counter++;
            }
            if (counter === 0) {
                throw new Error('No exported types found');
            }
        }
        public isRegistered(key:any):bool {
            if (!Value.isNotEmptyString(key) || !Value.isIdentifier(key)) {
                throw new Error('Argument cannot be null or undefined');
            }
            return this.registry[key] !== undefined && this.registry[key] !== null;
        }
        public resolve(key:string):any {
            return this.resolveInternal(key, []);
        }
    }
}
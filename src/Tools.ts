module ByteCarrot.Tools {
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
}
var _ = ByteCarrot.Tools.Value;
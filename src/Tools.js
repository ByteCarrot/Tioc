var ByteCarrot;
(function (ByteCarrot) {
    (function (Tools) {
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
        Tools.Value = Value;        
    })(ByteCarrot.Tools || (ByteCarrot.Tools = {}));
    var Tools = ByteCarrot.Tools;
})(ByteCarrot || (ByteCarrot = {}));
var _ = ByteCarrot.Tools.Value;
//@ sourceMappingURL=Tools.js.map

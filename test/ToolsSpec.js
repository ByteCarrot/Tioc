describe('Value', function () {
    describe('isString', function () {
        it('should return true if value is a string', function () {
            expect(_.isString('')).toBeTruthy();
            expect(_.isString('    ')).toBeTruthy();
            expect(_.isString('lkasjd laskdj')).toBeTruthy();
        });
        it('should return false if value is not a string', function () {
            expect(_.isString(undefined)).toBeFalsy();
            expect(_.isString(null)).toBeFalsy();
            expect(_.isString({
            })).toBeFalsy();
            expect(_.isString([])).toBeFalsy();
        });
    });
    describe('isNotEmptyString', function () {
        it('should return true if value is not an empty string', function () {
            expect(_.isNotEmptyString('d')).toBeTruthy();
            expect(_.isNotEmptyString(' asdas    ')).toBeTruthy();
        });
        it('should return false if value is not a string nor empty string', function () {
            expect(_.isNotEmptyString(undefined)).toBeFalsy();
            expect(_.isNotEmptyString(null)).toBeFalsy();
            expect(_.isNotEmptyString({
            })).toBeFalsy();
            expect(_.isNotEmptyString('   ')).toBeFalsy();
            expect(_.isNotEmptyString('')).toBeFalsy();
        });
    });
    describe('isFunction', function () {
        function testFunction() {
        }
        it('should return true if value is a function', function () {
            expect(_.isFunction(function () {
            })).toBeTruthy();
            expect(_.isFunction(testFunction)).toBeTruthy();
        });
        it('should return false if value is not a function', function () {
            expect(_.isFunction()).toBeFalsy();
            expect(_.isFunction(undefined)).toBeFalsy();
            expect(_.isFunction(null)).toBeFalsy();
            expect(_.isFunction('')).toBeFalsy();
            expect(_.isFunction({
            })).toBeFalsy();
        });
    });
    describe('isIdentifier', function () {
        it('should return true if value is a valid identifier', function () {
            expect(_.isIdentifier('AlaMaKota')).toBeTruthy();
            expect(_.isIdentifier('alaMaKota33_33')).toBeTruthy();
            expect(_.isIdentifier('_alaMa_KOTA')).toBeTruthy();
        });
        it('should return false if value is not a valid identifier', function () {
            expect(_.isIdentifier(undefined)).toBeFalsy();
            expect(_.isIdentifier(null)).toBeFalsy();
            expect(_.isIdentifier([])).toBeFalsy();
            expect(_.isIdentifier('  ')).toBeFalsy();
            expect(_.isIdentifier('3alaMaKota'));
        });
    });
});
//@ sourceMappingURL=ToolsSpec.js.map

/// <reference path="jasmine.d.ts" />
/// <reference path="../src/Tools.ts" />

describe('Value', () => {
    describe('isString', () => {
        it('should return true if value is a string', () => {
            expect(_.isString('')).toBeTruthy();
            expect(_.isString('    ')).toBeTruthy();
            expect(_.isString('lkasjd laskdj')).toBeTruthy();
        });
        it('should return false if value is not a string', () => {
            expect(_.isString(undefined)).toBeFalsy();
            expect(_.isString(null)).toBeFalsy();
            expect(_.isString({})).toBeFalsy();
            expect(_.isString([])).toBeFalsy();
        });
    });
    describe('isNotEmptyString', () => {
        it('should return true if value is not an empty string', () => {
            expect(_.isNotEmptyString('d')).toBeTruthy();
            expect(_.isNotEmptyString(' asdas    ')).toBeTruthy();
        });
        it('should return false if value is not a string nor empty string', () => {
            expect(_.isNotEmptyString(undefined)).toBeFalsy();
            expect(_.isNotEmptyString(null)).toBeFalsy();
            expect(_.isNotEmptyString({})).toBeFalsy();
            expect(_.isNotEmptyString('   ')).toBeFalsy();
            expect(_.isNotEmptyString('')).toBeFalsy();
        });
    });
    describe('isFunction', () => {
        function testFunction(){}
        it('should return true if value is a function', () => {
            expect(_.isFunction(function(){})).toBeTruthy();
            expect(_.isFunction(testFunction)).toBeTruthy();
        });
        it('should return false if value is not a function', () => {
            expect(_.isFunction()).toBeFalsy();
            expect(_.isFunction(undefined)).toBeFalsy();
            expect(_.isFunction(null)).toBeFalsy();
            expect(_.isFunction('')).toBeFalsy();
            expect(_.isFunction({})).toBeFalsy();
        });
    });
    describe('isIdentifier', () => {
        it('should return true if value is a valid identifier', () => {
            expect(_.isIdentifier('AlaMaKota')).toBeTruthy();
            expect(_.isIdentifier('alaMaKota33_33')).toBeTruthy();
            expect(_.isIdentifier('_alaMa_KOTA')).toBeTruthy();
        });
        it('should return false if value is not a valid identifier', () => {
            expect(_.isIdentifier(undefined)).toBeFalsy();
            expect(_.isIdentifier(null)).toBeFalsy();
            expect(_.isIdentifier([])).toBeFalsy();
            expect(_.isIdentifier('  ')).toBeFalsy();
            expect(_.isIdentifier('3alaMaKota'));
        });
    });
});
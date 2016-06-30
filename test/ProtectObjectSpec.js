import ProtectObject from 'src/ProtectObject';

describe('ProtectObject', () => {

    describe('forceGet method', () => {
        it('should get property from object by name', () => {
            const protectObject = new ProtectObject();
            protectObject.set('name', 'yibuyisheng');
            expect(protectObject.forceGet('name')).toBe('yibuyisheng');
            protectObject.destroy();
        });

        it('should get property from object by name in locked mode', () => {
            const protectObject = new ProtectObject();
            protectObject.set('name', 'yibuyisheng');
            protectObject.safeExecute(() => {
                expect(protectObject.forceGet('name')).toBe('yibuyisheng');
            });
            protectObject.destroy();
        });
    });

    describe('get method', () => {
        it('should get property from object by name in normal mode', () => {
            const protectObject = new ProtectObject();
            protectObject.set('name', 'yibuyisheng');
            expect(protectObject.get('name')).toBe('yibuyisheng');
            protectObject.destroy();
        });

        it('should not get property from object by name in locked mode', () => {
            const protectObject = new ProtectObject();
            protectObject.set('name', 'yibuyisheng');
            protectObject.safeExecute(() => {
                expect(protectObject.get('name')).toBe(undefined);
                expect(protectObject.forceGet('name')).toBe('yibuyisheng');
            });
            protectObject.destroy();
        });
    });

    describe('safeIterate method', () => {
        it('should iterate all properties', () => {
            const protectObject = new ProtectObject();
            protectObject.set('name', 'yibuyisheng');
            protectObject.set('age', 11);
            protectObject.set('sex', 'male');
            const iterated = {};
            protectObject.safeIterate((value, key) => {
                iterated[key] = value;
            });
            expect(iterated.name).toBe('yibuyisheng');
            expect(iterated.age).toBe(11);
            expect(iterated.sex).toBe('male');
            protectObject.destroy();
        });

        it('should not add new property to object while iterating', () => {
            const protectObject = new ProtectObject();
            protectObject.set('name', 'yibuyisheng');
            protectObject.set('age', 11);
            protectObject.set('sex', 'male');
            const iterated = {};
            protectObject.safeIterate((value, key) => {
                protectObject.set('height', 170);
                iterated[key] = value;
            });
            expect(iterated.name).toBe('yibuyisheng');
            expect(iterated.age).toBe(11);
            expect(iterated.sex).toBe('male');
            expect(protectObject.get('height')).toBe(170);
            protectObject.destroy();
        });

        it('should remove all properties after iterating', () => {
            const protectObject = new ProtectObject();
            protectObject.set('name', 'yibuyisheng');
            protectObject.set('age', 11);
            protectObject.set('sex', 'male');
            protectObject.safeIterate((value, key) => {});
            expect(protectObject.get('name')).toBe(undefined);
            expect(protectObject.get('age')).toBe(undefined);
            expect(protectObject.get('sex')).toBe(undefined);
            protectObject.destroy();
        });
    });

    describe('safeIterate method', () => {
        it('should do nothing when calling `safeIterate` without a iterate function', () => {
            const protectObject = new ProtectObject();
            protectObject.safeIterate();
            protectObject.destroy();
        });
    });

});

import {ProtectObject} from 'ProtectObject';

describe('ProtectObject', () => {
    let protectObject;
    beforeEach(() => {
        protectObject = new ProtectObject();
    });
    afterEach(() => {
        protectObject = null;
    });

    it('forceGet and get', done => {
        protectObject.set('name', 'yibuyisheng');
        expect(protectObject.get('name')).toBe('yibuyisheng');
        protectObject.safeExecute(() => {
            expect(protectObject.get('name')).toBe(undefined);
            expect(protectObject.forceGet('name')).toBe('yibuyisheng');
            done();
        });
    });
});

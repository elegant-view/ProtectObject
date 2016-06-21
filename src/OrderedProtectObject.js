/**
 * @file 添加一种排序功能
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import ProtectObject from './ProtectObject';

const ORDER = Symbol('order');
const ORDER_CACHE = Symbol('orderCache');

export default class OrderedProtectedObject extends ProtectObject {
    constructor(...args) {
        super(...args);

        this[ORDER] = [];
        this[ORDER_CACHE] = [];
    }

    set(key, value) {
        super.set(key, value);
        this.isLocked() ? this[ORDER_CACHE].push(key) : this[ORDER].push(key);
    }

    safeIterate(fn, context) {
        if (!fn) {
            return;
        }

        this.lock();
        for (let i = 0, il = this[ORDER].length; i < il; ++i) {
            const key = this[ORDER][i];
            const value = this.forceGet(key);

            const result = fn.call(context, value, key);
            if (result) {
                break;
            }
        }
        this.unlock();
    }
}

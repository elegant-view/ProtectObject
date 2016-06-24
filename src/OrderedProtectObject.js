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

    /**
     * 设置值
     *
     * @override
     * @public
     * @param {string} key   键
     * @param {*} value 值
     */
    set(key, value) {
        // 没有key的时候才push
        if (!this.hasKey(key)) {
            this.isLocked() ? this[ORDER_CACHE].push(key) : this[ORDER].push(key);
        }

        super.set(key, value);
    }

    /**
     * 按序迭代
     *
     * @override
     * @public
     * @param  {Function} fn      迭代回调
     * @param  {Object=}   context 迭代上下文
     */
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

        this[ORDER] = this[ORDER_CACHE];
        this[ORDER_CACHE] = [];
        this.unlock();
    }

    /**
     * 安全执行函数
     *
     * @override
     * @public
     * @param  {Function} fn      要执行的函数
     * @param  {Object=}   context 函数上下文
     */
    safeExecute(fn, context) {
        if (!fn) {
            return;
        }

        this.lock();
        fn.call(context);
        this[ORDER] = this[ORDER_CACHE];
        this[ORDER_CACHE] = [];
        this.unlock();
    }
}

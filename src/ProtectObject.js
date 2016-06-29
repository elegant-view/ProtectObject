/**
 * @file 保护对象，主要提供了锁定和解锁对象的功能
 * @author yibuyisheng(yibuyisheng@163.com)
 */

const OBJECT = Symbol('object');
const OBJECT_CACHE = Symbol('objectCache');
const LOCKED = Symbol('locked');
const LOCK = Symbol('lock');
const UNLOCK = Symbol('unlock');

export default class ProtectObject {
    constructor() {
        this[OBJECT] = {};
        this[OBJECT_CACHE] = {};

        this[LOCKED] = 0;
    }

    /**
     * 判断是否锁定
     *
     * @protected
     * @return {boolean} 是否锁定
     */
    isLocked() {
        return !!this[LOCKED];
    }

    /**
     * 锁定
     *
     * @protected
     */
    lock() {
        this[LOCK]();
    }

    /**
     * 解锁
     *
     * @protected
     */
    unlock(shouldNotNewObject) {
        this[UNLOCK](shouldNotNewObject);
    }

    /**
     * 强制获取OBJECT上面的数据
     *
     * @public
     * @param  {string} key 属性键
     * @return {*}
     */
    forceGet(key) {
        return this[OBJECT][key];
    }

    /**
     * 判断指定键是否已存在
     *
     * @public
     * @param  {string} key 键
     * @return {boolean}
     */
    hasKey(key) {
        return key in (this[LOCKED] ? this[OBJECT_CACHE] : this[OBJECT]);
    }

    /**
     * 设置属性，如果被锁定的话，就先存储在缓存对象上面。
     *
     * @public
     * @param {string} key   属性名
     * @param {*} value 属性值
     */
    set(key, value) {
        const obj = this[LOCKED] ? this[OBJECT_CACHE] : this[OBJECT];
        obj[key] = value;
    }

    /**
     * 获取属性值，如果被锁定的话，获取的会是缓存上面的值。
     *
     * @public
     * @param  {string} key 属性名
     * @return {*}     属性值
     */
    get(key) {
        return this[LOCKED] ? this[OBJECT_CACHE][key] : this[OBJECT][key];
    }

    /**
     * 迭代对象，该迭代会锁定对象，迭代过程中一切对对象的操作（fn中的同步操作），都会作用于缓存对象。
     * 在迭代结束之后，缓存对象上面的属性会转移到对象上面去，并且缓存对象会置空。
     *
     * @public
     * @param  {Function} fn      迭代回调函数
     * @param  {*}   context 回调函数上下文
     */
    safeIterate(fn, context) {
        if (!fn) {
            return;
        }

        this[LOCK]();
        /* eslint-disable guard-for-in */
        for (let key in this[OBJECT]) {
        /* eslint-enable guard-for-in */
            const result = fn.call(context, this[OBJECT][key], key);
            if (result) {
                break;
            }
        }
        this[UNLOCK]();
    }

    [LOCK]() {
        this[LOCKED] >= 0 && ++this[LOCKED];
    }

    [UNLOCK](shouldNotNewObject) {
        if (this[LOCKED] === 0) {
            return;
        }
        else if (this[LOCKED] < 0) {
            throw new Error('wrong lock state.');
        }

        --this[LOCKED];

        if (this[LOCKED] === 0) {
            this.recovery(shouldNotNewObject);
        }
    }

    // protected
    recovery(shouldNotNewObject) {
        if (shouldNotNewObject) {
            for (let key in this[OBJECT_CACHE]) {
                if (!this[OBJECT_CACHE].hasOwnProperty(key)) {
                    continue;
                }
                this[OBJECT][key] = this[OBJECT_CACHE][key];
            }
        }
        else {
            this[OBJECT] = this[OBJECT_CACHE];
        }
        this[OBJECT_CACHE] = {};
    }

    // public
    safeExecute(fn, context, shouldNotNewObject) {
        if (!fn) {
            return;
        }

        this[LOCK]();
        fn.call(context);
        this[UNLOCK](shuouldNotOverride);
    }

    /**
     * 销毁
     *
     * @public
     */
    destroy() {
        this[OBJECT] = {};
        this[OBJECT_CACHE] = {};
    }
}

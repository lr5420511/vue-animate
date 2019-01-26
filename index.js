import veloc from './promiseify';

export default (runtime, options) => {

    const Command = async function (el, bind, vn) {
        const { value, oldValue } = bind;
        if (this.equal(oldValue, value)) return;
        const [arg, mods, context] = [
            bind.arg, bind.modifiers, vn.context
        ];
        if (arg !== 'style') {
            throw new Error(`${arg} can't as argument of v-animate.`);
        }
        // merge options
        const { begin, after, callback } = Object.assign(this, {
            valueof: ':',
            begin: 'begin',
            after: 'complete',
            callback: null
        }, options),
            // make velocity options
            velocOpts = this.makeOptions(mods, context),
            [beginHook, afterHook] = [begin, after].map(cur => {
                const temp = velocOpts[cur];
                delete velocOpts[cur];
                return typeof temp === 'function' ? temp : null
            });
        // animate start
        if (beginHook) await beginHook(veloc, this, ...arguments);
        await veloc(el, value, velocOpts);
        if (afterHook) await afterHook(veloc, this, ...arguments);
        callback && (callback(...arguments));
    };

    const proto = Command.prototype = {
        equal: function () {
            const [fir, others] = [
                arguments[0], [].slice.call(arguments, 1)
            ];
            return others.every(cur => fir === cur) || others.every(cur => {
                const [fKeys, cKeys] = [
                    Object.keys(fir || {}), Object.keys(cur || {})
                ];
                return fKeys.length === cKeys.length && fKeys.every(key =>
                    fir[key] === cur[key]
                );
            });
        },
        makeOptions: function (mods, context) {
            const { valueof } = this;
            return Object.keys(mods).reduce((ctx, cur) => {
                const [key, value] = cur.split(valueof),
                    method = context[value];
                ctx[key] = typeof method === 'function' ? method : value;
                return ctx;
            }, {});
        }
    };

    const hook = Command.bind({ '__proto__': proto });

    runtime.directive('animate', {
        inserted: hook, update: hook
    });
};
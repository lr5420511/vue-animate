import velocity from 'velocity-animate';

const promiseify = require('new-promiseify');

const veloc = promiseify([
    velocity, function (res) {
        const opts = [].slice.call(arguments, 2),
            last = opts[opts.length - 1];
        last.complete = res;
        return opts;
    }
]);

veloc.naiver = velocity;

export default veloc;
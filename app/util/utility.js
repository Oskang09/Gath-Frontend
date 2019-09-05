export const injector = (build) => {
    return function () {
        const decorators = arguments;
        return typeof arguments[0] !== 'string'
            ? build(...decorators)
            : function (WrappedComponent) {
                return build(WrappedComponent, ...decorators);
            };
    };
};

export const compose = (...enhancers) => {
    return (WrappedComponent) => {
        let Component = WrappedComponent;
        for (const enhancer of enhancers) {
            Component = enhancer(Component);
        }
        return Component;
    };
};

export const filterObject = (object, ...fields) => {
    const data = {};
    for (const key of fields) {
        if (object[key]) {
            data[key] = object[key];
        }
    }
    return fields.length === 1 ? data[fields[0]] : data;
};

export const setDataByPath = (data, ...argsArr) => {
    let args = argsArr;
    if (argsArr[0].constructor === Array) {
        args = argsArr[0];
    }

    let obj = data;
    for (let i = args.length - 1; i >= 0; i--) {
        obj = {
            [args[i]]: obj,
        };
    }

    return obj;
};

export const dataChecking = (object) => {
    let args = Array.prototype.slice.call(arguments, 1);
    if (args[0].constructor === Array) {
        args = args[0];
    }

    let obj = object;

    for (let i = 0; i < args.length; i += 1) {
        if (!obj || !Object.prototype.hasOwnProperty.call(obj, args[i]) || Array.isArray(object)) {
            return null;
        }
        obj = obj[args[i]];
    }
    return obj;
};

export const objectLoop = (object, cb, ignore) => {
    for (const key of Object.keys(object)) {
        if (ignore.includes(key)) { continue; }
        cb(key, object[key]);
    }
};

export const concatRender = function (renders) {
    return function (...args) {
        const state = [];
        for (const render of renders) {
            state.push(render(...args));
        }
        return state;
    };
}
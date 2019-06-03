export function dataChecking(object) {
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
}

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

export default {
    dataChecking,
    setDataByPath,
};
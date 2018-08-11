var getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};

var pickRandom = (...args) => {
    return args[getRandomInt(args.length)];
};

if (typeof global !== 'undefined') {
    global.getRandomInt = getRandomInt;
    global.pickRandom = pickRandom;
}


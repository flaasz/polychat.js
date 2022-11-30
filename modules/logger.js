const c = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m" // Scarlet
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};

let objectDate = new Date();
let day = objectDate.getDate();
let month = objectDate.getMonth();
let year = objectDate.getFullYear();
let hour = objectDate.getHours();
let minute = objectDate.getMinutes();
let second = objectDate.getSeconds();
let date = `[${day}/${month}/${year} ${hour}:${minute}:${second}]`;

let message = "sss";

console.log(c.dim,date,c.bright,c.bg.blue,"INFO",c.reset,message);

module.exports = {
    log: function(message) {
        console.log(c.dim,date,c.bright,c.bg.blue,"INFO",c.reset,message);
    },
    error: function(message) {
        console.log(c.dim,date,c.bright,c.bg.red,"ERROR",c.reset,message);
    },
    warn: function(message) {
        console.log(c.dim,date,c.bright,c.bg.yellow,"WARN",c.reset,message);
    }
};
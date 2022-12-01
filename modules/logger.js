const c = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    bold: "\u001b[1m",
    
    fg: {
        black: "\u001b[38;5;0m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m",
        orange: "\u001b[38;5;208m",
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\u001b[48;5;253m",
        crimson: "\u001b[101m"
    }
};

module.exports = {
    info: function(message) {
        console.log(`${c.dim}${date()} ${c.bg.blue} INFO ${c.reset} ${colorize(message)}`);
    },
    error: function(message) {
        console.log(`${c.dim}${date()} ${c.bg.red} ERROR ${c.reset} ${colorize(message)}`);
    },
    warn: function(message) {
        console.log(`${c.dim}${date()} ${c.bg.yellow} WARN ${c.reset} ${colorize(message)}`);
    },
    chat: function(message) {
        console.log(`${c.dim}${date()} ${c.bg.white}${c.fg.black}${c.bold} CHAT ${c.reset} ${colorize(message)}`);
    },
};

function date() {
    let objectDate = new Date();
    let day = objectDate.getDate();
    let month = objectDate.getMonth();
    let year = objectDate.getFullYear();
    let hour = objectDate.getHours();
    let minute = objectDate.getMinutes();
    let second = objectDate.getSeconds();
    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }
    if (hour < 10) {
        hour = `0${hour}`;
    }
    if (minute < 10) {
        minute = `0${minute}`;
    }
    if (second < 10) {
        second = `0${second}`;
    }
    return `[${day}/${month}/${year} ${hour}:${minute}:${second}]`;    
}

function colorize(message) {
    return message
    .replace(/§4/g,c.fg.red)
    .replace(/§c/g,c.fg.crimson)
    .replace(/§6/g,c.fg.yellow)
    .replace(/§e/g,c.fg.yellow)
    .replace(/§2/g,c.fg.green)
    .replace(/§a/g,c.fg.green)
    .replace(/§b/g,c.fg.cyan)
    .replace(/§3/g,c.fg.cyan)
    .replace(/§1/g,c.fg.blue)
    .replace(/§9/g,c.fg.blue)
    .replace(/§d/g,c.fg.magenta)
    .replace(/§5/g,c.fg.magenta)
    .replace(/§f/g,c.fg.white)
    .replace(/§7/g,c.fg.white)
    .replace(/§8/g,c.fg.white)
    .replace(/§0/g,c.fg.white)
    .replace(/§r/g,c.reset);
}
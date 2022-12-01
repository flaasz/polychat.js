for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 16; j++) {
        let code = i * 16 + j;
        console.log(`\u001b[48;5;${code}m${code}`);
    }
}

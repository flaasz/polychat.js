const encoder = require("./encoder.js");

const {
    enableAnnouncer,
    announcerTimer,
    announementList
} = require("../config.json");

module.exports = {

    startAnnouncer: async function (clients) {
        if (!enableAnnouncer) return;

        let iteration = 1;
        let maxIterations = announementList.length;
        
        function sendAnnounce() {
            let processedAnnouncement = `§c[INFO] §r${announementList[iteration - 1]}`;
            iteration++;
            if (iteration > maxIterations) iteration = 1;
        
            encoder.encodeAnnouncement(clients, processedAnnouncement);
        }
        
        setInterval(function () {
            sendAnnounce();
        }, announcerTimer * 60 * 1000);
    }
};
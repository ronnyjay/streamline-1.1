module.exports = {
    getTime: function() {
        var date = new Date();

        var time = date.toLocaleTimeString('en-Us', {
            hour12: true,
        });

        var date = date.toLocaleString('en-US', {
            hour12: true,
        }).split(",")[0];

        return time + ", " + date;
    }
}

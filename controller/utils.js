var utils = function() {

    this.version = "1.0.0",

    this.sendResponse = (res, status, content) => {
        res.status = status;
        res.send(content);
    },

    this.getTimestamp = () => {
        var date = new Date();
        return "" + date.valueOf();
    }

    this.getDate = () => {
        var date = new Date();
        return date.toLocaleDateString();
    }
};

module.exports = new utils();
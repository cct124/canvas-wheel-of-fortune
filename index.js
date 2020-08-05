if (process.env.NODE_ENV === "production") {
    module.exports = require("./dist/wheel.min.js");
} else {
    module.exports = require("./dist/wheel.js");
}

var path = require("path");
var SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");

module.exports = function () {};

module.exports.pitch = function (request) {
    if (!this.webpack) throw new Error("Only usable with webpack");

    var callback = this.async();
    this.cacheable();

    var compiler = this._compilation.createChildCompiler("compile-loader", {});
    compiler.apply(new SingleEntryPlugin(this.context, "!!" + request, "main"));

    compiler.runAsChild(function (err, entries, compilation) {
        if(err) return callback(err);
        if (entries[0]) {
            var compiledFile = entries[0].files[0];
            return callback(null, "module.exports = " + JSON.stringify(compilation.assets[compiledFile].source()));
        } else {
            return callback(null, null);
        }
    });
};

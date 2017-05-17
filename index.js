var path = require("path");
var SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
var loaderUtils = require("loader-utils");

module.exports = function () {};

module.exports.pitch = function (request) {
    if (!this.webpack) throw new Error("Only usable with webpack");

    var options = loaderUtils.getOptions(this);

    var callback = this.async();

    var compiler = this._compilation.createChildCompiler("compile-loader", options.compilerOptions);
    compiler.apply(new SingleEntryPlugin2(this.context, "!!" + request, "main"));

    var subCache = "subcache " + __dirname + " " + request;
    compiler.plugin("compilation", function(compilation) {
        if(compilation.cache) {
            if(!compilation.cache[subCache])
                compilation.cache[subCache] = {};
            compilation.cache = compilation.cache[subCache];
        }
    });

    compiler.runAsChild(function (err, entries, compilation) {
        if(err) return callback(err);
        if (entries[0]) {
            var compiledCode = compilation.assets[entries[0].files[0]].source()
            if (options.asString) {
                return callback(null, "module.exports = " + JSON.stringify(compiledCode));
            }
            return callback(null, compiledCode);
        } else {
            return callback(null, null);
        }
    });
};

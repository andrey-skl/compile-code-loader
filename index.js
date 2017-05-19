const path = require("path");
const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
const loaderUtils = require("loader-utils");

module.exports = function () {};

module.exports.pitch = function (request) {
    if (!this.webpack) throw new Error("Only usable with webpack");

    let compiledCode = null;
    const options = loaderUtils.getOptions(this);

    const callback = this.async();

    const compiler = this._compilation.createChildCompiler("compile-loader", options.compilerOptions);
    compiler.apply(new SingleEntryPlugin(this.context, "!!" + request, 'compile-loader-file-name'));

    const subCache = "subcache " + __dirname + " " + request;
    compiler.plugin("compilation", function(compilation) {
        if(compilation.cache) {
            if(!compilation.cache[subCache])
                compilation.cache[subCache] = {};
            compilation.cache = compilation.cache[subCache];
        }
    });

    //Remove compiled file from assets to avoid emiting file
    compiler.plugin("after-compile", function(compilation, callback) {
        compiledCode = Object.values(compilation.assets)[0].source();
        compilation.assets = {};
        callback();
    });

    compiler.runAsChild(function (err, entries, compilation) {
        if(err) return callback(err);
        if (compiledCode) {
            if (options.asString) {
                return callback(null, "module.exports = " + JSON.stringify(compiledCode));
            }
            return callback(null, compiledCode);
        } else {
            return callback(null, null);
        }
    });
};

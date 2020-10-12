const path = require("path");
const SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin");
const loaderUtils = require("loader-utils");

module.exports = function () {};

const PLUGIN = 'compile-code-loader';

module.exports.pitch = function (request) {
    if (!this.webpack) throw new Error("Only usable with webpack");

    let compiledCode = null;
    const options = loaderUtils.getOptions(this) || {};

    const callback = this.async();

    const compiler = this._compilation.createChildCompiler(PLUGIN, options.compilerOptions);
    
    new SingleEntryPlugin(this.context, "!!" + request, 'compile-loader-file-name').apply(compiler);

    const subCache = "subcache " + __dirname + " " + request;
    
    compiler.hooks.compilation.tap(PLUGIN, function(compilation) {
        if(compilation.cache) {
            if(!compilation.cache[subCache])
                compilation.cache[subCache] = {};
            compilation.cache = compilation.cache[subCache];
        }
    });

    //Remove compiled file from assets to avoid emiting file
    compiler.hooks.afterCompile.tapAsync(PLUGIN, function(compilation, callback) {
        compiledCode = Object.values(compilation.assets)[0].source();
        compilation.assets = {};
        callback();
    });

    compiler.runAsChild(function (err, entries, compilation) {
        if(err) return callback(err);
        if (compiledCode) {
            if (options.rawCompiledCode) {
                return callback(null, compiledCode);
            }
            return callback(null, "module.exports = " + JSON.stringify(compiledCode));
        } else {
            return callback(null, null);
        }
    });
};

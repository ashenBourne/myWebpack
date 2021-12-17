(function(graph){
            function require(module){
                function localRequire(relativePath){
                    return require(graph[module].dependecies[relativePath])
                }
                var exports = {};
                (function(require,exports,code){
                    eval(code)
                })(localRequire,exports,graph[module].code);
                return exports;
            }
            require('./src/target/index.js')
        })({"./src/target/index.js":{"dependecies":{"../module/__esModule.js":"./src\\module\\__esModule.js"},"code":"\"use strict\";\n\nvar _esModule = _interopRequireDefault(require(\"../module/__esModule.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\n// node不支持es6的import导入，所以直接执行这个文件是不行的\nconsole.log(_esModule[\"default\"]);"},"./src\\module\\__esModule.js":{"dependecies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\nvar _default = {\n  name: \"默认导出\"\n};\nexports[\"default\"] = _default;"}})
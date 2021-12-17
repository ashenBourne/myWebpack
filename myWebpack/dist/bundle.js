(function (graph) {
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require,exports,code) {
                eval(code)
            })(absRequire,exports,graph[file].code)
            return exports
        }
        require('./src/target/index.js')
    })({"./src/target/index.js":{"deps":{"../module/__esModule.js":"./src\\module\\__esModule.js"},"code":"\"use strict\";\n\nvar _esModule = _interopRequireDefault(require(\"../module/__esModule.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\n// node不支持es6的import导入，所以直接执行这个文件是不行的\nvar title = require(\"../common.js\");\n\nconsole.log(\"默认导出内容是\" + _esModule[\"default\"]); // console.log(\"测试数字是：\"+testNumber);\n\nconsole.log(\"common的标题是：\" + title);"},"./src\\module\\__esModule.js":{"deps":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.testNumber = exports[\"default\"] = void 0;\nvar testNumber = 12;\nexports.testNumber = testNumber;\nvar _default = \"默认导出\";\nexports[\"default\"] = _default;"}})
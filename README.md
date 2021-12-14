# webpack原理及先关概念解析

## 打包文件分析
打包分析的文件在dist-analysis文件夹内

1. webpack打包之后，会打包成一个自执行函数
    ```javascript
    (function (modules){

    })({
        "./src/index.js":()     //括号里是函数内容
    })
    ```
2. 执行入口函数
    ```javascript
     return __webpack_require__(__webpack_require__.s = "./src/index.js");
    ```
3. 入口文件内容
   ```javascript
   // node不支持es6的import导入，所以直接执行这个文件是不行的
    import name,{ testNumber } from "./__esModule.js";
    let title =require("./common.js")
    console.log("默认导出内容是"+name);
    console.log("测试数字是："+testNumber);
    console.log("common的标题是："+title);
   ```
4. 打包文件分析
   ```javascript
    // 这是__esModule.js文件内容
    export const testNumber=12
    export default "默认导出"
   ```
   ```javascript
   {

    "./src/__esModule.js":
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        //es6模块就打上__esModule属性，表明是esModule导出的。
        __webpack_require__.r(__webpack_exports__);
        // es6导出的内容，就将其赋给导出对象，作为属性值
        __webpack_require__.d(__webpack_exports__, "testNumber", function () { return testNumber; });
        const testNumber = 12
        __webpack_exports__["default"] = ("默认导出");

      }),

    "./src/common.js":
      // commonJS就简单了，直接导出就行
      (function (module, exports) {

        module.exports = 'common的标题'

      }),

    "./src/index.js":
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        // 如果使用的是es6模块的导入，则定义额外属性：__esModule
        __webpack_require__.r(__webpack_exports__);
        // node不能识别import，所以需要将es6这些转换成commonJs形式的。export导出的内容会变成导出对象的属性值
        var _esModule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./__esModule.js */ "./src/__esModule.js");
        // node不支持es6的import导入，所以直接执行这个文件是不行的
        let title = __webpack_require__(/*! ./common.js */ "./src/common.js")
        console.log("默认导出内容是" + _esModule_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
        console.log("测试数字是：" + _esModule_js__WEBPACK_IMPORTED_MODULE_0__["testNumber"]);
        console.log("common的标题是：" + title);

      })

    }
   ```
## webpack打包流程

1. 初始化参数：从配置文件和shell命令中获取参数并与default参数合并，得到最终参数；
   
2. 开始编译：初始化Compiler对象，将上一步得到的最终参数作为参数导入进去，加载所有的插件，执行Compiler的run方法，开始启动编译。
3. 编译模块：从入口文件开始，调动所有配置的loader，翻译对应类型的文件，找出该模块依赖的模块；递归上述步骤，直到每个被翻译、所有依赖被出来。
4. 输出资源：根据入口和各依赖关系，组成一个个包含多个模块的Chunk，再把每个Chunk转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会。
5. 输出完成：在确定好内容之后，根据配置文件，输出到特定文件夹中

&nbsp;&nbsp;&nbsp;&nbsp;在以上过程中,Webpack 会在特定的时间点广播出特定的事件,插件在监听到感兴趣的事件后会执行特定的逻辑,并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果
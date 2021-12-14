// node不支持es6的import导入，所以直接执行这个文件是不行的
import name,{ testNumber } from "./__esModule.js";
let title =require("./common.js")
console.log("默认导出内容是"+name);
console.log("测试数字是："+testNumber);
console.log("common的标题是："+title);
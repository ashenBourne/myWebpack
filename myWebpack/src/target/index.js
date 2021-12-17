// node不支持es6的import导入，所以直接执行这个文件是不行的
import name from "../module/__esModule.js";
console.log(name);
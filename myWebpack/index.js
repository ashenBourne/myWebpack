/**
 * 入口文件
 */
const fs = require('fs');
const path = require('path');
// 配置文件
const options = require('./webpack.config');
// babel翻译器
const parser = require('@babel/parser');
// 递归遍历文件中import的内容：收集依赖
const traverse = require('@babel/traverse').default;
// 获得的ES6的AST转化成ES5的AST：需要@babel/core @babel/preset-env
const { transformFromAst } = require('@babel/core');
const Parser = {
    // 读取文件，获取ast抽象语法树
    getAst: path => {
        // 读取文件   
        const content = fs.readFileSync(path, 'utf-8');
        // 将文件内容转为AST抽象语法树   
        return parser.parse(content, { sourceType: 'module' })
    },
    // 获取所有路径，key为
    getDependecies: (ast, filename) => {
        const dependecies = {}
        // 遍历所有的 import 模块,存入dependecies,文件名对应
        traverse(ast, {
            // 类型为 ImportDeclaration 的 AST 节点 (即为import 语句)
            ImportDeclaration({ node }) {
                const dirname = path.dirname(filename)  //对于本目录来说，这是./src
                // 保存依赖模块路径,之后生成依赖关系图需要用到
                // value是一个路径，根据引入文件来的
                const filepath = './' + path.join(dirname, node.source.value);
                dependecies[node.source.value] = filepath
                // {
                //     './__esModule':'./src/__esModule.js'
                // }
                
            }
        })
        return dependecies
    },
    getCode: ast => {
        // AST转换为code
        const { code } = transformFromAst(ast, null, {
            presets: ['@babel/preset-env']
        })
        return code
    }
}
class Compiler {
    constructor(options) {
        // webpack 配置
        const { entry, output } = options
        // 入口
        this.entry = entry
        // 出口
        this.output = output
        // 模块
        this.modules = []
    }
    // 构建启动  
    run() {
        // 解析入口文件
        const info = this.build(this.entry);
        this.modules.push(info);
        for(let item of this.modules){
            const {dependecies} = item;
            if (dependecies) {
                for (const dependency in dependecies) {
                    this.modules.push(this.build(dependecies[dependency]))
                }
            }
        }//生成依赖图
        
        const dependencyGraph = this.modules.reduce(
            (graph, item) => ({
                ...graph,
                // 使用文件路径作为每个模块的唯一标识符,保存对应模块的依赖对象和文件内容
                [item.filename]: { dependecies: item.dependecies, code: item.code }
            }),
            {});
        this.generate(dependencyGraph)
    }
    build(filename) {
        const { getAst, getDependecies, getCode } = Parser
        const ast = getAst(filename)
        const dependecies = getDependecies(ast, filename)
        const code = getCode(ast)
        return {
            // 文件路径,可以作为每个模块的唯一标识符  
            filename,
            // 依赖对象,保存着依赖模块路径  
            dependecies,
            // 文件内容  
            code
        }
    }
    // 重写 require函数 (浏览器不能识别commonjs语法),输出bundle  
    generate(code) {
        // 输出文件路径
        const filePath = path.join(this.output.path, this.output.filename)
        
        const bundle = `(function(graph){
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
            require('${this.entry}')
        })(${JSON.stringify(code)})`
        // 把文件内容写入到文件系统
        fs.writeFileSync(filePath, bundle, 'utf-8')
    }
}
new Compiler(options).run()
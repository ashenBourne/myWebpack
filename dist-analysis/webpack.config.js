const path=require("path");
const HtmlWebpackPlugin=require("html-webpack-plugin");
module.exports={
    mode:"development", //开发模式，文件不压缩
    /**
     * development模式下，devtool默认为eval：打包后的代码，每一个打包后的模块后面都增加了包含sourceURL的注释，
     * sourceURL的值是压缩前存放的代码的位置，这样就通过sourceURL关联了压缩前后的代码。并"没有"为每一个
     * 模块生成相对应的sourcemap。都是执行的eval，很难看；
     */
    devtool: false,
    // 单入口
    entry:"./src/index.js", 
    output:{
        path:path.resolve(__dirname,"dist"),    //导出路径  ：只能是绝对路径
        filename:"[name].js"    //打包后的文件
    },

    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html',    //模板页
            filename:"index.html"
        })
    ]

}


/**
* @author Pound
* @date 2017-06-10
* @description:首页js
* */
$(function() {

});
var code = (function(_self) {
       
    //定义变量   
    _self.exportArr = [
    {"name":"名称A","code":"687715DA-9ECE-7F8F-C205-A1EB122DA42D"},
    {"name":"名称B","code":"91D32A91-2377-7069-E102-2BDF3F664BEB"}
    ];   

    //定义函数
    _self.fn1=function(){
       console.log(2);
    }


    //函数调用
    _self.fn1();


    return _self;
})(window.code || {});

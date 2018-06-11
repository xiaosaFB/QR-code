/**
* @author Pound
* @date 2017-06-10
* @description:首页js
* */
$(function() {

});
var mCode = (function(_self) {
    let loadIndex =0;
    let bg_rectangle = "../image/bg-rectangle.png";
    let bg_circle= "../image/bg-circle.png";

    //定义变量   
    _self.exportArr = [];   

    _self.createCode = function() {
        let num  = $.trim($("#num").val());
        if(num<1 || num>50 || !(num%1 === 0)){
            layer.msg("请输入1~50之间的整数！");
            return;
        }
        loadIndex = layer.load(2, {time: 10*1000})
        _self.exportArr =[];
        for(let i=0;i<num;i++){
            _self.exportArr.push({
                "name":i,
                "code":uuid()
            })
        }
        _self.drawCodeImg();
    }

    //画二维码
    _self.drawCodeImg =function() {
        let _length = _self.exportArr.length;
        let type = $("input[name='optionsRadiosinline']").val();
        let $p_hide = $("#contet_code_hide");
        let $p = $("#contet_code");
        let name =$.trim($("#orgName").val());
        let mainClass = 'tablelist-code';
        let html_name = '';
        if(type==1){
             mainClass = 'tablelist-code-circle';
        }else{
            html_name ='<div class="tablelist-code-name">'+name+'</div>';
        }
        $p_hide.empty();
        let everydataUrl =[];
        for(var i=0;i<_length;i++){
            $p_hide.append(`<div  id="code_`+_self.exportArr[i].code+`" class="`+mainClass+`">`
                +html_name+
                `<canvas id="canvas" width="30px" height="30px"></canvas>
            </div>`);
            updateCode($("#code_"+_self.exportArr[i].code),_self.exportArr[i].code);
            //获得二维码的dataurl         
            //获得的二维码dataurl存入数组    
            html2canvas(document.querySelector("#code_"+_self.exportArr[i].code)).then(canvas => {
                $p.append(canvas);
            });
        }
        $p_hide.hide(500);
        let setTime_m = 100*_length;
        if(setTime_m<500){
            setTime_m=500;
        }
        setTimeout(function() {
            for(var i=0;i<_length;i++){
                everydataUrl.push($("#contet_code").children("canvas")[i].toDataURL("image/png"));  
            }
            //大于1张导出zip
            if(_length > 1){
                var zip = new JSZip();
                //压缩包文件夹名称
                var qrCodeImg = zip.folder("AllQrCode");
                for (var i = 0; i < _length; i++) {
                    var blobData = dataURLtoBlob(everydataUrl[i]);
                    qrCodeImg.file(_self.exportArr[i].name+".png", blobData, {base64: true});
                    if(i==_length-1){
                        //循环结束保存压缩包
                        //将zip序列化为二进制流
                        zip.generateAsync({type:"blob"})
                        .then(function(content) {
                            saveAs(content, "资产二维码("+_length+").zip");
                        });
                    }
                } 
            }else{
                for (var i = 0; i < _length; i++) {
                    var blobData = dataURLtoBlob(everydataUrl[i]);
                    saveAs(blobData,_self.exportArr[i].name+".png");
                }    
            }
            layer.closeAll();   
        },setTime_m)
       
    }
   


    //绘制 canvas 配置
    var isOpera = Object.prototype.toString.call(window.opera) === '[object Opera]',
        guiValuePairs = [
            ["size", "px"],
            ["minversion", ""],
            ["quiet", " modules"],
            ["radius", "%"],
            ["msize", "%"],
            ["mposx", "%"],
            ["mposy", "%"]
        ],
        updateGui = function () {

            $.each(guiValuePairs, function (idx, pair) {                
                var $label = $('label[for="' + pair[0] + '"]');             
                $label.text($label.text().replace(/:.*/, ': ' + $('#' + pair[0]).val() + pair[1]));
            });
        },

        updateQrCode = function (obj,code) {
            var options = {
                    render: 'canvas',  //设置渲染方式，有table和canvas
                    ecLevel: 'L',
                    minVersion: 6,
                    fill: '#333333',
                    background: '#ffffff',//背景颜色
                    //foreground : "#000000", //二维码的前景色
                    text: code,
                    size: '118',
                    radius:0.5,
                    quiet: 1,
                    mode: 4,
                    mSize:  0.142,
                    mPosX: 0.5,
                    mPosY: 0.5,
                    label: '',
                    fontname: 'Ubuntu',
                    fontcolor:'#ff9818', //二维码颜色
                    image:$("#img-buffer")[0]
                };          
            obj.empty().qrcode(options);
        },

        updateCode = function (obj,code) {
            updateGui();
            updateQrCode(obj,code);
        },

        dataURLtoBlob = function(dataurl) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type:mime});
        };


    //js生成 GUID
    function uuid(len, radix) {//这个可以指定长度和基数
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
     
        if (len) {
          // Compact form
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
        } else {
          // rfc4122, version 4 form
          var r;
     
          // rfc4122 requires these characters
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';
     
          // Fill in random data.  At i==19 set the high bits of clock sequence as
          // per rfc4122, sec. 4.1.5
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random()*16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
     
        return uuid.join('');
    }


    return _self;
})(window.mCode  || {});

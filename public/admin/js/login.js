
$(function(){
    //1 校验表单->详情看bootstrapvalidator/language/zh_CN.js
    $('form').bootstrapValidator({

        //1.指定校验字段
        fields: {

            //校验用户名,对应的是name属性
            username: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min:3,
                        max:6,
                        message: '用户名长度必须在3-6之间'
                    },
                    callback: {
                        message: '用户名不存在!!!!'
                    }
                }
            },

            //校验密码,默认对应name属性
            password: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    //长度校验
                    stringLength: {
                        min:6,
                        max:12,
                        message: '密码长度必须在6-12之间'
                    },
                    callback: {
                        message: '密码错误!!!!'
                    }
                }
            }

        },
        //2.指定校验的小图标显示,默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }

    });

    //2. 给表单注册一个 校验成功的事件
    $("form").on("success.form.bv", function(e){
        e.preventDefault();//阻止浏览器的默认行为
        //console.log("需要发送ajax请求");
        $.ajax({
            type: 'post',
            url: '/employee/employeeLogin',
            data: $("form").serialize(),
            dataType: 'json',
            success: function(info) {
                
                if(info.error === 1000){
                    //手动调用方法，updateStatus让username校验失败即可
                    //第一个参数：改变哪个字段
                    //第二个参数：改成什么状态  VALID:通过  INVALID:不通过
                    //第三个参数：选择提示的信息
                    $("form").data("bootstrapValidator").updateStatus("username", "INVALID", "callback");

                }
        
                if(info.error === 1001){
                    $("form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                }
        
                if(info.success){
                    //登录成功
                    location.href = "index.html";
                }
                
        
            }
        });
    });

    //3. 给重置注册事件
    $("[type='reset']").on('click',function(){
        //重置样式
        $('form').data("bootstrapValidator").resetForm();
    });
    
})
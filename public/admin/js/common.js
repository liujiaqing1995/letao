// 4. 显示进度条
// 使用Nprogress.js插件

//进度条功能
//禁用进度环
NProgress.configure({ showSpinner: false });
//注册一个全局的ajaxStart事件，所有的ajax在开启的时候，会触发这个事件
$(document).ajaxStart(function(){
    NProgress.start();
});

$(document).ajaxStop(function(){
    setTimeout(function(){
        NProgress.dosne();
    },2000);
   
});

// 5. 二级分类显示隐藏功能
$(".sorts").prev().on("click",function(){
    $(this).next().slideToggle();
})

// 6. 侧边栏的显示与隐藏
$('.icon-menu').on('click',function(){
    $('body').toggleClass('active');
    $('.lt_aside').toggleClass('active');
})

// 7. 退出组件
$('.icon-logout').on('click',function(){   
    $("#logoutModal").modal("show");
})
//7.1 退出登录信息,发送ajax
$(".btn_logout").on("click", function () {
    //console.log("Hehe");
    //发送ajax请求，退出系统
    $.ajax({
        type:"get",
        url:"/employee/employeeLogout",
        success:function (info) {
            if(info.success){
            //退出成功
            location.href = "login.html";
            }
        }
    });
});
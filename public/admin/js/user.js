$(function(){

    var page=1; //当前页
    var pageSize=5; //一页显示的个数
    //1. 页面加载时渲染页面
    render();

    //渲染页面
    function render(){
        //发送ajax请求数据
        $.ajax({
            url:"/user/queryUser",
            data:{
                page:page,
                pageSize:pageSize
            },
            success: function(info){
                console.log(info);
                //将数据和模板进行绑定
                $('tbody').html( template('usertpl',info) );
                  //2. 进行分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: page,
                    totalPages: Math.ceil(info.total/info.size),
                    onPageClicked: function(a,b,c,p){
                        page=p;
                        render();
                    }
                })
            }
        })
    }

    //3 启用禁用的功能切换(采用事件委托)
    var isDelete;
    var id;
    $('tbody').on('click','.btn',function(){
        //弹出模态框
        $("#userModal").modal('show');
        isDelete = $(this).hasClass('btn-primary')?'1':'0';
        id = $(this).parent().data('id');
     
    }) 
    //3.1 点击确定重新渲染页面
    $('.btn_confirm').on('click',function(){
        // 发送ajax请求
        $.ajax({
            type: 'post',
            url: '/user/updateUser',
            data:{
                id: id,
                isDelete: isDelete
            },
            success: function(info){
                console.log(info);
                if(info.success){
                    //渲染页面
                    render();
                    //模态框隐藏
                    $("#userModal").modal('hide');
                }
                
            }
        })
    })

})
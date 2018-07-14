$(function(){

    //1. 页面渲染
    var page =1;
    var pageSize=5;
    render();

    //2. 添加分类模块
    $('.btn_add').on('click',function(){
        $('#addModal').modal(('show'));
    })
    //2.1 添加之前要先校验
    $('form').bootstrapValidator({
    
        //2.1.1 校验一级分类名称
        fields: {
            categoryName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                }
            }
        },
        //2.1.2指定校验的小图标显示,默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
    })
    //2.2 添加校验成功时事件
    $('form').on('success.form.bv',function(e){
        //阻止默认行为
        e.preventDefault();
        //发送ajax请求
        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            data: $('form').serialize(),
            success: function(info){
                console.log(info);
                //添加成功时
                if(info.success){
                    //隐藏模态框
                    $('#addModal').modal(('hide'));
                    //重新渲染页面
                    page = 1;
                    render();
                    //重置表单
                    $("form").data('bootstrapValidator').resetForm(true);

                }
                
            }
        })
    })
    

    function render(){

        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function(info){
                console.log(info);
                // 将数据与模板进行绑定
                $('tbody').html( template('tpl',info) );
                //2. 进行分页
                $('#paginator').bootstrapPaginator({
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



});
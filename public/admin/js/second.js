$(function(){
    //1. 页面的渲染
    var page=1;
    var pageSize = 5;
    render();

    //2. 添加二级分类功能出现模态框,发送ajax请求
    $('.btn_add').on('click',function(){
        //2.1显示模态框
        $('#addModal').modal('show');
        //2.2 发送ajax请求得到一级分类名称
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            success: function(info){
                console.log(info);
                //将数据和模板进行绑定
                $('.dropdown-menu').html( template('tpl2',info) );  
            }
        })
    });

    //3. 给下拉列表里面的a注册点击事件
    $('.dropdown-menu').on('click','a',function(){
        //将按钮的文字进行改变
        $('.dropdown_text').text( $(this).text() );
        //将获取的id值赋值给name="categoryId"
        $('[name="categoryId"]').val( $(this).data('id') );
        //3. 让categoryId校验变成成功
        $('form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
    })

    //4. 获取图片的路近赋值给name="brandLogo"
    $('#fileupload').fileupload({
        done: function(e,data){
            console.log(data.result);
            //将路近赋值给img
            $('.img_box>img').attr('src',data.result.picAddr);
            $('[name="brandLogo"]').val(data.result.picAddr);
            
            //把brandLogo改成成功
            $('form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    })

    //5. 校验表单
    $('form').bootstrapValidator({
        excluded: [],
    
        //2.1.1 校验一级分类名称
        fields: {
            categoryId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                }
            },
            categoryName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                }
            },
            brandLogo: {
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
    });

    //6. 注册校验成功事件
    $('form').on("success.form.bv", function (e) {
        
        //阻止默认行为
        e.preventDefault();
        //发送ajax请求
        $.ajax({
            type: 'post',
            url: '/category/addSecondCategory',
            data: $('form').serialize(),
            success: function(info){
                console.log(info);
                if(info.success){
                    //刷新页面
                    page=1;
                    render();
                    //隐藏模态框
                    $('#addModal').modal('hide');

                    //重置表单
                    $("form")[0].reset();
                    $("form").data("bootstrapValidator").resetForm(true);
                    // $("form").data("bootstrapValidator").resetForm(true);

                    //让其他恢复原本样式
                    $(".dropdown_text").text("请选择一级分类");
                    $("[name='categoryId']").val('');
                    $(".img_box img").attr("src", "images/none.png");
                    $("[name='brandLogo']").val('');
                }
            
            }
        })
    });
    
    


    function render(){
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function(info){
                console.log(info);
                //将数据和模板进行绑定
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
    };
})
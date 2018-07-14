$(function () {
    //1. 渲染页面
    var page = 1;
    var pageSize = 5;
    render();

    //3. 添加功能->静态页面,显示模态框
    $('.btn_add').on('click', function () {
        $('#addModal').modal('show');
        //4. 发送ajax获取二级分类
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            success: function (info) {
                console.log(info);
                $('.dropdown-menu').html(template('tpl2', info))

            }
        })
    });

    //5. 点击二级分类名称设置点击事件(事件委托)
    $('.dropdown-menu').on('click', 'a', function () {
        //获取文本内容
        $('.dropdown_text').text($(this).text());
        //获取id值
        $('[name="brandId"]').val($(this).data('id'));

        $('form').data("bootstrapValidator").updateStatus("brandId", "VALID");
    });

    //6. 表单验证
    $('form').bootstrapValidator({
        excluded: [],
        feedbackIcons: {
            //校验成功的图标
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {

            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品的名称"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品的描述"
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品的库存"
                    },
                    //正则校验
                    regexp: {
                        //不能是0开头，必须是数字
                        regexp: /^[1-9]\d*$/,
                        message: "请输入合法的库存"
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品的尺码(32-46)"
                    },
                    //正则校验
                    regexp: {
                        //不能是0开头，必须是数字
                        regexp: /^\d{2}-\d{2}$/,
                        message: "请输入合法的尺码,例如(32-46)"
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品的原价"
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品的价格"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }

        }
    })

    //7. 添加图片
    var imgs = [];
    $('#fileupload').fileupload({
        done: function (e, data) {
            if (imgs.length === 3) {
                return;
            }
            // console.log(data.result);
            $(".img_box").append('<img src="' + data.result.picAddr + '" width="100" height="100" style="display:inline-block" alt="">');
            imgs.push(data.result);

            //3. 判断数组的长度，如果是3，手动让brandLogo 校验成功即可，  如果不是3，校验失败
            if (imgs.length === 3) {
                $('form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
            } else {
                $('form').data("bootstrapValidator").updateStatus("brandLogo", "INVALID");
            }


        }
    });

    //8 注册校验成功时的事件
    $('form').on('success.form.bv', function (e) {
        e.preventDefault();
        var param = $('form').serialize();
        param += "&picName1=" + imgs[0].picName + "&picAddr1=" + imgs[0].picAddr;
        param += "&picName2=" + imgs[1].picName + "&picAddr2=" + imgs[1].picAddr;
        param += "&picName3=" + imgs[2].picName + "&picAddr3=" + imgs[2].picAddr;

        //发送ajax请求
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: param,
            success: function (info) {
                if (info.success) {
                    //隐藏模态框
                    $('#addModal').modal('hide');
                    //渲染第一页
                    page = 1;
                    render();
                    //重置表单的样式
                    // $form[0].reset();
                    $('form').data("bootstrapValidator").resetForm(true);
                    //其他样式的重置
                    imgs=[];
                    $(".img_box img").remove();
                    $(".dropdown_text").text("请选择一级分类");
                    $("[name='brandId']").val('');
                    $("[name='brandLogo']").val('');

                }
            }
        })

    });

    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (info) {
                console.log(info);
                $('tbody').html(template('tpl', info));
                //2. 进行分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    totalPages: Math.ceil(info.total / info.size),
                    currentPage: page,
                    onPageClicked: function (a, b, c, p) {
                        page = p;
                        render();
                    },
                    itemTexts: function ( type, page, current) {
                        // console.log(type, page, current);
                        switch (type) {
                            case 'first':
                                return '首页';
                            case 'prev':
                                return '上一页';
                            case 'next':
                                return '下一页';
                            case 'last':
                                return '末页';
                            default:
                                return page;
                        }

                    },
                    tooltipTitles: function (type, page, current) {
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "尾页";
                            //如果是page，说明就是数字，只需要返回对应的数字即可
                            default:
                                return "跳转到" + page;
                        }
                    },
                });
            }
        })
    }
})
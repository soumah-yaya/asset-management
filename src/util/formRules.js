export const loginFormRules = {
    username: [
        {
            required: true,
            message: '请输入登录名称',
        },
        {
            min: 3, max: 10, message: "长度在3到10个字符"
        }
    ],
    Password: [
        {
            required: true,
            message: '请输入登录密码'

        },
        {
            min: 6, max: 15, message: "长度在6到15个字符"
        }
    ],
    email: [
        {
            required: true,
            message: '请输入邮箱'

        }
    ],
    mobile: [
        {
            required: true,
            message: '请输入手机号码'

        }
    ],
    cateName: [
        {
            required: true,
            message: '请输入分类名称'

        }
    ],
}
export const EditOrderFormRules = {
    address1: [
        {
            required: true,
            message: '请选择省市县',
        },
    ],
    address2: [
        {
            required: true,
            message: '请选择详细地址',
        },
    ],
   
}

export const tabsFormRules = {
    goodsName: [
        {
            required: true,
            message: '请输入商品名称'
        }
    ],
    goodsPrice: [
        {
            required: true,
            message: '请输入商品价格'
        }
    ],
    goodsWeight: [
        {
            required: true,
            message: '请输入商品重量'
        }
    ],
    goodsNumber: [
        {
            required: true,
            message: '请输入商品数量'
        }
    ],
}
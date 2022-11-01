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
    ]
}
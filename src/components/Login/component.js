import React, { forwardRef } from 'react'
// antd
import { Button, Space, Form, Input } from 'antd';
// fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
// rules
import { loginFormRules } from '../../util/formRules'


// LoginForm
export const LoginForm = forwardRef(({ onFinish, onFinishFailed, handleFormReset }, ref) => {
    return (
        <Form
            name="basic"
            className='login_form'
            wrapperCol={{
                span: 24,
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            ref={ref}
        >
            {/* username */}
            <Form.Item
                label=""
                name="username"
                rules={loginFormRules.username}
                hasFeedback
            >
                <Input prefix={<FontAwesomeIcon className="form-item-icon" icon={faUser} />} placeholder="admin" />
            </Form.Item>
            {/* password */}
            <Form.Item
                label=""
                name="password"
                rules={loginFormRules.Password}
                hasFeedback
            >
                <Input.Password prefix={<FontAwesomeIcon className="form-item-icon" icon={faLock} />} />
            </Form.Item>
            {/* button */}
            <Form.Item className='btns' wrapperCol={{ span: 16 }}>
                <Space >

                    <Button type="primary" htmlType="submit">
                        登录
                    </Button>
                    <Button type="default" htmlType="button" onClick={handleFormReset}>
                        重置
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    )
})

// logo
export const Logo = ({ logo }) => {
    return (
        <div className='avatar_box'>
            <img src={logo} alt="logo" />
        </div>
    )
}


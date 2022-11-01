import React, { useRef } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import './login.css'
import logo from '../../assets/logo.svg'
// antd
import {message} from 'antd'
// components

import { Logo, LoginForm } from './component'
import useAuth from '../../hooks/useAuth'
// util
import { loginMessage } from '../../util/string'
// api
import api from '../../request/api'

// Login
function Login() {
    // form reference
    const formRef = useRef();
    const auth = useAuth();
    // console.log('auth',auth)

    const location = useLocation();
    const navigate = useNavigate();

    const onFinish = (values) => {
        // console.log('Success:', values);
        api.post('/login',values)
        .then(({data:res})=>{
            // console.log(res)
            if (res.meta.status !== 200) return message.error(loginMessage.loginFailed)
            const {token} = res
            auth.signin(token, () => {
                message.success(loginMessage.loginSuccess)
                let path = location.state?.from || '/';
                // console.log(path)
                navigate(`${path}`)

            })
            // console.log(res.token)
            
        })
        .catch((err)=>{
            console.log(err)
        })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    // reset handler
    const handleFormReset = () => {
        formRef.current.resetFields()
    }

    // return
    // console.log(auth.isAuth())
    if (auth.isAuth()) return <Navigate to="/" />
    return (
        <div className='login_container'>
            <div className='login_box'>
                {/* avatar  */}
                <Logo logo={logo} />
                {/* login form */}
                < LoginForm ref={formRef} onFinish={onFinish} onFinishFailed={onFinishFailed} handleFormReset={handleFormReset} />
            </div>
        </div>
    )
}

export default Login
import React from 'react'
import useAuth from '../../hooks/useAuth'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { loginMessage } from "../../util/string";
import Button from "antd-button-color";

function Home() {
  const auth = useAuth();
  const navigate = useNavigate();

  // logout button click
  const handleLogout = () => {
    auth.signout(() => {
      message.success(loginMessage.logoutSuccess)
      navigate('/login')
    })
  }
  // Home return
  return (
    <div>
      <Button type='lightdark'  onClick={handleLogout} >退出</Button>
    </div>
  )
}

export default Home
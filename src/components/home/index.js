import React, { useEffect, useState, useRef } from 'react'
import useAuth from '../../hooks/useAuth'
import { message } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import { loginMessage } from "../../util/string";
import Button from "antd-button-color";
import { Layout } from 'antd';

import api from '../../request/api'
import './home.css'

import SideBar from './components/SideBar';
import  useSessionStorage  from '../../hooks/useSessionStorage';

const { Header, Sider, Content } = Layout;



// Home
function Home() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [sideMenuList, setSideMenuList] = useState([]);
  const [currentItem, setCurrentItem] = useSessionStorage('currentItem','users')
  const [openKeys, setOpenKeys] = useSessionStorage('openKeys',['100']);
  const [collapsed, setCollapsed] = useState(false);
  const isMounted = useRef(true)
  // const [savedKey, setSavedKey] = useState('')

  useEffect(() => {
    if(isMounted.current){
    api.get('/menus')
      .then(({ data: res }) => {
        // console.log(res)
        if(res.meta.status === 200){
          setSideMenuList(res.data)
        } else if (res.meta.status === 401 && res.meta.msg ==="无效的token"){
          auth.signout(() => {           
            navigate('/login')
          })
        }
      })
      .catch(() => {
        console.log('获取数据失败')
      })}
  isMounted.current=false
  }, [auth, navigate])

  
  // logout button click
  const handleLogout = () => {
    auth.signout(() => {
      message.success(loginMessage.logoutSuccess)
      navigate('/login')
    })
  }
 
  

  const onClick = (e) => {
    // console.log('click ', e.key, savedKey );
    setCurrentItem(e.key);
    sessionStorage.setItem('key', e.key)
    // setSavedKey(e.key)
    navigate(`/${e.key}`)
  };

  // open only current menu
  const rootSubmenuKeys = ['100', '104', '110', '115', '108'];

// extend only current
  const onOpenChange = (keys) => {
    console.log('open key',keys)
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const toggleCollpse = () => {
    // console.log(1)
    setCollapsed(!collapsed);
  }


  // Home return
  return (
    <Layout style={{ height: '100%' }}>
      {/* header */}
      <Header >
        <h1 className='header_title'>电商后台管理系统</h1>
        <Button type='lightdark' onClick={handleLogout} >退出</Button>
      </Header>
      <Layout>
        {/* aside */}
        <Sider collapsed={collapsed}>
          <SideBar 
            toggleCollpse={toggleCollpse}
            onClick={onClick}
            onOpenChange={onOpenChange}
            collapsed={collapsed}
            currentItem={[currentItem]}
            openKeys={openKeys}
            sideMenuList={sideMenuList}
            
          />
          
        </Sider>
        {/* main content */}
        <Content style={{ backgroundColor: "#EAEDF1", padding: '20px' }}>
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  )
}


export default Home
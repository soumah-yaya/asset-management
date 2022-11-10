import {  Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faFlask, faChartGantt, faSliders, faGlobe, faGrip } from '@fortawesome/free-solid-svg-icons'




const SideBar = ({ sideMenuList, toggleCollpse, onClick, onOpenChange, collapsed, currentItem, openKeys, defaultSelectedKeys }) => {
    
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }
    const icons = {
        '100': faUsers,
        '104': faChartGantt,
        '110': faGlobe,
        '115': faSliders,
        '108': faFlask,

    }
   
    const items = sideMenuList.map((menuItem) => {
        return getItem(`${menuItem.authName}`, `${menuItem._id}`, <FontAwesomeIcon icon={icons[menuItem._id]} />,
            menuItem.children?.map((subItem) => {
                return getItem(`${subItem.authName}`, `${subItem.path}`, <FontAwesomeIcon icon={faGrip} />,)
            })
        )

    }
    )

    return (
        <>
            <div className='toggle-button' onClick={toggleCollpse}>|||</div>
            <Menu
                theme='dark'
                onClick={onClick}
                onOpenChange={onOpenChange}
                style={{
                    width: collapsed ? '80' : '100%',
                    backgroundColor: 'inherit',
                    color: '#ffffff'
                }}
                
                selectedKeys={currentItem}                
                openKeys={openKeys}
                mode="inline"
                items={items}

            />

        </>
    )
}
export default SideBar
import React, { useEffect, useState } from "react";
import { Layout, Menu, Image } from "antd";
import { useNavigate } from "react-router-dom";
import {
    HomeOutlined,
    UsergroupAddOutlined,
    FormOutlined,
    DiffOutlined,
    UserAddOutlined,
    FileImageOutlined,
    ContainerOutlined,
    MoneyCollectOutlined,
    TransactionOutlined,
    InfoCircleOutlined,
    BulbOutlined,
    PaperClipOutlined,
    GoldOutlined,
    SettingOutlined,
    MoreOutlined,
    RadiusSettingOutlined,
    WindowsOutlined,
    InstagramOutlined,
    ClusterOutlined,
    ToolOutlined,
    UngroupOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import logo from '../../../assets/images/mm-logo-1.png'

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { Sider } = Layout;
    const navigate = useNavigate();
    const onMenuClick = (event) => {
        const { key } = event
        navigate(key)
    }


    useEffect(() => {
        if(collapsed){
          document.body.classList.add('hasOpen')
        }
        else {
          document.body.classList.remove('hasOpen')
        }
      }, [collapsed])

    const commonChildrenArray = [

        {
            label: 'Faqs',
            key: 'faq',
            icon: <FormOutlined />
        },
    ];
    const settingChildrenArray = [
        {
            label: 'CMS',
            key: 'cms',
            icon: <WindowsOutlined />
        },
        {
            label: 'Our Contact Us',
            key: 'our-contact-us',
            icon: <WindowsOutlined />
        },
        {
            label: 'Setting',
            key: 'setting',
            icon: <RadiusSettingOutlined />
        },
        {
            label: 'Social Media',
            key: 'social-media',
            icon: <InstagramOutlined />
        },
    ];


    const items = [
        {
            label: 'Dashboard',
            key: 'dashboard',
            icon: <HomeOutlined />
        },
        {
            label: 'Customer',
            key: 'customer',
            icon: <UsergroupAddOutlined />
        },
        {
            label: 'Chat',
            key: 'chat',
            icon: <UsergroupAddOutlined />
        },
        {
            label: 'Vendor',
            key: 'vendor',
            icon: <UserAddOutlined />
        },
        {
            label: 'User Inquiry',
            key: 'contact-us',
            icon: <InfoCircleOutlined />
        },

        {
            label: 'More',
            key: 'common',
            icon: <MoreOutlined />,
            children: commonChildrenArray,
        },
        {
            label: 'Setting',
            key: 'setting-all',
            icon: <SettingOutlined />,
            children: settingChildrenArray,
        },
    ];

    return <>
          <Sider
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                background: "linear-gradient(50deg, #0376BC 50%, #00C4E6 100%)"
            }}
            // className="my-sidermenu-color sidebar-scroll-manage h-auto" 
            collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} id="sidebar_scroll"
        >
            <div className="logo" >
                <Image src={logo} alt='' preview={false} />
            </div>
            <Menu
                mode="inline"
                className="my-sidermenu-color"
                onClick={onMenuClick}
                items={items}
                style={{ minWidth: 0, flex: "auto",paddingBottom:40 }}
                theme={{ textColor: '#fff' }}
            />
        </Sider>
    </>

}
export default Sidebar;
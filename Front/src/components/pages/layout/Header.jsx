import React, { useEffect, useState } from 'react';
import { Col, Layout, Row, Button } from 'antd';
import { AppstoreOutlined, LogoutOutlined, ProfileOutlined, WechatOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import profileIamge from '../../../assets/images/dummy-profile-pic.jpg'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { BiChevronDown } from 'react-icons/bi'

const { Header } = Layout;
const HeaderPage = () => {

    const [profilePic, setProfilePic] = useState(profileIamge);
    const [name, setName] = useState('');

    const navigate = useNavigate();
    const onMenuClick = (event) => {
        const { key } = event
        navigate(key)
    }

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('profile'))) {

            if (JSON.parse(localStorage.getItem('profile')).profile_photo) {
                setProfilePic(JSON.parse(localStorage.getItem('profile')).profile_photo)
            }
            setName(JSON.parse(localStorage.getItem('profile')).first_name)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const childrenArray = [
        {
            label: 'Profile',
            key: 'Profile',
            icon: <ProfileOutlined />
        },
        {
            label: 'Chat',
            key: 'chat',
            icon: <WechatOutlined />
        },
        {
            label: 'Change Password',
            key: 'change-password',
            icon: <AppstoreOutlined />
        },
        {
            label: 'Logout',
            key: 'logout',
            icon: <LogoutOutlined />
        },


    ];
    const items = [
        {
            label: <div className='d-flex align-items-center'>
                <div>
                    <img
                        className="profile-img-icon"
                        alt=''
                        src={profilePic}
                    />
                </div>
                <div className='profile-name-show ms-1 hide-profile-name pb-2 align-items-center' style={{ color: '#000' }}>
                    <span>
                        {name?.slice(0, 7)}{(name?.length) > 7 ? '..' : ''}
                    </span>
                    {/* <span className="text-muted">
                        {userName?.slice(0, 7)}{(userName?.length) > 7 ? '..' : ''}
                    </span> */}
                    <BiChevronDown size={20} />

                </div>

            </div>,
            key: 'submenu',
            children: childrenArray,
        },
    ];

    return (
        <Header className="header my-header-color">
            <Row>
                <Col span={3}>

                </Col>

                <Col span={21}
                >
                    <div className='profile-menu ant-layout-header'>
                        {/* <img
                            className="profile-img-icon"
                            alt=''
                            src={profileIamge}
                        /> */}
                        <Menu mode="horizontal" onClick={onMenuClick} items={items} />
                    </div>
                </Col>
            </Row>
        </Header>
    )

}
export default HeaderPage;
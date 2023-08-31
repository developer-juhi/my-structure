import React from "react";
import { useEffect, useState } from 'react';
import { Layout } from "antd";
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import NotificationFcm from './NotificationFcm';
import { Outlet } from 'react-router-dom';

const Main = (props) => {
    const { Content } = Layout;

    const { ptitle } = props;
    useEffect(() => {
        document.title = process.env.REACT_APP_APP_NAME + ' ' + ptitle;
    }, [ptitle]);


    useEffect(() => {
        const isLogin = localStorage.getItem("accessToken") || false;
        if (!isLogin) {
            // window.location.href = "/login";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [screenHeight, setscreenHeight] = useState(100)
    const [screenWidth, setscreenWidth] = useState(100)


    useEffect(() => {
        setscreenHeight(window.innerHeight)
        setscreenWidth(window.innerWidth)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window])

    return (
        <>
            <NotificationFcm />
            <Layout className="site-layout" style={(screenWidth === 1024 && screenHeight === 1366) ? { height: '100vh' } : {}}>
                <Sidebar />
                {/* site-layout-main-div */}
                <Layout className="site-layout">
                    <div className="main-section-side">
                        <Header />
                        <Content
                            style={{
                                margin: '0 16px',
                            }}
                        >
                            <div className="margin-top-100">
                                <Outlet />
                            </div>
                        </Content>
                        <Footer />
                    </div>
                </Layout>
            </Layout>
        </>
    );
}

export default Main;

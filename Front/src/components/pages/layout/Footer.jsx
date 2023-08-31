import React from 'react';
import { Layout } from 'antd';
const FooterPage = () => {
    const { Footer } = Layout;
    let date = new Date()
    date = date.getFullYear()
    return (

        <Footer
            style={{
                textAlign: 'center',
                bottom: "0"
            }}
        >
            Ant Design ©{date} Created by Ant UED
        </Footer>
    )

}
export default FooterPage;
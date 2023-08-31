import React, { useEffect, useState } from "react";
import {   Layout, Form, Input } from "antd";
import { Card } from 'antd';
import ButtonSubmitReset from '../../layout/ButtonSubmitReset';
import Http from '../../../security/Http';
import { errorResponse, successResponse } from "../../../helpers/response";
import url from "../../../../Development.json";

const Index = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [form] = Form.useForm();
    const { Content } = Layout;

    useEffect(() => {
        return () => fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const fetchData = async () => {
        await Http
            .get(process.env.REACT_APP_BASE_URL + url.setting_edit_get)
            .then((response) => {
                let data = response.data.data;
                form.setFieldsValue({
                    // about_content: data.about_content,
                    // about_media: data.about_media,
                    // about_us: data.about_us,
                    // contact_us: data.contact_us,
                    // customer_footer_about_us: data.customer_footer_about_us,
                    // db_backup_email_id: data.db_backup_email_id,
                    // download_brochure: data.download_brochure,
                    email: data.email,
                    // facebook_url: data.facebook_url,
                    // instagram_url: data.instagram_url,
                    // logo: data.logo,
                    name: data.name,
                    phone_number: data.phone_number,
                    // site_address: data.site_address,
                    // twitter_url: data.twitter_url,
                    // youtube_url: data.youtube_url,
                });
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        await Http
            .post(
                process.env.REACT_APP_BASE_URL + url.setting_store,
                data
            )
            .then((response) => {
                setIsLoading(false);
                successResponse(response);
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response) {
                    errorResponse(error);
                }
            });
    };



    const onFinish = (values) => {
        const data = {
            // about_content: values.about_content,
            // about_media: values.about_media,
            // about_us: values.about_us,
            // contact_us: values.contact_us,
            // customer_footer_about_us: values.customer_footer_about_us,
            // db_backup_email_id: values.db_backup_email_id,
            // download_brochure: values.download_brochure,
            email: values.email,
            // logo: values.logo,
            name: values.name,
            phone_number: values.phone_number,
            // site_address: values.site_address,
            // facebook_url: values.facebook_url,
            // instagram_url: values.instagram_url,
            // linkdin_url: values.linkdin_url,
            // twitter_url: values.twitter_url,
            // youtube_url: values.youtube_url,
        }
        onSubmit(data);
    };


    const onReset = () => {
        form.resetFields();
    };

    return (
        <Content className="site-layout-background">
           
            <div className="site-card-border-less-wrapper center p-5 align-items-center">
                <Card title="Setting Form"  >
                    <Form form={form}
                        name="Setting"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >

                        <Form.Item
                            label="Name"
                            name="name"
                            id="name"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your name !`,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Phone Number"
                            name="phone_number"
                            id="phone_number"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your Phone No !`,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            id="email"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your Email !`,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                          className="text-center"
                        >
                            <ButtonSubmitReset isLoading={isLoading} onReset={onReset} />
                        </Form.Item>

                    </Form>
                </Card>
            </div>
        </Content>
    )
};

export default Index;

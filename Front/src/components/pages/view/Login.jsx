import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Col, Row, Modal } from 'antd';
import Container from 'react-bootstrap/Container';
import { Card } from 'antd';
import { useNavigate } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import url from "../../../Development.json";
import Http from '../../security/Http'
import {
    errorResponse,
    validateMessages,
    successResponse,
} from "../../helpers/response";
import { requestForToken } from '../../../firebase';

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isForgetPasswordModalOpen, setIsForgetPasswordModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        document.body.className = 'login-body';
        const isLogin = localStorage.getItem("accessToken") || false;
        if (isLogin) {
            window.location.href = "/dashboard";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const showForgetPasswordModal = () => {
        setIsForgetPasswordModalOpen(true);
    };
    const handleOk = () => {
        setIsForgetPasswordModalOpen(false);
    };
    const handleCancel = () => {
        setIsForgetPasswordModalOpen(false);
    };
    useEffect(() => {
        requestForToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (data) => {
        setIsLoading(true);
        await Http
        .post(process.env.REACT_APP_BASE_URL + url.login, data)
            .then((response) => {
                let data = response.data.data;
                localStorage.setItem(
                    "accessToken",
                    data.access_token
                );
                localStorage.setItem(
                    "profile",
                    JSON.stringify(data)
                );
                setIsLoading(false);
                successResponse(response);
                navigate('/dashboard');
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response) {
                    errorResponse(error);
                }
            });
    }
    const onFinish = (values) => {
        const data = {
            email: values.email,
            password: values.password,
            firebase_token: localStorage.getItem("fcm_device_token"),
        }
        console.log('login',data)
        onSubmit(data);
    };


    const onForgetPasswordFinish = (values) => {
        const data = {
            email: values.email,
        }
        onForgetPasswordSubmit(data);
    };
    const onForgetPasswordSubmit = async (data) => {
        await Http.post(process.env.REACT_APP_BASE_URL + url.forget_password, data)
            .then((response) => {
                successResponse(response);
                setIsForgetPasswordModalOpen(false);

            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    }
    return (
        <Container>
            <div className="site-card-border-less-wrapper center p-5 align-items-center d-flex">
                <Card title="Admin Login" className='login-form'>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        validateMessages={validateMessages()}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            id="email"
                            rules={[
                                {
                                    required: true,
                                    type: 'email',
                                    min: 7,
                                    max: 15,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 5,
                                    max: 15,
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <div className='center text-center'>
                            <Button type="primary" htmlType="submit" shape="round" className='login-button '>
                                {isLoading ? <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className='mr-2' />
                                </>
                                    : ''
                                }
                                {isLoading ? 'loading...' : 'Sign In'}
                            </Button>
                        </div>



                        <div className='m-2'>
                            <div className="cursor-pointer" onClick={showForgetPasswordModal}>
                                Forgot password ?
                            </div>
                        </div>

                    </Form>
                </Card>
            </div>
            <Modal title="Forget Password" open={isForgetPasswordModalOpen} footer={''} onOk={handleOk} onCancel={handleCancel}>
                <div className='m-2'>
                    Enter your email and we’ll send you email over there to reset your password.
                </div>
                <Form form={form}
                    onFinish={onForgetPasswordFinish}
                    validateMessages={validateMessages()}
                    autoComplete="off"
                >
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="Email"
                                name="email"
                                id="email"
                                rules={[
                                    {
                                        required: true,
                                        type: 'email',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>


                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit" block className='sky-button'>
                            {isLoading ? <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className='mr-2' />
                            </>
                                : ''
                            }
                            {isLoading ? 'loading...' : 'SEND'}
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>
        </Container>
    );
};

export default Login;
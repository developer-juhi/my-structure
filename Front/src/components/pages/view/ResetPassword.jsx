import React, { useState, useEffect, Fragment } from 'react';
import { Button, Form, Input } from 'antd';
import Container from 'react-bootstrap/Container';
import { Card } from 'antd';
import { Spinner } from 'react-bootstrap';
import url from "../../../Development.json";
import Http from '../../security/Http'
import {
    errorResponse,
    validateMessages,
    successResponse,
} from "../../helpers/response";
import { useParams, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [token, setSetToken] = useState(false);
    const { tokens } = useParams();
    useEffect(() => {
        setSetToken(tokens);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        await Http.post(process.env.REACT_APP_BASE_URL + url.reset_password, data)
            .then((response) => {
                setIsLoading(false);
                successResponse(response);
                navigate('/login');
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
            password: values.password,
            token: token,
        }
        onSubmit(data);
    };

    return (
        <Fragment>
            <div className="site-card-border-less-wrapper center p-5 align-items-center">
                <Card title="reset Password" className='login-form'>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        validateMessages={validateMessages()}
                        autoComplete="off"
                        layout="vertical"
                    >

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 7,
                                    max: 15,
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 7,
                                    max: 15,
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
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

                    </Form>
                </Card>
            </div>

        </Fragment>
    );
};

export default Login;
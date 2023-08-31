import React, { useEffect, useState } from "react";
import {   Layout, Form, Input } from "antd";
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonSubmitReset from '../../layout/ButtonSubmitReset';
import Http from '../../../security/Http';
import { errorResponse, successResponse, validateMessages } from "../../../helpers/response";
import url from "../../../../Development.json";
import { Card, CardHeader } from "reactstrap";


const PageForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const [id, setId] = useState('');
    const { state } = useLocation()
    const { Content } = Layout;


    useEffect(() => {
        if (state && state.id) {
            fetchData(state.id)
            setId(state.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const fetchData = (id) => {
        let idpass = `?id=${id}`;
        Http
            .get(process.env.REACT_APP_BASE_URL + url.faq_edit_get + idpass)
            .then((response) => {
                let data = response.data.data;
                form.setFieldsValue({
                    question: data.question,
                    answer: data.answer,
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
        if (state && state.id) {
            data["id"] = state.id;
        }
        await Http
            .post(
                process.env.REACT_APP_BASE_URL + url.faq_store,
                data
            )
            .then((response) => {
                setIsLoading(false);
                successResponse(response);
                navigate('/faq');
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
            question: values.question,
            answer: values.answer,
        }
        onSubmit(data);
    };

    const onReset = () => {
        form.resetFields();
    };
 

    return (
        <Content className="site-layout-background">
          
            <div className="site-card-border-less-wrapper">
                <Card title="Faq Form"  >
                    <CardHeader className="card-header-part">
                        <h5>Faq {id ? 'Update' : 'Add'}</h5>
                    </CardHeader>

                    <Form form={form}
                        name="basic"
                        layout="vertical"
                        onFinish={onFinish}
                        validateMessages={validateMessages()}
                        autoComplete="off"
                        className="m-5"
                    >
                        <Form.Item
                            label="Question"
                            name="question"
                            id="question"
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 3,
                                    max: 99,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Answer"
                            name="answer"
                            id="answer"
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 3,
                                    max: 99,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <ButtonSubmitReset isLoading={isLoading} onReset={onReset} />
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </Content>
    )
};

export default PageForm;

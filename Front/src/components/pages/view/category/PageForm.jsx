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
    const [parentId, setParentId] = useState('');

    useEffect(() => {
        if (state && state.id) {
            fetchData(state.id)
            setId(state.id);
        }
        if (state && state.parentId) {
            setParentId(state.parentId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const fetchData = (id) => {
        let idpass = `?id=${id}`;
        Http
            .get(process.env.REACT_APP_BASE_URL + url.category_edit_get + idpass)
            .then((response) => {
                let data = response.data.data;
                form.setFieldsValue({
                    name: data.name,
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
                process.env.REACT_APP_BASE_URL + url.category_store,
                data
            )
            .then((response) => {
                setIsLoading(false);
                successResponse(response);
                navigate('/category');
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
            name: values.name,
            parent_id: parentId,
        }
        onSubmit(data);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Content className="site-layout-background">
          
            <div className="site-card-border-less-wrapper">
                <Card title="Category Form" >
                    <CardHeader className="card-header-part">
                        <h5>Category {id ? 'Update' : 'Add'}</h5>
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
                            label="Name"
                            name="name"
                            id="name"
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

import React, { useEffect, useState } from "react";
import { Layout, Form, Input, Select, Button, Upload, Image } from "antd";
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonSubmitReset from '../../layout/ButtonSubmitReset';
import Http from '../../../security/Http';
import { errorResponse, successResponse, validateMessages } from "../../../helpers/response";
import url from "../../../../Development.json";
import { Card, CardHeader } from "reactstrap";
import { UploadOutlined } from "@ant-design/icons";


const PageForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const [id, setId] = useState('');
    const { state } = useLocation()
    const { Content } = Layout;
    const { Option } = Select;
    const [iconTypeData, setIconTypeData] = useState([])
    const [iconType, setIconType] = useState('')
    const [uploadImage, setUploadImage] = useState()
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
            .get(process.env.REACT_APP_BASE_URL + url.social_media_edit_get + idpass)
            .then((response) => {
                let data = response.data.data;
                form.setFieldsValue({
                    name: data.name,
                    url_link: data.value,
                    icon: data.icon ?? ''
                });
                setIconType(data.icon)
                setUploadImage(data.icon)

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
                process.env.REACT_APP_BASE_URL + url.social_media_store,
                data
            )
            .then((response) => {
                setIsLoading(false);
                successResponse(response);
                navigate('/social-media');
            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response) {
                    errorResponse(error);
                }
            });
    };

    const onFinish = async (values) => {
        const data = {
            name: values.name,
            url_link: values.url_link,
            icon: uploadImage
        }
        await onSubmit(data);
    };

    const onReset = () => {
        form.resetFields();
        setUploadImage()
    };


    //    const [socialIcon, setSocialIcon] = useState()

    const onChangeImage = (info) => {
        if (info.file.status === 'done') {
            setUploadImage(info.file.response.data.image_url);
            // setSocialIcon(info.file.response.data.image_url);
        }
    };


    return (
        <Content className="site-layout-background">

            <div className="site-card-border-less-wrapper">
                <Card title="Social Media Form"  >
                    <CardHeader className="card-header-part">
                        <h5>Social Media {id ? 'Update' : 'Add'}</h5>
                    </CardHeader>

                    <Form form={form}
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
                            label="Link"
                            name="url_link"
                            id="url_link"
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
                            label="Icon"
                            name="icon"
                            id="icon"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <div>
                                <Upload
                                    listType="picture"
                                    name='files'
                                    action={process.env.REACT_APP_BASE_URL_LOCAL + url.image_upload + '?type=9'}
                                    multiple={false}
                                    maxCount={1}
                                    onChange={onChangeImage}
                                    accept="image/*"
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                                {uploadImage && <Image
                                    className="mt-2"
                                    width={100}
                                    src={uploadImage}
                                    alt=""
                                />}
                            </div>

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

export default PageForm;

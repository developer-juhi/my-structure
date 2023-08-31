import React, { useEffect, useState } from "react";
import { Layout, Form, Input, Upload, Button, Image, Card } from "antd";
import Http from '../../security/Http'
import url from "../../../Development.json";
import {
    errorResponse,
    successResponse,
    validateMessages,
} from "../../helpers/response";
import ButtonSubmitReset from '../layout/ButtonSubmitReset';
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import thumb from '../../../assets/images/thumb.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
    addFireBaseUSer,
} from "../../helpers/fireBase";

const Profile = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [uploadImage, setUploadImage] = useState();
    const [adminProfile, setAdminProfile] = useState(thumb);
    const [id, setId] = useState('');
    const [form] = Form.useForm();
    const { Content } = Layout;

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('profile'))) {
            fetchData(JSON.parse(localStorage.getItem('profile'))._id)
            setId(JSON.parse(localStorage.getItem('profile'))._id)
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const onReset = () => {
        form.resetFields()
        setAdminProfile('')
    }
    const fetchData = async (id) => {
        let idpass = `?id=${id}`;
        await Http
            .get(process.env.REACT_APP_BASE_URL + url.get_profile + idpass)
            .then((response) => {
                let data = response.data.data;
                form.setFieldsValue({
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    mobile_no: data.mobile_no
                });
                setAdminProfile(data.profile_photo);
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error)
                }
            });
    };
    const onSubmit = async (data) => {
        setIsLoading(true);
        await Http
            .post(process.env.REACT_APP_BASE_URL + url.update_profile, data)
            .then(async (response) => {
                let data = response.data.data;

                localStorage.setItem(
                    "profile",
                    JSON.stringify(data)
                );
                await addFireBaseUSer();
                setIsLoading(false);
                navigate('/dashboard');
                successResponse(response);
                window.location.reload()
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
            first_name: values.first_name,
            last_name: values.last_name,
            profile_photo: uploadImage,
            id: id,
            mobile_no: values.mobile_no
        }
        onSubmit(data);
    };

    const onChangeImage = (info) => {
        if (info.file.status === 'done') {
            setUploadImage(info.file.response.data.image_url);
        }
    };

    return (
        <Content className="site-layout-background">

            <div className="page-card-view d-flex justify-content-center">
                <Card title="Profile Form" className='col-md-6 col-xs-12 col-lg-6'>
                    <Form form={form}
                        name="basic"
                        layout="vertical"
                        onFinish={onFinish}
                        validateMessages={validateMessages()}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="First Name"
                            name="first_name"
                            id="first_name"
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 3,
                                    max: 15,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Last Name"
                            name="last_name"
                            id="last_name"
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 3,
                                    max: 15,
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
                                    type: 'email',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Mobile No."
                            name="mobile_no"
                            id="mobile_no"
                            rules={[
                                {
                                    required: true,
                                    type: "string"
                                },
                                {
                                    pattern: new RegExp("^[0-9]*$"),
                                    message: "Mobile No. accept only Number."
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Profile Pic"
                            name="profilePic"
                            id="profilePic"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <Upload
                                listType="picture"
                                name='files'
                                action={process.env.REACT_APP_BASE_URL_LOCAL + url.image_upload + '?type=1'}
                                multiple={false}
                                maxCount={1}
                                onChange={onChangeImage}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>

                            </Upload>
                            {adminProfile && <div className="d-flex">
                                <Image
                                    className="mt-2"
                                    width={100}
                                    src={adminProfile}
                                />
                                <div className='p-1' onClick={() => setAdminProfile('')}>

                                    <FontAwesomeIcon icon={faTrash} color="#0f7dbf" />

                                </div>
                            </div>}
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

export default Profile;

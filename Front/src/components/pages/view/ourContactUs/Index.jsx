import React, { useEffect, useState } from "react";
import { Layout, Form, Input, Row, Col, Card } from "antd";
import ButtonSubmitReset from '../../layout/ButtonSubmitReset';
import Http from '../../../security/Http';
import { errorResponse, successResponse, isJson, validateMessages } from "../../../helpers/response";
import url from "../../../../Development.json";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const Index = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const [address, setAddress] = useState("");
    const [addressAll, setAddressAll] = useState([]);
    const [autoComplete, setAutoComplete] = useState(null);
    //address
    const { Content } = Layout;



    const onAutoCompletePlaceIsChanged = () => {
        if (autoComplete !== null) {
            console.log("auto complete is changed: ", autoComplete.getPlace());
            setAddress(autoComplete.getPlace().formatted_address);
            let addressManage = {
                address: autoComplete.getPlace().formatted_address,
                latitude: autoComplete.getPlace().geometry.location.lat(),
                longitude: autoComplete.getPlace().geometry.location.lng(),
            };

            setAddressAll(addressManage);
            form.setFieldsValue({
                address: autoComplete.getPlace().formatted_address,
                latitude: autoComplete.getPlace().geometry.location.lat(),
                longitude: autoComplete.getPlace().geometry.location.lng(),
            });

        }
        else {
            console.log("Autocomplete is not loaded yet");
        }
    };

    const addressChange = (e) => {
        setAddress(e.target.value);
    };
    const onAutoCompleteIsLoad = (inputAutoComplete) => {
        setAutoComplete(inputAutoComplete);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        await Http
            .get(process.env.REACT_APP_BASE_URL + url.our_contact_us_edit_get)
            .then((response) => {
                let data = response.data.data;
                form.setFieldsValue({
                    contact_no: data.contact_no,
                    email: data.email,
                    admin_email: data.admin_email,
                    website: data.website,
                    address: isJson(data.location) ? JSON.parse(data.location).address : '',
                });

                setAddress(isJson(data.location) ? JSON.parse(data.location).address : '')
                setAddressAll(isJson(data.location) ? JSON.parse(data.location) : '')
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
                process.env.REACT_APP_BASE_URL + url.our_contact_us_store,
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
            email: values.email,
            admin_email: values.admin_email,
            contact_no: values.contact_no,
            website: values.website,
            location: JSON.stringify(addressAll),
        }
        onSubmit(data);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Content className="site-layout-background">

            <div className="site-card-border-less-wrapper center p-5 align-items-center">
                <Card title="Our Contact US Form"  >
                    <Form form={form}
                        name="round-form-fill"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        onFinish={onFinish}
                        validateMessages={validateMessages()}
                        autoComplete="off"
                    >

                        <Row gutter={{
                            xs: 8,
                            sm: 16,
                            md: 24,
                            lg: 32,
                        }}>

                            <Col span={12} md={12} sm={24} xs={24}>

                                <Form.Item
                                    label="Mobile No"
                                    name="contact_no"
                                    id="contact_no"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            pattern: new RegExp("^[0-9]*$"),
                                            message: "Enter Valid Mobile Number."
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12} md={12} sm={24} xs={24}>
                                <Form.Item
                                    label="Website"
                                    name="website"
                                    id="website"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={{
                            xs: 8,
                            sm: 16,
                            md: 24,
                            lg: 32,
                        }}>
                            <Col span={12} md={12} sm={24} xs={24}>

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
                            </Col>
                            <Col span={12} md={12} sm={24} xs={24}>

                                <Form.Item
                                    label="Admin/Management Email"
                                    name="admin_email"
                                    id="admin_email"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'email',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row gutter={{
                            xs: 8,
                            sm: 16,
                            md: 24,
                            lg: 32,
                        }}>
                            <Col span={12} md={12} sm={24} xs={24}>
                                <Form.Item
                                    label="Location"
                                    name="address"
                                    id="address"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'string',
                                            min: 3,
                                            max: 500,
                                        },
                                    ]}
                                >

                                    <LoadScript
                                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_KEY}
                                        libraries={["drawing", "places"]}
                                    >
                                        <Autocomplete
                                            onLoad={onAutoCompleteIsLoad}
                                            onPlaceChanged={onAutoCompletePlaceIsChanged}
                                        >
                                            <Input
                                                value={address}
                                                onChange={(e) => addressChange(e)}
                                            />
                                        </Autocomplete>
                                    </LoadScript>

                                </Form.Item>

                            </Col>

                        </Row>

                        <div className="w-100">
                            <Form.Item
                                className="text-center"

                            >
                                <ButtonSubmitReset isLoading={isLoading} onReset={onReset} />


                            </Form.Item>
                        </div>
                    </Form>
                </Card>
            </div>
        </Content>
    )
};

export default Index;

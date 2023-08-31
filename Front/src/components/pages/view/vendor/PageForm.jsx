import React, { useEffect, useState } from "react";
import { Layout, Form, Input, Upload, Button, Image, Row, Col, DatePicker } from "antd";
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonSubmitReset from '../../layout/ButtonSubmitReset';
import Http from '../../../security/Http';
import { errorResponse, successResponse, validateMessages, isJson } from "../../../helpers/response";
import url from "../../../../Development.json";
import { UploadOutlined } from "@ant-design/icons";
import thumb from '../../../../assets/images/thumb.jpg'
import ImgCrop from 'antd-img-crop';
import { Card, CardHeader } from "reactstrap";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import dayjs from 'dayjs';

const PageForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const [id, setId] = useState('');
    const [uploadImage, setUploadImage] = useState(thumb);
    const { state } = useLocation()
    const { Content } = Layout;

    const [address, setAddress] = useState("");
    const [addressAll, setAddressAll] = useState([]);
    const [autoComplete, setAutoComplete] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState();

    const onChangeImage = async (info) => {
        if (info.file.status === 'done') {
            setUploadImage(info.file.response.data.image_url);
        }
    };

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
            .get(process.env.REACT_APP_BASE_URL + url.user_edit_get + idpass)
            .then((response) => {
                let data = response.data.data;
                form.setFieldsValue({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    user_name: data.user_name,
                    mobile_no: data.mobile_no,
                    email: data.email,
                    date_of_birth_show: dayjs(data.date_of_birth, dateFormat),
                    address: isJson(data.location) ? JSON.parse(data.location).address : '',
                    // location: data.location,
                });
                setDateOfBirth(dayjs(data.date_of_birth, dateFormat));
                setAddress(isJson(data.location) ? JSON.parse(data.location).address : '')
                if (data.profile_photo) {
                    setUploadImage(data.profile_photo)
                }
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
                process.env.REACT_APP_BASE_URL + url.user_store,
                data
            )
            .then((response) => {
                setIsLoading(false);
                successResponse(response);
                navigate('/vendor');
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
            first_name: values.first_name,
            last_name: values.last_name,
            user_name: values.user_name,
            email: values.email,
            mobile_no: values.mobile_no,
            location: JSON.stringify(addressAll),
            profile_photo: uploadImage,
            date_of_birth: dateOfBirth

        }
        onSubmit(data);
    };

    const onReset = () => {
        form.resetFields();
    };


    const onPreview = async (file) => {
        let src = file.url;

        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);

                reader.onload = () => resolve(reader.result);
            });
        }

        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };


    //address




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


    const onChangeDate = (date, dateString) => {
        setDateOfBirth(dateString);
    };
    const dateFormat = 'YYYY/MM/DD';

    return (
        <Content className="site-layout-background">

            <div className="site-card-border-less-wrapper">
                <Card title="Vendor Form" className=''>
                    <CardHeader className="card-header-part">
                        <h5>Vendor {id ? 'Update' : 'Add'}</h5>
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
                            label="First Name"
                            name="first_name"
                            id="first_name"
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
                            label="Last Name"
                            name="last_name"
                            id="last_name"
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
                            label="User Name"
                            name="user_name"
                            id="user_name"
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
                                        // className="form-control"
                                        onChange={(e) => addressChange(e)}
                                    />
                                </Autocomplete>
                            </LoadScript>
                            {/* <Input /> */}
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            id="email"
                            rules={[
                                {
                                    required: true,
                                    type: 'email',
                                    min: 3,
                                    max: 99,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Mobile No"
                            name="mobile_no"
                            id="mobile_no"
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 7,
                                    max: 15,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Date Of Birth"
                            name="date_of_birth_show"
                            id="date_of_birth_show"
                            className="w-100"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <DatePicker
                                onChange={onChangeDate}
                                defaultValue={dayjs(dateOfBirth, 'YYYY-MM-DD')}
                                format={dateFormat}
                                className="w-100"
                                disabledDate={d => !d || d.isAfter("2017-12-31")}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Profile Photo"
                            name="ppf"
                            id="ppf"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >

                            <Row>
                                <Col span={12}>
                                    <ImgCrop>
                                        <Upload
                                            name='files'
                                            action={process.env.REACT_APP_BASE_URL_LOCAL + url.image_upload + '?type=1'}
                                            listType="picture"
                                            onChange={onChangeImage}
                                            onPreview={onPreview}
                                            accept="image/*"
                                        >
                                            <Button
                                                className=""
                                                icon={<UploadOutlined />}>
                                                upload
                                            </Button>

                                        </Upload>
                                    </ImgCrop>
                                </Col>
                                <Col span={24}>
                                    <Image
                                        src={uploadImage}
                                        alt=""
                                        className="rounded-circle mt-2"
                                        height={"150px"}
                                        width={"150px"}
                                    />
                                </Col>
                            </Row>



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

import React, { useEffect, useState, useRef } from "react";
import { Layout, Form, Upload, Button } from "antd";
import { Card } from 'antd';
import ButtonSubmitReset from '../../layout/ButtonSubmitReset';
import Http from '../../../security/Http';
import { errorResponse, successResponse, configEditorInit } from "../../../helpers/response";
import url from "../../../../Development.json";
import { Editor } from "@tinymce/tinymce-react";
import { UploadOutlined } from "@ant-design/icons";

const Index = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const { Content } = Layout;

    const editorRef = useRef(null);

    const [aboutUs, setAboutUs] = useState('<p>Hello <strong>Abc &nbsp;</strong></p>');
    const [whoWeAre, setWhoWeAre] = useState('<p>Hello <strong>Abc &nbsp;</strong></p>');
    const [termsCondition, setTermsCondition] = useState('<p>Hello <strong>Abc &nbsp;</strong></p>');
    const [privacyPolicy, setPrivacyPolicy] = useState('<p>Hello <strong>Abc &nbsp;</strong></p>');
    const [ourServices, setOurServices] = useState('<p>Hello <strong>Abc &nbsp;</strong></p>');
    const [vision, setVision] = useState('<p>Hello <strong>Abc &nbsp;</strong></p>');
    const [mission, setMission] = useState('<p>Hello <strong>Abc &nbsp;</strong></p>');
    const [brochure, setBrochure] = useState();

    const handleEditorChangeBrochure = (info) => {
        if (info.file.status === 'done') {
            setBrochure(info.file.response.data.url);
            form.setFieldsValue({
                brochure: info.file.response.data.url,
            });
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        await Http
            .get(process.env.REACT_APP_BASE_URL + url.cms_edit_get)
            .then((response) => {
                let data = response.data.data;
                setAboutUs(data.about_us)
                setWhoWeAre(data.who_we_are)
                setTermsCondition(data.terms_condition)
                setPrivacyPolicy(data.privacy_policy)
                setOurServices(data.our_services)
                setBrochure(data.brochure)
                // setVision(data.vision)
                // setMission(data.mission)
                form.setFieldsValue({
                    about_us: data.about_us,
                    who_we_are: data.who_we_are,
                    terms_condition: data.terms_condition,
                    privacy_policy: data.privacy_policy,
                    our_services: data.our_services,
                    brochure:data.brochure
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
                process.env.REACT_APP_BASE_URL + url.cms_store,
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
            about_us: aboutUs,
            who_we_are: whoWeAre,
            terms_condition: termsCondition,
            privacy_policy: privacyPolicy,
            our_services: ourServices,
            brochure: brochure,
            vision: vision,
            mission: mission,
        }
        onSubmit(data);
    };

    const onReset = () => {
        form.resetFields();
    };

    return (
        <Content className="site-layout-background">

            <div className="site-card-border-less-wrapper center p-5 align-items-center">
                <Card title="Cms Form"  >
                    <Form form={form}
                        name="Cms"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >

                        <Form.Item
                            label="Our Services"
                            name="our_services"
                            id="our_services"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your our services !`,
                                },
                            ]}
                        >

                            <Editor
                                apiKey={process.env.REACT_APP_TINYMAC_KEY}
                                value={ourServices}
                                onEditorChange={(value) => {
                                    setOurServices(value)
                                    form.setFieldsValue({
                                        our_services: value,
                                    });
                                }}
                                onInit={(evt, editor) => editorRef.current = editor}
                                init={configEditorInit()}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Privacy Policy"
                            name="privacy_policy"
                            id="privacy_policy"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your Privacy Policy !`,
                                },
                            ]}
                        >

                            <Editor
                                apiKey={process.env.REACT_APP_TINYMAC_KEY}
                                value={ourServices}
                                onEditorChange={(value) => {
                                    setPrivacyPolicy(value)
                                    form.setFieldsValue({
                                        privacy_policy: value,
                                    });
                                }}
                                onInit={(evt, editor) => editorRef.current = editor}
                                init={configEditorInit()}
                            />
                        </Form.Item>
                        <Form.Item
                            label="About Us"
                            name="about_us"
                            id="about_us"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your About Us !`,
                                },
                            ]}
                        >

                            <Editor
                                apiKey={process.env.REACT_APP_TINYMAC_KEY}
                                value={ourServices}
                                onEditorChange={(value) => {
                                    setAboutUs(value)
                                    form.setFieldsValue({
                                        about_us: value,
                                    });
                                }}
                                onInit={(evt, editor) => editorRef.current = editor}
                                init={configEditorInit()}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Who We Are"
                            name="who_we_are"
                            id="who_we_are"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your Who We Are !`,
                                },
                            ]}
                        >

                            <Editor
                                apiKey={process.env.REACT_APP_TINYMAC_KEY}
                                value={ourServices}
                                onEditorChange={(value) => {
                                    setWhoWeAre(value)
                                    form.setFieldsValue({
                                        who_we_are: value,
                                    });
                                }}
                                onInit={(evt, editor) => editorRef.current = editor}
                                init={configEditorInit()}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Terms Condition"
                            name="terms_condition"
                            id="terms_condition"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your Terms Condition !`,
                                },
                            ]}
                        >

                            <Editor
                                apiKey={process.env.REACT_APP_TINYMAC_KEY}
                                value={ourServices}
                                onEditorChange={(value) => {
                                    setTermsCondition(value)
                                    form.setFieldsValue({
                                        terms_condition: value,
                                    })
                                }}
                                onInit={(evt, editor) => editorRef.current = editor}
                                init={configEditorInit()}
                            />
                        </Form.Item>



                        {/* <Form.Item
                            label="Vision"
                            name="vision"
                            id="vision"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your Vision !`,
                                },
                            ]}
                        >
                            <Editor
                                apiKey={process.env.REACT_APP_TINYMAC_KEY}
                                value={vision}
                                onEditorChange={(value) => setVision(value)}
                                onInit={(evt, editor) => editorRef.current = editor}
                                init={configEditorInit()}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mission"
                            name="mission-store"
                            id="mission-store"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your Mission !`,
                                },
                            ]}
                        >
                            <Editor
                                apiKey={process.env.REACT_APP_TINYMAC_KEY}
                                onEditorChange={(value) => setMission(value)}
                                // value={mission}
                                onInit={(evt, editor) => editorRef.current = editor}
                                init={configEditorInit()}
                            />
                        </Form.Item> */}

                        <Form.Item
                            label="Brochure"
                            name="brochure"
                            id="brochure"
                            rules={[
                                {
                                    required: true,
                                    message: `Please input your Brochure !`,
                                },
                            ]}
                        >

                            <Upload
                                listType="picture"
                                name='files'
                                action={process.env.REACT_APP_BASE_URL_LOCAL + url.upload_file + '?type=1'}
                                multiple={false}
                                maxCount={1}
                                onChange={handleEditorChangeBrochure}
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>

                            </Upload>

                            {brochure}
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

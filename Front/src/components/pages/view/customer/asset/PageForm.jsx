import React, { useEffect, useState } from "react";
import { Form, Input, Layout, Select, DatePicker, Rate, Button, Upload, Image,Badge } from "antd";
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader } from "reactstrap";
import ButtonSubmitReset from "../../../layout/ButtonSubmitReset";
import { errorResponse, successResponse, validateMessages, rating5Color, rating9Color, alertMessage } from "../../../../helpers/response";
import url from '../../../../../Development.json';
import Http from '../../../../security/Http';
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import Rating from '../../../layout/Rating';
import { FaDownload } from "react-icons/fa";


const PageForm = () => {
    const badgeColor = '#00C4E6'

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const [id, setId] = useState('');
    const { state } = useLocation()
    const { Content } = Layout;
    const { Option } = Select;

    const [categoryList, setcategoryList] = useState([])
    const [usesList, setUsesList] = useState([])
    const [structureTypeData, setStructureTypeData] = useState([])
    const [facadeTypeData, setFacadeTypeData] = useState([])

    //field state
    const [category, setCategory] = useState('')
    const [assetUses, setAssetUses] = useState('')
    const [structuralType, setStructuralType] = useState('')
    const [FacadeType, setFacadeType] = useState('')
    const [buildYear, setBuildYear] = useState('')
    //end

    const [rating, setRating] = useState(0)
    const [structuralRating, setStructuralRating] = useState(0)
    const [cleanlinessRating, setCleanlinessRating] = useState(0)
    const [fitoutRating, setFitoutRating] = useState(0)

    const [floorsRating, setFloorsRating] = useState(0)
    const [doorsRating, setDoorsRating] = useState(0)
    const [windowsRating, setWindowsRating] = useState(0)
    const [wallPartitioningRating, setwallPartitioningRating] = useState(0)
    const [secondaryCeilingRating, setSecondaryCeilingRating] = useState(0)
    const [coatingRating, setCoatingRating] = useState(0)
    const [metalRating, setMetalRating] = useState(0)
    const [tileCladdingRating, setTileCladdingRating] = useState(0)
    const [glassCladdingRating, setGlassCladdingRating] = useState(0)
    const [woodenCladdingRating, setWoodenCladdingRating] = useState(0)
    const [railingConditionRating, setRailingConditionRating] = useState(0)
    const [roofingConditionRating, setRoofingConditionRating] = useState(0)
    const [fenceConditionRating, setFenceConditionRating] = useState(0)
    const [gateConditionRating, setGateConditionRating] = useState(0)
    const [sanitaryConditionRating, setSanitaryConditionRating] = useState(0)
    const [pumpingConditionRating, setPumpingConditionRating] = useState(0)
    const [acConditionRating, setAcConditionRating] = useState(0)
    const [electricalConditionRating, setElectricalConditionRating] = useState(0)
    const [liftConditionRating, setLiftConditionRating] = useState(0)
    const [externalAreasConditionRating, setExternalAreasConditionRating] = useState(0)
    const [gardeningConditionRating, setGardeningConditionRating] = useState(0)
    const [hardLandscapeConditionRating, setHardLandscapeConditionRating] = useState(0)
    const [escalatorConditionRating, setEscalatorConditionRating] = useState(0)
    const [uploadImage, setUploadImage] = useState([])
    const [userId, setuserId] = useState()


    useEffect(() => {
        if (state && state.id) {
            fetchData(state.id)
            setId(state.id);
        }
        if (state && state.user_id) {
            setuserId(state.user_id)
        }

        fetchCategoryData();
        fetchUsesData();
        fetchStructureTypeData();
        fetchFacadeTypeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let errorMessageShown = false
    const beforeUpload = (file, fileList) => {
        let uploadImageLength = uploadImage.length
        const totalFiles = uploadImageLength + fileList.length
        // add one to account for the current file being uploaded
        if (totalFiles > 10 && !errorMessageShown) {
            errorMessageShown = true
            alertMessage(`You can only upload photos ${10} images${10 > 1 ? 's' : ''}!`);
            throw new Error(`You can only upload photos ${10} images${10 > 1 ? 's' : ''}!`);
        }
        return true;
    };


    const fetchCategoryData = async () => {
        await Http
            .get(process.env.REACT_APP_BASE_URL_LOCAL + url.active_assets_category_get)
            .then((response) => {
                let data = response.data.data;
                setcategoryList(data)
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    }

    const fetchUsesData = async () => {
        await Http
            .get(process.env.REACT_APP_BASE_URL_LOCAL + url.active_assets_uses_get)
            .then((response) => {
                let data = response.data.data;
                setUsesList(data);
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    }

    const fetchStructureTypeData = async () => {
        await Http
            .get(process.env.REACT_APP_BASE_URL_LOCAL + url.active_assets_structure_type_get)
            .then((response) => {
                let data = response.data.data;
                setStructureTypeData(data)
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    }

    const fetchFacadeTypeData = async () => {
        await Http
            .get(process.env.REACT_APP_BASE_URL_LOCAL + url.active_assets_facade_type_data_get)
            .then((response) => {
                let data = response.data.data;
                console.log('faced',data)
                setFacadeTypeData(data)
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    }


    const fetchData = (id) => {
        let idpass = `?id=${id}`;
        Http
            .get(process.env.REACT_APP_BASE_URL + url.user_asset_edit_get + idpass)
            .then((response) => {
                let data = response.data.data;
                console.log('tesss',data)
                const buildDate = `${data?.year_built}-01-01`
                form.setFieldsValue({
                    // title: data.title,
                    description: data.description,
                    yearBuilt: dayjs(buildDate),
                    grossArea: data.gross_area,
                    buildArea: data.build_area,
                    buildCost: data.build_cost,
                    currentValue: data.current_value,
                    currentIssues: data.current_issues,
                    previousIssues: data.Previous_issue,
                    category: data.category_id,
                    assetUsesId: data.asset_uses_id,
                    assetStructuralType: data.structural_type_id,
                    FacadeType: data.facade_type_data_id,
                    generalAssets: parseInt(data.general_rating),
                    structuralRating: parseInt(data.structural_rating),
                    cleanlinessRating: parseInt(data.cleanliness_rating),
                    fitoutRating: parseInt(data.fitout_rating),
                    floorsRating: parseInt(data.floors_rating),
                    doorsRating: parseInt(data.doors_rating),
                    windowsRating: parseInt(data.windows_rating),
                    wallPartitioningRating: parseInt(data.wall_partitionin_rating),
                    secondaryCeilingRating: parseInt(data.secondary_ceiling_rating),
                    coatingRating: parseInt(data.coating_rating),
                    metalRating: parseInt(data.metal_rating),
                    tileCladdingRating: parseInt(data.tile_cladding_rating),
                    glassCladdingRating: parseInt(data.glass_cladding_rating),
                    woodenCladdingRating: parseInt(data.wooden_cladding_rating),
                    railingConditionRating: parseInt(data.railing_condition_rating),
                    roofingConditionRating: parseInt(data.roofing_condition_rating),
                    fenceConditionRating: parseInt(data.fence_condition_rating),
                    gateConditionRating: parseInt(data.gate_condition_rating),
                    sanitaryConditionRating: parseInt(data.sanitary_condition_rating),
                    pumpingConditionRating: parseInt(data.pumping_condition_rating),
                    acConditionRating: parseInt(data.ac_condition_rating),
                    electricalConditionRating: parseInt(data.electrical_condition_rating),
                    liftConditionRating: parseInt(data.lift_condition_rating),
                    externalAreasConditionRating: parseInt(data.external_areas_condition_rating),
                    gardeningConditionRating: parseInt(data.gardening_condition_rating),
                    hardLandscapeConditionRating: parseInt(data.hard_landscape_condition_rating),
                    escalatorConditionRating: parseInt(data.escalator_condition_rating),
                    photo: data.photo,
                    notes: data.notes,
                    estimated_maintenance_costs: data.estimated_maintenance_costs,
                    facade_type: data.facade_type_data_id,
                });
                setuserId(data.user_id)
                setCategory(data.category_id)
                setAssetUses(data.asset_uses_id)
                setStructuralType(data.structural_type_id)
                setFacadeType(data.facade_type_data_id)
                setBuildYear(data.year_built)

                setRating(parseInt(data.general_rating))
                setStructuralRating(parseInt(data.structural_rating))
                setCleanlinessRating(parseInt(data.cleanliness_rating))
                setFitoutRating(parseInt(data.fitout_rating))
                setFloorsRating(parseInt(data.floors_rating))
                setDoorsRating(parseInt(data.doors_rating))
                setWindowsRating(parseInt(data.windows_rating))
                setwallPartitioningRating(parseInt(data.wall_partitionin_rating))
                setSecondaryCeilingRating(parseInt(data.secondary_ceiling_rating))
                setCoatingRating(parseInt(data.coating_rating))
                setMetalRating(parseInt(data.metal_rating))
                setTileCladdingRating(parseInt(data.tile_cladding_rating))
                setGlassCladdingRating(parseInt(data.glass_cladding_rating))
                setWoodenCladdingRating(parseInt(data.wooden_cladding_rating))
                setRailingConditionRating(parseInt(data.railing_condition_rating))
                setRoofingConditionRating(parseInt(data.roofing_condition_rating))
                setFenceConditionRating(parseInt(data.fence_condition_rating))
                setGateConditionRating(parseInt(data.gate_condition_rating))

                setSanitaryConditionRating(parseInt(data.sanitary_condition_rating))
                setPumpingConditionRating(parseInt(data.pumping_condition_rating))
                setAcConditionRating(parseInt(data.ac_condition_rating))
                setElectricalConditionRating(parseInt(data.electrical_condition_rating))
                setLiftConditionRating(parseInt(data.lift_condition_rating))
                setExternalAreasConditionRating(parseInt(data.external_areas_condition_rating))
                setGardeningConditionRating(parseInt(data.gardening_condition_rating))

                setHardLandscapeConditionRating(parseInt(data.hard_landscape_condition_rating))
                setEscalatorConditionRating(parseInt(data.escalator_condition_rating))
                // setUploadImage(data.photo)
                const imageData = data.assetImageData ? data?.assetImageData.map((v, i) => {
                    return v.image
                }) : []

                setUploadImage(imageData)

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
                process.env.REACT_APP_BASE_URL + url.user_asset_store,
                data
            )
            .then((response) => {
                setIsLoading(false);
                successResponse(response);
                if (state.user_id && state.user_name) {
                    navigate('/asset', { state: { user_id: state.user_id, user_name: state.user_name } })
                } else {
                    navigate('/asset');
                }

            })
            .catch((error) => {
                setIsLoading(false);
                if (error.response) {
                    errorResponse(error);
                }
            });
    };

    const onFinish = (value) => {
        const data = {
            title: value.title,
            category_id: category,
            asset_uses_id: assetUses,
            structural_type_id: structuralType,
            facade_type_data_id: FacadeType,
            description: value.description,
            year_built: buildYear,
            gross_area: value.grossArea,
            build_area: value.buildArea,
            build_cost: value.buildCost,
            current_value: value.currentValue,
            current_issues: value.currentIssues,
            Previous_issue: value.previousIssues,
            general_rating: rating,
            structural_rating: structuralRating,
            cleanliness_rating: cleanlinessRating,
            fitout_rating: fitoutRating,
            floors_rating: floorsRating,
            doors_rating: doorsRating,
            windows_rating: windowsRating,
            wall_partitionin_rating: wallPartitioningRating,
            secondary_ceiling_rating: secondaryCeilingRating,
            coating_rating: coatingRating,
            metal_rating: metalRating,
            tile_cladding_rating: tileCladdingRating,
            glass_cladding_rating: glassCladdingRating,
            wooden_cladding_rating: woodenCladdingRating,
            railing_condition_rating: railingConditionRating,
            roofing_condition_rating: roofingConditionRating,
            fence_condition_rating: fenceConditionRating,
            gate_condition_rating: gateConditionRating,
            sanitary_condition_rating: sanitaryConditionRating,
            pumping_condition_rating: pumpingConditionRating,
            ac_condition_rating: acConditionRating,
            electrical_condition_rating: electricalConditionRating,
            lift_condition_rating: liftConditionRating,
            external_areas_condition_rating: externalAreasConditionRating,
            gardening_condition_rating: gardeningConditionRating,
            hard_landscape_condition_rating: hardLandscapeConditionRating,
            escalator_condition_rating: escalatorConditionRating,
            photo: uploadImage,
            notes: value.notes,
            user_id: userId,
            estimated_maintenance_costs: value.estimated_maintenance_costs

        }
        onSubmit(data);
    };

    const onReset = () => {
        form.resetFields();
    };


    const handleCategoryChange = (value) => {
        setCategory(value);
        form.setFieldsValue({
            category: value,
        });
    };

    const handleAssetsUsesChange = (value) => {
        setAssetUses(value)
        form.setFieldsValue({
            assetUsesId: value,
        });
    }

    const handleAssetStructuralTypeChange = (value) => {
        setStructuralType(value)
        form.setFieldsValue({
            assetStructuralType: value,
        });
    }

    const handleFacadeTypeChange = (value) => {
        setFacadeType(value)
        form.setFieldsValue({
            facade_type: value,
        });
    }

    const onChange = (date, dateString) => {
        setBuildYear(dateString)
    };

    const onChangeImage = async (info) => {
        if (info.file.status === 'done') {
            setUploadImage([...uploadImage, info.file.response.data.url]);
            form.setFieldsValue({ photo: '1' })
        }
        if (info.file.status === 'removed') {
            var array = [...uploadImage];
            var index = array.indexOf(info.file.response.data.url)
            if (index !== -1) {
                array.splice(index, 1);
                setUploadImage(array)
                form.setFieldsValue({ photo: array.length > 0 ? '1' : '' })
            }
        }
    };

    const toolTip = ['FAILED', 'CRITICAL', 'VERY POOR', 'POOR', 'AVERAGE', 'GOOD', 'VERY GOOD', 'EXCELLENT', 'NEW']

    const toolTip5 = ['Critical/Failed', 'Poor', 'Average', 'Good', 'New/Excellent']


    return (
        <Content className="site-layout-background">
            <div className="site-card-border-less-wrapper">
                <Card title="User Asset Form"  >
                    <CardHeader className="card-header-part">
                        <h5>User Asset {id ? 'Update' : 'Add'}</h5>
                    </CardHeader>

                    <Form form={form}
                        name="basic"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        labelWrap={true}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        validateMessages={validateMessages()}
                        autoComplete="off"
                        className="m-5"
                    >

                        <Form.Item
                            label="Category"
                            name="category"
                            id="category"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                value={category}
                                onChange={(e) => handleCategoryChange(e)}
                            >
                                <Option selected disabled> Select </Option>
                                {
                                    categoryList.length > 0 && categoryList.map((item, i) => {
                                        return <Option key={i} value={item._id}> {` ${item.name}  `}</Option>;
                                    })
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Asset Uses"
                            name="assetUsesId"
                            id="assetUsesId"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                value={assetUses}
                                onChange={(e) => handleAssetsUsesChange(e)}
                            >
                                <Option selected disabled> Select </Option>
                                {
                                    usesList.length > 0 && usesList.map((item, i) => {
                                        return <Option key={i} value={item._id}> {` ${item.name}  `}</Option>;
                                    })
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Asset Structural Type"
                            name="assetStructuralType"
                            id="assetStructuralType"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                value={structuralType}
                                onChange={(e) => handleAssetStructuralTypeChange(e)}
                            >
                                <Option selected disabled> Select </Option>
                                {
                                    structureTypeData.length > 0 && structureTypeData.map((item, i) => {
                                        return <Option key={i} value={item._id}> {` ${item.name}  `}</Option>;
                                    })
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Facade Type"
                            name="facade_type"
                            id="facade_type"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                value={FacadeType}
                                onChange={(e) => handleFacadeTypeChange(e)}
                            >
                                <Option selected disabled> Select </Option>
                                {
                                    facadeTypeData.length > 0 && facadeTypeData.map((item, i) => {
                                        return <Option key={i} value={item._id}> {` ${item.name}  `}</Option>;
                                    })
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Asset Description"
                            name="description"
                            id="description"
                            rules={[
                                {
                                    required: true,
                                    type: 'string'
                                },
                                // {
                                //     pattern: new RegExp("^[A-Za-z0-9\. ]*$"),
                                //     message: "Asset Description not accepted any Special Characters"
                                // }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Year Built"
                            name="yearBuilt"
                            id="yearBuilt"

                            rules={[
                                {
                                    required: true,

                                },
                            ]}

                        >
                            <DatePicker size={20} onChange={onChange} format={'YYYY'} picker="year" />
                            {/* <Input /> */}
                        </Form.Item>


                        <Form.Item
                            label="Gross Area (sq. m)"
                            name="grossArea"
                            id="grossArea"

                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 1,
                                    max: 999,
                                },
                                // {
                                //     pattern: new RegExp("^[A-Za-z0-9\. ]*$"),
                                //     message: "Gross Area not accepted any Special Characters"
                                // }
                            ]}

                        >
                            <Input />
                        </Form.Item>



                        <Form.Item
                            label="Build Area (sq. m)"
                            name="buildArea"
                            id="buildArea"

                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 1,
                                    max: 999,
                                },
                                // {
                                //     pattern: new RegExp("^[A-Za-z0-9\. ]*$"),
                                //     message: "Build Area not accepted any Special Characters"
                                // }
                            ]}

                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Build/Acquisition Cost"
                            name="buildCost"
                            id="buildCost"

                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 1,
                                    max: 99999,
                                },
                                // {
                                //     pattern: new RegExp("^[A-Za-z0-9\. ]*$"),
                                //     message: "Build/Acquisition Cost not accepted any Special Characters"
                                // }
                            ]}

                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Estimated Maintenance Costs"
                            name="estimated_maintenance_costs"
                            id="estimated_maintenance_costs"

                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 1,
                                    max: 99,
                                },
                                // {
                                //     pattern: new RegExp("^[A-Za-z0-9\. ]*$"),
                                //     message: "Estimated Maintenance Costs not accepted any Special Characters"
                                // }
                            ]}

                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Current Value (as of today)"
                            name="currentValue"
                            id="currentValue"

                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 1,
                                    max: 99999,
                                },
                                // {
                                //     pattern: new RegExp("^[A-Za-z0-9\. ]*$"),
                                //     message: "Current Value (as of today) not accepted any Special Characters"
                                // }
                            ]}

                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Current Issues/Concerns/Observation,Risks "
                            name="currentIssues"
                            id="currentIssues"

                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 3,
                                    max: 999,
                                },
                                // {
                                //     pattern: new RegExp("^[A-Za-z0-9\. ]*$"),
                                //     message: "Current Issues/Concerns/Observation,Risks not accepted any Special Characters"
                                // }
                            ]}

                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Previous Issues reported and fixed"
                            name="previousIssues"
                            id="previousIssues"

                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 3,
                                    max: 999,
                                },
                                // {
                                //     pattern: new RegExp("^[A-Za-z0-9\. ]*$"),
                                //     message: "Previous Issues reported and fixed not accepted any Special Characters"
                                // }
                            ]}

                        >
                            <Input />
                        </Form.Item>


                        <Form.Item
                            label="General Asset Condition Rating"
                            name="generalAssets"
                            id="generalAssets"
                        >

                            <div className="d-flex justify-content-between">
                                <Rate count={9} value={rating} onChange={(e) => { setRating(e) }} tooltips={toolTip} style={{ color: rating9Color(rating) }} />
                                {rating === 0 && <Badge.Ribbon text={rating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Structural Condition Rating "
                            name="structuralRating"
                            id="structuralRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={structuralRating} onChange={(e) => { setStructuralRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(structuralRating) }} />
                                {structuralRating === 0 && <Badge.Ribbon text={structuralRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="General Fit out/Decoration/Finishing Condition Rating "
                            name="fitoutRating"
                            id="fitoutRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={fitoutRating} onChange={(e) => { setFitoutRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(fitoutRating) }} />
                                {fitoutRating === 0 && <Badge.Ribbon text={fitoutRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Cleanliness Condition Rating"
                            name="cleanlinessRating"
                            id="cleanlinessRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={cleanlinessRating} onChange={(e) => { setCleanlinessRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(cleanlinessRating) }} />
                                {cleanlinessRating === 0 && <Badge.Ribbon text={cleanlinessRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>
                        {/* Asset System Condition Rating  */}

                        <Form.Item
                            label="Floors Condition Rating "
                            name="floorsRating"
                            id="floorsRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={floorsRating} onChange={(e) => { setFloorsRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(floorsRating) }} />
                                {floorsRating === 0 && <Badge.Ribbon text={floorsRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Doors  Condition Rating "
                            name="doorsRating"
                            id="doorsRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={doorsRating} onChange={(e) => { setDoorsRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(doorsRating) }} />
                                {doorsRating === 0 && <Badge.Ribbon text={doorsRating === 0 ? 'N/A' : ''} color={badgeColor} />
                                }                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Windows Condition Rating "
                            name="windowsRating"
                            id="windowsRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={windowsRating} onChange={(e) => { setWindowsRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(windowsRating) }} />
                                {windowsRating === 0 && <Badge.Ribbon text={windowsRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Wall Partitioning Condition Rating  "
                            name="wallPartitioningRating"
                            id="wallPartitioningRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={wallPartitioningRating} onChange={(e) => { setwallPartitioningRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(wallPartitioningRating) }} />
                                {wallPartitioningRating === 0 && <Badge.Ribbon text={wallPartitioningRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Secondary/False Ceiling Condition Rating "
                            name="secondaryCeilingRating"
                            id="secondaryCeilingRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={secondaryCeilingRating} onChange={(e) => { setSecondaryCeilingRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(secondaryCeilingRating) }} />
                                {secondaryCeilingRating === 0 && <Badge.Ribbon text={secondaryCeilingRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Coating/Paint Condition Rating "
                            name="coatingRating"
                            id="coatingRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={coatingRating} onChange={(e) => { setCoatingRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(coatingRating) }} />
                                {coatingRating === 0 && <Badge.Ribbon text={coatingRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Metal  Condition Rating "
                            name="metalRating"
                            id="metalRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={metalRating} onChange={(e) => { setMetalRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(metalRating) }} />
                                {metalRating === 0 && <Badge.Ribbon text={metalRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Tile Cladding Condition Rating "
                            name="tileCladdingRating"
                            id="tileCladdingRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={tileCladdingRating} onChange={(e) => { setTileCladdingRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(tileCladdingRating) }} />
                                {tileCladdingRating === 0 && <Badge.Ribbon text={tileCladdingRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Glass Cladding Condition Rating "
                            name="glassCladdingRating"
                            id="glassCladdingRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={glassCladdingRating} onChange={(e) => { setGlassCladdingRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(glassCladdingRating) }} />
                                {glassCladdingRating === 0 && <Badge.Ribbon text={glassCladdingRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Wooden Cladding Condition Rating "
                            name="woodenCladdingRating"
                            id="woodenCladdingRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={woodenCladdingRating} onChange={(e) => { setWoodenCladdingRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(woodenCladdingRating) }} />
                                {woodenCladdingRating === 0 && <Badge.Ribbon text={woodenCladdingRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Railing/Handrail/Balustrade Condition Rating "
                            name="railingConditionRating"
                            id="railingConditionRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={railingConditionRating} onChange={(e) => { setRailingConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(railingConditionRating) }} />
                                {railingConditionRating === 0 && <Badge.Ribbon text={railingConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Roofing  Condition Rating "
                            name="roofingConditionRating"
                            id="roofingConditionRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={roofingConditionRating} onChange={(e) => { setRoofingConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(roofingConditionRating) }} />
                                {roofingConditionRating === 0 && <Badge.Ribbon text={roofingConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Fence Condition Rating "
                            name="fenceConditionRating"
                            id="fenceConditionRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={fenceConditionRating} onChange={(e) => { setFenceConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(fenceConditionRating) }} />
                                {fenceConditionRating === 0 && <Badge.Ribbon text={fenceConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Gate Condition Rating "
                            name="gateConditionRating"
                            id="gateConditionRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={gateConditionRating} onChange={(e) => { setGateConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(gateConditionRating) }} />
                                {gateConditionRating === 0 && <Badge.Ribbon text={gateConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Sanitary Accessories/Bath Rooms Condition Rating "
                            name="sanitaryConditionRating"
                            id="sanitaryConditionRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={sanitaryConditionRating} onChange={(e) => { setSanitaryConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(sanitaryConditionRating) }} />
                                {sanitaryConditionRating === 0 && <Badge.Ribbon text={sanitaryConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Pumping/Drainage System Condition Rating "
                            name="pumpingConditionRating"
                            id="pumpingConditionRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={pumpingConditionRating} onChange={(e) => { setPumpingConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(pumpingConditionRating) }} />
                                {pumpingConditionRating === 0 && <Badge.Ribbon text={pumpingConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="A/C System  Condition Rating "
                            name="acConditionRating"
                            id="acConditionRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={acConditionRating} onChange={(e) => { setAcConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(acConditionRating) }} />
                                {acConditionRating === 0 && <Badge.Ribbon text={acConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Electrical Systems/Lighting Condition Rating "
                            name="electricalConditionRating"
                            id="electricalConditionRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={electricalConditionRating} onChange={(e) => { setElectricalConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(electricalConditionRating) }} />
                                {electricalConditionRating === 0 && <Badge.Ribbon text={electricalConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Lift Condition Rating "
                            name="liftConditionRating"
                            id="liftConditionRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={liftConditionRating} onChange={(e) => { setLiftConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(liftConditionRating) }} />
                                {liftConditionRating === 0 && <Badge.Ribbon text={liftConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="External Areas/Pavement Condition Rating "
                            name="externalAreasConditionRating"
                            id="externalAreasConditionRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={externalAreasConditionRating} onChange={(e) => { setExternalAreasConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(externalAreasConditionRating) }} />
                                {externalAreasConditionRating === 0 && <Badge.Ribbon text={externalAreasConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Gardening/Soft Landscape Condition Rating "
                            name="gardeningConditionRating"
                            id="gardeningConditionRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={gardeningConditionRating} onChange={(e) => { setGardeningConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(gardeningConditionRating) }} />
                                {gardeningConditionRating === 0 && <Badge.Ribbon text={gardeningConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Hard Landscape Condition Rating "
                            name="hardLandscapeConditionRating"
                            id="hardLandscapeConditionRating"
                        >
                            <div className="d-flex justify-content-between">
                                <Rate count={5} value={hardLandscapeConditionRating} onChange={(e) => { setHardLandscapeConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(hardLandscapeConditionRating) }} />
                                {hardLandscapeConditionRating === 0 && <Badge.Ribbon text={hardLandscapeConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Escalator/Travellator Condition Rating "
                            name="escalatorConditionRating"
                            id="escalatorConditionRating"
                        >
                             <div className="d-flex justify-content-between">
                             <Rate count={5} value={escalatorConditionRating} onChange={(e) => { setEscalatorConditionRating(e) }} tooltips={toolTip5} style={{ color: rating5Color(escalatorConditionRating) }} />
                                {escalatorConditionRating === 0 && <Badge.Ribbon text={escalatorConditionRating === 0 ? 'N/A' : ''} color={badgeColor} />}
                            </div>
                        </Form.Item>

                        <Form.Item
                            label="Notes"
                            name="notes"
                            id="notes"
                            rules={[
                                {
                                    required: true,
                                    type: 'string',
                                    min: 3,
                                    max: 99,
                                },
                                // {
                                //     pattern: new RegExp("^[A-Za-z0-9\. ]*$"),
                                //     message: "Notes not accepted any Special Characters"
                                // }
                            ]}
                        >
                            <Input.TextArea showCount maxLength={100} />

                        </Form.Item>


                        <Form.Item
                            label="Photo/File"
                            name="photo"
                            id="photo"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Upload
                                listType="picture"
                                name='files'
                                action={process.env.REACT_APP_BASE_URL_LOCAL + url.upload_file + '?type=10'}
                                multiple={true}
                                maxCount={10}
                                onChange={onChangeImage}
                                beforeUpload={beforeUpload}
                                accept="image/*,application/pdf,application/vnd.ms-excel"

                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>

                            </Upload>
                            <div className="d-flex flex-wrap">
                                {uploadImage.length > 0 && uploadImage.map((v, i) => {
                                    const extension = v.split('.').pop();
                                    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg' || extension === 'gif') {
                                        return (
                                            <div className="d-flex me-2">
                                                <Image key={i}
                                                    className="mt-2"
                                                    width={100}
                                                    src={v}
                                                />
                                                <div className='p-1'>
                                                    <a href={v} download>
                                                        <FaDownload color="#0f7dbf" />
                                                    </a>
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        // Render the file here
                                        return (
                                            <a href={v} download className="btn btn-warning a-remove-text-decoration me-2 mt-2 d-flex align-items-center" >
                                                Download File
                                            </a>
                                        )
                                    }
                                })}
                            </div>
                        </Form.Item>


                        <Form.Item
                            className="text-center"
                        >
                            <Form.Item >
                                <Button type="primary" className='my-submit-button' htmlType="submit" loading={isLoading}>
                                    {id ? 'Update' : 'Create'}
                                </Button>
                                <Button htmlType="button" className='my-reset-button' onClick={onReset}>
                                    Reset
                                </Button>
                                <Button htmlType="button" className='my-reset-button' onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                            </Form.Item>
                        </Form.Item>
                    </Form>
                    <Rating />
                </Card>
            </div>

        </Content>
    )
};

export default PageForm;

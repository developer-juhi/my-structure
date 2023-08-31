import React, { useState, useEffect, Fragment } from 'react';
import { Card, CardBody, CardHeader, Table as TableModal } from "reactstrap";
import { Table, Modal, Layout, Button, Tooltip, Rate, Image } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { faPencilAlt, faTrashAlt, faEye, faToggleOff, faToggleOn, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Http from '../../../../security/Http';
import { errorResponse, successResponse, rating5Color, rating9Color } from "../../../../helpers/response";
import url from "../../../../../Development.json";
import { FaDownload } from "react-icons/fa";


const Index = () => {
    const [dataTableData, setDataTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [filterText, setFilterText] = useState('');
    const [visible, setVisible] = useState(false);
    const [viewModalText, setviewModalText] = useState();
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [pageNo, setPageNo] = useState(1);

    const navigate = useNavigate();
    const { Content } = Layout;
    let currentFilterText = '';

    const { state } = useLocation()

    //  Start here crud related function





    useEffect(() => {
        if (state && state.user_id) {
            setUserId(state.user_id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    useEffect(() => {
        if (!state) {
            getData();
        }

    }, [])

    useEffect(() => {
        if (userId) {
            getData();

        }
    }, [userId])




    const getData = async (page = pageNo, perPage = 10, sortField = 'createdAt', sortDirection = 'desc') => {
        setDataTableData([]);
        setTotalRows(0);
        let options = `?page=${page}&per_page=${perPage}&delay=1&sort_direction=${sortDirection}&sort_field=${sortField}&search=${currentFilterText}`;
        if (userId) {
            options = options + `&user_id=${userId}`;
        }
        await Http.get(process.env.REACT_APP_BASE_URL + url.user_asset_get + options)
            .then((response) => {
                setLoading(false);
                setDataTableData(response.data.data.docs ?? []);
                setTotalRows(response.data.data.total ?? 0);
                // setUserName(response.data.data.docs[0].userData.first_name + ' ' + response.data.data.docs[0].userData.last_name)
                setUserName(state.user_name)
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    }

    const columnsAnt = [
        {
            title: 'Asset Type',
            dataIndex: 'categoryTypeData.name',
            sorter: true,
            render: (text, row) => {
                return (
                    (row.categoryTypeData) ? row.categoryTypeData.name : ''
                );
            },
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Asset Id',
            dataIndex: '_id',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Build Area sq.m',
            dataIndex: 'build_area',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Asset Condition Rating',
            dataIndex: '_id',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            render: (text, row) => {
                // general_rating
                return (
                    <>
                        {
                            Number(row?.general_rating) > 0 ?
                                <Rate value={parseInt(row.general_rating)} disabled count={9} style={{ color: rating9Color(parseInt(row.general_rating)), fontSize: 12 }} />
                                :
                                'N/A'

                        }

                    </>);
            },
        },

        {
            title: 'Build Cost (USD)',
            dataIndex: 'build_cost',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Estimated Annual Maintenance Costs (USD)',
            dataIndex: 'estimated_maintenance_costs',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Year Build',
            dataIndex: 'year_built',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Current Value (USD)',
            dataIndex: 'current_value',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Is Active',
            dataIndex: 'is_active',
            sorter: true,
            render: (text, row) => {
                return (
                    <span className={`btn btn-sm   ${row.is_active === true ? "btn-success" : "btn-danger"}`}>
                        {
                            row.is_active === true ? "Yes" : "No"
                        }
                    </span>
                );
            },
            filters: [
                {
                    text: 'Yes',
                    value: true,
                },
                {
                    text: 'No',
                    value: false,
                },
            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.is_active === value ?? record.is_active,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Action',
            dataIndex: 'id',
            render: (text, row) => {
                return (
                    <div className="table-responsive">
                        <div className='action-btn my-theme-color-button'>
                            <Tooltip title="View">
                                <Button type="primary" onClick={(e) => showRowDataModal(row)}>
                                    <FontAwesomeIcon icon={faEye} />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Edit">
                                <Button type="primary" onClick={(id) => { editButtonClick(row._id) }}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </Button>
                            </Tooltip>

                            <Tooltip title="Change status">
                                <Button type="primary" onClick={(e) => changeStatusButtonClick(row._id, row.is_active === true ? "false" : "true")}>
                                    {
                                        row.is_active === true ? <FontAwesomeIcon icon={faToggleOff} /> : <FontAwesomeIcon icon={faToggleOn} />
                                    }
                                </Button>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <Button type="primary" onClick={(id) => { deleteButtonClick(row._id) }} >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                );
            },
        },
    ];

    const filterComponentHandleChange = (event) => {
        currentFilterText = event.target.value;
        setFilterText(currentFilterText);
        getData();
    }

    const onChange = (pagination, filters, sorter, extra) => {
        setPageNo(pagination.current)
        getData(pagination.current, pagination.pageSize, sorter.field, sorter.order)
    }

    const deleteButtonClick = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let obj = `?id=${id}`;
                await Http
                    .del(process.env.REACT_APP_BASE_URL + url.user_asset_delete + obj)
                    .then((response) => {
                        getData();
                        successResponse(response);
                    })
                    .catch((error) => {
                        if (error.response) {
                            errorResponse(error);
                        }
                    });
            }
        })
    };

    const changeStatusButtonClick = async (id, status) => {
        const obj = {
            id: id,
            status: status,
        };
        await Http.post(process.env.REACT_APP_BASE_URL + url.user_asset_change_status, obj)
            .then((response) => {
                successResponse(response);
                getData();
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    };

    const editButtonClick = (id) => {
        navigate('/asset/form', { state: { id: id, user_id: userId, user_name: state?.user_name ?? '' } });
    };
    const showRowDataModal = (row) => {
        const imageData = row.assetImageData ? row?.assetImageData.map((v, i) => {
            return v.image
        }) : []
        let TableModaldata = (
            <div className="table-responsive">
                <TableModal striped bordered hover className="cr-table">
                    <tbody>
                        <tr>
                            <th>Id</th>
                            <td>{row._id}</td>
                        </tr>
                        <tr>
                            <th>Category</th>
                            <td>{row.categoryTypeData ? row.categoryTypeData.name : ''}</td>
                        </tr>
                        <tr>
                            <th>Asset Uses</th>
                            <td>{(row.assetUsesData) ? row.assetUsesData.name : ''}</td>
                        </tr>
                        {/* <tr>
                            <th>Asset Structural Type</th>
                            <td>{row}</td>
                        </tr>
                        <tr>
                            <th>Facade Type</th>
                            <td>{row.question}</td>
                        </tr> */}
                        <tr>
                            <th>Asset Description</th>
                            <td>{row.description}</td>
                        </tr>
                        <tr>
                            <th>Year Build</th>
                            <td>{row.year_built}</td>
                        </tr>
                        <tr>
                            <th>Gross Area (sq. m)</th>
                            <td>{row.gross_area}</td>
                        </tr>
                        <tr>
                            <th>Build Area (sq. m)</th>
                            <td>{row.build_area}</td>
                        </tr>
                        <tr>
                            <th>Build/Acquisition Cost (USD)</th>
                            <td>{row.build_cost}</td>
                        </tr>
                        <tr>
                            <th>Current Value (as of today) (USD)</th>
                            <td>{row.current_value}</td>
                        </tr>
                        <tr>
                            <th>Current Issues/Concerns/Observation,Risks</th>
                            <td>{row.current_issues}</td>
                        </tr>
                        <tr>
                            <th>Previous Issues reported and fixed</th>
                            <td>{row.Previous_issue}</td>
                        </tr>
                        <tr>
                            <th>General Asset Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.general_rating) === 0 ? <p>N/A</p> : <Rate value={parseInt(row.general_rating)} count={9} style={{ color: rating9Color(parseInt(row.general_rating)), fontSize: 12 }} />


                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Structural Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {Number(row.structural_rating) === 0 ? <p>N/A</p> : <Rate value={parseInt(row.structural_rating)} count={5} style={{ color: rating9Color(parseInt(row.structural_rating)), fontSize: 12 }} disabled={true} />}
                            </td>
                        </tr>
                        <tr>
                            <th>General Fit out/Decoration/Finishing Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {Number(row.fitout_rating) === 0 ? <p>N/A</p> :
                                    <Rate value={parseInt(row.fitout_rating)} count={5} style={{ color: rating9Color(parseInt(row.fitout_rating)), fontSize: 12 }} disabled={true} />}
                            </td>
                        </tr>
                        <tr>
                            <th>Cleanliness Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {Number(row.cleanliness_rating) === 0 ? <p>N/A</p> :
                                    <Rate value={parseInt(row.cleanliness_rating)} count={5} style={{ color: rating9Color(parseInt(row.cleanliness_rating)), fontSize: 12 }} disabled={true} />

                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Floors Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.floors_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.floors_rating)} count={5} style={{ color: rating9Color(parseInt(row.floors_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Doors Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.doors_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.doors_rating)} count={5} style={{ color: rating9Color(parseInt(row.doors_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Windows Condition Rating</th>
                            <td >
                                <div className="d-flex justify-content-between">
                                    {
                                        Number(row.windows_rating) === 0 ? <p>N/A</p> :
                                            <Rate value={parseInt(row.windows_rating)} count={5} style={{ color: rating9Color(parseInt(row.windows_rating)), fontSize: 12 }} />
                                    }
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <th>Wall Partitioning Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.wall_partitionin_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.wall_partitionin_rating)} count={5} style={{ color: rating9Color(parseInt(row.wall_partitionin_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Secondary/False Ceiling Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {Number(row.secondary_ceiling_rating) === 0 ? <p>N/A</p> :
                                    <Rate value={parseInt(row.secondary_ceiling_rating)} count={5} style={{ color: rating9Color(parseInt(row.secondary_ceiling_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Floors Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.floors_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.floors_rating)} count={5} style={{ color: rating9Color(parseInt(row.floors_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Doors Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.doors_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.doors_rating)} count={5} style={{ color: rating9Color(parseInt(row.doors_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Windows Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.windows_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.windows_rating)} count={5} style={{ color: rating9Color(parseInt(row.windows_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Wall Partitioning Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.wall_partitionin_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.wall_partitionin_rating)} count={5} style={{ color: rating9Color(parseInt(row.wall_partitionin_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Secondary/False Ceiling Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.secondary_ceiling_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.secondary_ceiling_rating)} count={5} style={{ color: rating9Color(parseInt(row.secondary_ceiling_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Coating/Paint Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.coating_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.coating_rating)} count={5} style={{ color: rating9Color(parseInt(row.coating_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Metal Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.metal_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.metal_rating)} count={5} style={{ color: rating9Color(parseInt(row.metal_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Tile Cladding Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.tile_cladding_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.tile_cladding_rating)} count={5} style={{ color: rating9Color(parseInt(row.tile_cladding_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Glass Cladding Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {Number(row.glass_cladding_rating) === 0 ? <p>N/A</p> :
                                    <Rate value={parseInt(row.glass_cladding_rating)} count={5} style={{ color: rating9Color(parseInt(row.glass_cladding_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Wooden Cladding Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.wooden_cladding_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.wooden_cladding_rating)} count={5} style={{ color: rating9Color(parseInt(row.wooden_cladding_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Railing/Handrail/Balustrade Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.railing_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.railing_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.railing_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Roofing Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.roofing_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.roofing_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.roofing_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Fence Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.fence_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.fence_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.fence_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Gate Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.gate_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.gate_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.gate_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Sanitary Accessories/Bath Rooms Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.sanitary_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.sanitary_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.sanitary_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Pumping/Drainage System Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.pumping_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.pumping_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.pumping_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>A/C System Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.ac_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.ac_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.ac_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Electrical Systems/Lighting Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.electrical_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.electrical_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.electrical_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Lift Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.lift_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.lift_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.lift_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>External Areas/Pavement Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.external_areas_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.external_areas_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.external_areas_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>

                        <tr>
                            <th>Gardening/Soft Landscape Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.gardening_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.gardening_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.gardening_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Hard Landscape Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.hard_landscape_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.hard_landscape_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.hard_landscape_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Escalator/Travellator Condition Rating</th>
                            <td className="d-flex justify-content-between">
                                {
                                    Number(row.escalator_condition_rating) === 0 ? <p>N/A</p> :
                                        <Rate value={parseInt(row.escalator_condition_rating)} count={5} style={{ color: rating9Color(parseInt(row.escalator_condition_rating)), fontSize: 12 }} />
                                }
                            </td>
                        </tr>
                        <tr>
                            <th>Photo/File</th>
                            <td>
                                <div className="d-flex flex-wrap">
                                    {imageData && imageData.map((v, i) => {
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
                            </td>
                        </tr>

                        {/* <tr>
                            <th>Question</th>
                            <td>{row.question}</td>
                        </tr>
                        <tr>
                            <th>Answer</th>
                            <td>{row.answer}</td>
                        </tr> */}
                        <tr>
                            <th>Is Active</th>
                            <td><span className={`btn btn-sm   ${row.is_active === true ? "btn-success" : "btn-danger"}`}>
                                {
                                    row.is_active === true ? "Yes" : "No"
                                }
                            </span>
                            </td>
                        </tr>

                    </tbody>
                </TableModal>
            </div>
        )
        setviewModalText(TableModaldata);
        setVisible(true);
    };

    const handleViewModelCancel = () => {
        setVisible(false);
    };
    //  End here crud related function

    const addNewAssets = () => {
        navigate('/asset/form', { state: { user_id: userId, user_name: state?.user_name ?? '' } });
    }

    return (
        <Fragment>
            <Content className="site-layout-background">

                <div className="page-card-view">
                    <Card>
                        <CardHeader className="card-header-part">
                            <h5>User Assets List
                                {
                                    (userId) ? " " + "(" + userName + " / " + userId + ") " : ''
                                }
                            </h5>
                            <div className="card-header-action ml-3">
                                <div className="d-flex justify-content-end">
                                    <div className="form-group mb-0 mr-3">
                                        <input type="text"
                                            className="form-control"
                                            id="search"
                                            placeholder="Search"
                                            value={filterText}
                                            onChange={(event) => filterComponentHandleChange(event)}
                                        />
                                    </div>
                                    <div className="form-group mb-0">
                                        {userId && <div onClick={addNewAssets} className="menu-link btn my-button">
                                            <FontAwesomeIcon icon={faPlus} className="mr-1" />
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>

                            <div className="table-part table-style-1">

                                <div className="table-responsive">
                                    <Table
                                        columns={columnsAnt}
                                        dataSource={dataTableData}
                                        rowKey={"_id"}
                                        loading={loading}
                                        pagination={{
                                            total: totalRows,
                                            showSizeChanger: true
                                        }}
                                        onChange={onChange}
                                        exportableProps={{ showColumnPicker: true }}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </Content>
            <Modal title="User Asset Details" centered footer={''} open={visible} onCancel={handleViewModelCancel}>
                {viewModalText}
            </Modal>
        </Fragment >
    );
}

export default Index;

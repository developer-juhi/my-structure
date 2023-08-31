import React, { useState, useEffect, Fragment, createRef } from 'react';
import { Card, CardBody, CardHeader, Table as TableModal } from "reactstrap";
import { Table, Modal, Layout, Button, Tooltip, Image, Form, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faPencilAlt, faTrashAlt, faEye, faToggleOff, faToggleOn, faComment } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Http from '../../../security/Http';
import { errorResponse, successResponse, validateMessages, isJson } from "../../../helpers/response";
import url from "../../../../Development.json";
import Profile from "../../../../assets/images/dummy-profile-pic.jpg"
import { CSVLink } from "react-csv"
import {
    addAllFirebaseUser,
} from "../../../helpers/fireBase";
import { IoIosNotifications, IoMdNotificationsOff } from 'react-icons/io'
import {
    startChat,
} from "../../../helpers/fireBase";

const Index = () => {
    const [form] = Form.useForm();
    const [dataTableData, setDataTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [filterText, setFilterText] = useState('');
    const [visible, setVisible] = useState(false);
    const [viewModalText, setviewModalText] = useState();
    const ref = createRef();
    const [dataTableDataExport, setDataTableDataExport] = useState([]);
    const [pageNo, setPageNo] = useState(1);

    const navigate = useNavigate();
    const { Content } = Layout;
    let currentFilterText = '';

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //  Start here crud related function
    // const chatButtonClick = (id) => {
    //     navigate('/chat', { state: { id: id, type: 2 } });
    // };
    const chatButtonClick = async (id) => {
        // navigate('/chat', { state: { id: id, type: 3 } });
        const data = {
            userId: JSON.parse(localStorage.getItem('profile'))._id,
            oppositeUserID: id
        }
        await startChat(data);
        navigate('/chat-detail', { state: { chatData: data } });
    };



    const getData = async (page = pageNo, perPage = 10, sortField = 'createdAt', sortDirection = 'desc') => {
        let options = `?page=${page}&per_page=${perPage}&delay=1&sort_direction=${sortDirection}&sort_field=${sortField}&search=${currentFilterText}&type=2`;
        await Http.get(process.env.REACT_APP_BASE_URL + url.user_get + options)
            .then((response) => {
                setLoading(false);
                setDataTableData(response.data.data.docs);
                setTotalRows(response.data.data.total);
            })
            .catch((error) => {
                if (error.response) {
                    errorResponse(error);
                }
            });
    }


    // if (dataTableData && dataTableData.length > 0) {
    //     dataTableData.map(async (item, i) => {
    //         console.log(item)
    //         addAllFirebaseUser(item)
    //     })
    // }

    useEffect(() => {
        // eslint-disable-next-line array-callback-return
        const newArray = []; // Create a copy

        if (dataTableData && dataTableData.length > 0) {
            dataTableData.map(async (item, i) => {
                let obj = {};
                obj['Id'] = item._id;
                obj['First Name'] = item.first_name;
                obj['Last Name'] = item.last_name;
                obj['User Name'] = item.user_name;
                obj['Mobile No'] = item.mobile_no;
                obj['Email'] = item.email;
                obj['Unique Id'] = item.unique_id;
                obj['Date Of Birth'] = item.date_of_birth;
                obj['Created At'] = item.createdAt;
                newArray.push(obj);
            })
        }
        setDataTableDataExport(newArray)

        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [dataTableData]);

    const columnsAnt = [
        {
            title: 'Vendor Id',
            dataIndex: '_id',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'User Name',
            dataIndex: 'user_name',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Company Name',
            dataIndex: 'company_name',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Service Category',
            dataIndex: 'serviceTypeData.name',
            sorter: true,
            render: (text, row) => {
                return (
                    (row.serviceTypeData) ? row.serviceTypeData.name : ''
                );
            },
            sortDirections: ["ascend", "descend", "ascend"],
        },

        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Mobile No',
            dataIndex: 'mobile_no',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        // {
        //     title: 'Brochure',
        //     dataIndex: 'upload_brochure',
        //     sorter: true,
        //     render: (text, row) => {
        //         return (
        //             (row.upload_brochure) ?
        //                 <a href={row.upload_brochure} download className="btn btn-warning a-remove-text-decoration">
        //                     Download Brochure
        //                 </a>
        //                 : ''
        //         );
        //     },

        //     sortDirections: ["ascend", "descend", "ascend"],
        // },
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
                            <Tooltip title="Chat">
                                <Button type="primary" className="" onClick={(id) => { chatButtonClick(row._id) }}>
                                    <FontAwesomeIcon icon={faComment} />
                                </Button>
                            </Tooltip>
                            {/* <Tooltip title="Edit">
                                <Button type="primary" onClick={(id) => { editButtonClick(row._id) }}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </Button>
                            </Tooltip> */}

                            <Tooltip title="Change status">
                                <Button type="primary" onClick={(e) => changeStatusButtonClick(row._id, row.is_active === true ? "false" : "true")}>
                                    {
                                        row.is_active === true ? <FontAwesomeIcon icon={faToggleOff} /> : <FontAwesomeIcon icon={faToggleOn} />
                                    }
                                </Button>
                            </Tooltip>
                            <Tooltip title="Email Notification status">
                                <Button type="primary" onClick={(e) => changeStatusEmailButtonClick(row._id, row.email_is_active === true ? "false" : "true")}>
                                    {
                                        row.email_is_active === true ? <IoIosNotifications icon={faToggleOff} /> : <IoMdNotificationsOff icon={faToggleOn} />
                                    }
                                </Button>
                            </Tooltip>
                            <Tooltip title="Firebase Notification status">
                                <Button type="primary" onClick={(e) => changeStatusFirebaseButtonClick(row._id, row.firebase_is_active === true ? "false" : "true")}>
                                    {
                                        row.firebase_is_active === true ? <FontAwesomeIcon icon={faToggleOff} /> : <FontAwesomeIcon icon={faToggleOn} />
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

    const changeStatusEmailButtonClick = async (id, status) => {
        const obj = {
            id: id,
            status: status,
        };
        await Http.post(process.env.REACT_APP_BASE_URL + url.user_change_status_email, obj)
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
    const changeStatusFirebaseButtonClick = async (id, status) => {
        const obj = {
            id: id,
            status: status,
        };
        await Http.post(process.env.REACT_APP_BASE_URL + url.user_change_status_firebase, obj)
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
                    .del(process.env.REACT_APP_BASE_URL + url.user_delete + obj)
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
        await Http.post(process.env.REACT_APP_BASE_URL + url.user_change_status, obj)
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
        navigate('/vendor/form', { state: { id: id } });
    };

    const showRowDataModal = (row) => {

        let addressManage = {}
        if (isJson(row.location)) {
            addressManage = JSON.parse(row.location)
        }
        const onFinishPassword = async (e) => {
            const data = {
                user_id: row._id,
                password: e.new_password,
                // updated_by: JSON.parse(localStorage.getItem("profile")).user_name
            }
            await Http
                .post(process.env.REACT_APP_BASE_URL + url.change_user_password, data)
                .then((response) => {
                    handleViewModelCancel()
                    form.resetFields()
                    successResponse(response);
                })
                .catch((error) => {

                    if (error.response) {
                        errorResponse(error);
                    }
                });

        }
        let TableModaldata = (
            <div className="table-responsive">
                <TableModal striped bordered hover className="cr-table">
                    <tbody>
                        <tr>
                            <th>Unique Id</th>
                            <td>{row.unique_id}</td>
                        </tr>
                        <tr>
                            <th>First Name</th>
                            <td>{row.first_name}</td>
                        </tr>
                        <tr>
                            <th>Last Name</th>
                            <td>{row.last_name}</td>
                        </tr>
                        <tr>
                            <th>User Name</th>
                            <td>{row.user_name}</td>
                        </tr>
                        <tr>
                            <th>Company Name</th>
                            <td>{row.company_name}</td>
                        </tr>
                        <tr>
                            <th>Service Type</th>
                            <td>{(row.serviceTypeData) ? row.serviceTypeData.name : ''}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{row.email}</td>
                        </tr>

                        <tr>
                            <th>Location</th>
                            <td>{(addressManage.address) ? addressManage.address : ''}</td>
                        </tr>
                        <tr>
                            <th>DOB</th>
                            <td>{row.date_of_birth}</td>
                        </tr>

                        <tr>
                            <th>Mobile No</th>
                            <td>{row.mobile_no}</td>
                        </tr>

                        <tr>
                            <th>Profile Photo</th>
                            <td>
                                <Image
                                    width={100}
                                    src={row.profile_photo ? row.profile_photo : Profile}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Change Password</th>
                            <td>
                                <Form form={form}
                                    name="basic"
                                    layout="vertical"
                                    onFinish={onFinishPassword}
                                    validateMessages={validateMessages()}
                                    autoComplete="off"
                                    className="m-5"
                                >
                                    <Form.Item
                                        label="New Password"
                                        name="new_password"
                                        id="new_password"
                                        rules={[
                                            {
                                                required: true,
                                                type: 'string',
                                                min: 6,
                                                max: 39,
                                            },
                                        ]}
                                    >
                                        <Input min={6} />
                                    </Form.Item>
                                    <Form.Item
                                        wrapperCol={{
                                            offset: 8,
                                            span: 16,
                                        }}
                                    >
                                        <Button type="primary" className='my-submit-button' htmlType="submit" >
                                            Update
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </td>
                        </tr>
                        {row.upload_brochure && <tr>
                            <th>Brochure</th>
                            <td>
                                {(row.upload_brochure) ?
                                    <a href={row.upload_brochure} download className="btn btn-warning a-remove-text-decoration">
                                        Download Brochure
                                    </a>
                                    : '--'}
                            </td>
                        </tr>}
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



    return (
        <Fragment>
            <Content className="site-layout-background">

                <div className="page-card-view">
                    <Card>
                        <CardHeader className="card-header-part">
                            <h5>Vendor List</h5>
                            <div className="card-header-action ml-3">

                                <div className="d-flex justify-content-end mobile-view-search-export">

                                    <Button className='export-button my-button'>
                                        <CSVLink
                                            filename={new Date().toLocaleString() + ".csv"}
                                            data={dataTableDataExport}
                                        >
                                            Export to CSV
                                        </CSVLink>
                                    </Button>
                                    <div className="form-group mb-0 mr-3 width-100pr">
                                        <input type="text"
                                            className="form-control"
                                            id="search"
                                            placeholder="Search"
                                            value={filterText}
                                            onChange={(event) => filterComponentHandleChange(event)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>

                            <div className="table-part table-style-1" ref={ref}>

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
            <Modal title="Vendor Details" centered footer={''} open={visible} onCancel={handleViewModelCancel}>
                {viewModalText}
            </Modal>
        </Fragment >
    );
}

export default Index;

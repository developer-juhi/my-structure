import React, { useState, useEffect, Fragment } from 'react';
import { Card, CardBody, CardHeader, Table as TableModal } from "reactstrap";
import { Table, Modal, Layout, Button, Tooltip, Image, Tabs } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faEye, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import Http from '../../../security/Http';
import { errorResponse, successResponse,isJson } from "../../../helpers/response";
import url from "../../../../Development.json";
import thumb from "../../../../assets/images/thumb.jpg"
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'
const Index = () => {
    const [dataTableData, setDataTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [filterText, setFilterText] = useState('');
    const [visible, setVisible] = useState(false);
    const [viewModalText, setviewModalText] = useState();
    const [pageNo, setPageNo] = useState(1);
    const [type, setType] = useState('1');

    const { Content } = Layout;
    let currentFilterText = '';

    useEffect(() => {
        setType('1')

        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const navigate = useNavigate();

    //  Start here crud related function

    const getData = async (page = pageNo, perPage = 10, sortField = 'createdAt', sortDirection = 'desc', sendType = type) => {
        let options = `?page=${page}&per_page=${perPage}&delay=1&sort_direction=${sortDirection}&sort_field=${sortField}&search=${currentFilterText}&type=${sendType}`;
        await Http.get(process.env.REACT_APP_BASE_URL + url.contact_us_get + options)
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

    const columnsAnt = [
        {
            title: 'Related Id',
            dataIndex: '_id',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'Submission Date',
            dataIndex: 'createdAt',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
            render: (text, row) => {
                return (
                    <span>
                        {
                            `${dayjs(row.createdAt).format('DD/MM/YYYY')}`
                        }
                    </span>

                );
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
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
        {
            title: 'Address',
            dataIndex: 'location',
            sorter: true,
            render: (text, row) => {
                let addressManage = {}
                if (isJson(row.location)) {
                    addressManage = JSON.parse(row.location)
                }
                return (
                    (addressManage) ? addressManage.address : ''
                );
            },
            sortDirections: ["ascend", "descend", "ascend"],
        },
        // {
        //     title: 'Type',
        //     dataIndex: 'user_id',
        //     sorter: true,
        //     render: (text, row) => {
        //         return (
        //             (row.userData) ? row.userData.type : '--'
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
                    <div className='action-btn my-theme-color-button'>
                        <Tooltip title="View">
                            <Button type="primary" onClick={(e) => showRowDataModal(row)}>
                                <FontAwesomeIcon icon={faEye} />
                            </Button>
                        </Tooltip>

                        <Tooltip title="Chat">
                            <Button type="primary" className="" onClick={(id) => { chatButtonClick(row.user_id) }}>
                                <FontAwesomeIcon icon={faComment} />
                            </Button>
                        </Tooltip>

                        <Tooltip title="Change status">
                            <Button type="primary" onClick={(e) => changeStatusButtonClick(row._id, row.is_active === true ? "false" : "true")}>
                                {
                                    row.is_active === true ? <FontAwesomeIcon icon={faToggleOff} /> : <FontAwesomeIcon icon={faToggleOn} />
                                }
                            </Button>
                        </Tooltip>

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

    const chatButtonClick = (id) => {
        navigate('/chat', { state: { id: id, type: 3 } });
    };

    const changeStatusButtonClick = async (id, status) => {
        const obj = {
            id: id,
            status: status,
        };
        await Http.post(process.env.REACT_APP_BASE_URL + url.contact_us_change_status, obj)
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


    const showRowDataModal = (row) => {
        let images = {}
        if (isJson(row.images)) {
            images = JSON.parse(row.images)
        }
        let TableModaldata = (
            <div className="table-responsive">
                <TableModal striped bordered hover className="cr-table">
                    <tbody>
                        <tr>
                            <th>Id</th>
                            <td>{row._id}</td>
                        </tr>
                        <tr>
                            <th>Name</th>
                            <td>{row.name}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{row.email}</td>
                        </tr>

                        <tr>
                            <th>Mobile No</th>
                            <td>{row.mobile_no}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>{row.address}</td>
                        </tr>
                        {(images) ?
                            <tr>
                                <th>Images</th>
                                <td>
                                    {images.length > 0 ? images.map(img => (
                                        <Image src={img} height={"75px"} width={"75px"} key={img} />
                                    )) : <Image src={thumb} height={"75px"} width={"75px"} key={thumb} />}
                                </td>
                            </tr>
                            : ''}


                        <tr>
                            <th>Message</th>
                            <td>{row.message}</td>
                        </tr>

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
    const onChangeTab = async (key) => {
        await setType(key)
        // await getData(key)
    };


    useEffect(() => {
     getData()
    }, [type])
    

    const items = [
        {
            key: '1',
            label: `Customer`,
            children: <Table
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
            />,
        },

        {
            key: '2',
            label: `Service Provider`,
            children: <Table
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
            />,
        },
        {
            key: '3',
            label: `Guest`,
            children: <Table
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
            />,
        },
    ];

    return (
        <Fragment>
            <Content className="site-layout-background">

                <div className="page-card-view">
                    <Card>
                        <CardHeader className="card-header-part">
                            <h5>User Inquiry List</h5>
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
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody>

                            <div className="table-part table-style-1">
                                <div className="table-responsive">
                                    <Tabs defaultActiveKey="1" items={items} onChange={onChangeTab} />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

            </Content>
            <Modal title="User Inquiry Details" centered footer={''} open={visible} onCancel={handleViewModelCancel}>
                {viewModalText}
            </Modal>
        </Fragment >
    );
}

export default Index;

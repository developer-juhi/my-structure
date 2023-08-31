import React, { useState, useEffect, Fragment } from 'react';
import { Card, CardBody, CardHeader, Table as TableModal } from "reactstrap";
import { Table, Modal,   Layout, Button, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { faPencilAlt, faTrashAlt, faEye, faToggleOff, faToggleOn, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import Http from '../../../security/Http';
import { errorResponse, successResponse } from "../../../helpers/response";
import url from "../../../../Development.json";


const Index = () => {
    const [dataTableData, setDataTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [filterText, setFilterText] = useState('');
    const [visible, setVisible] = useState(false);
    const [viewModalText, setviewModalText] = useState();

    const navigate = useNavigate();
    const { Content } = Layout;
    let currentFilterText = '';


    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //  Start here crud related function

    const getData = async (page = 1, perPage = 10, sortField = 'createdAt', sortDirection = 'desc') => {
        setDataTableData([]);
        setTotalRows(0);
        let options = `?page=${page}&per_page=${perPage}&delay=1&sort_direction=${sortDirection}&sort_field=${sortField}&search=${currentFilterText}`;
        await Http.get(process.env.REACT_APP_BASE_URL + url.social_media_get + options)
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
            title: 'Name',
            dataIndex: 'name',
            sorter: true,
            sortDirections: ["ascend", "descend", "ascend"],
        },
        {
            title: 'value',
            dataIndex: 'value',
            sorter: true,
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
                    .del(process.env.REACT_APP_BASE_URL + url.social_media_delete + obj)
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
        await Http.post(process.env.REACT_APP_BASE_URL + url.social_media_change_status, obj)
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
        navigate('/social-media/form', { state: { id: id } });
    };

    const showRowDataModal = (row) => {
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
                            <th>Value</th>
                            <td>{row.value}</td>
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
                            <h5>Social Media List</h5>
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
                                        <Link to="/social-media/form" className="menu-link btn my-button">
                                            <FontAwesomeIcon icon={faPlus} className="mr-1" />
                                        </Link>
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
            <Modal title="Social Media Details" centered footer={''} open={visible} onCancel={handleViewModelCancel}>
                {viewModalText}
            </Modal>
        </Fragment >
    );
}

export default Index;

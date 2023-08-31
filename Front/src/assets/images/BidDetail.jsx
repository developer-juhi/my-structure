import React, { useEffect, useState } from 'react'
import { Button, Form, Typography, Card, Row, Col, Image, Modal } from 'antd';
import url from "../../../../../Development.json";
import Http from '../../../../security/Http'
import { errorResponse, successResponse, validateMessages } from "../../../../helpers/response";
import Swal from 'sweetalert2';
import dollar from '../../../../../assets/images/icon/doller.png'
import watch from '../../../../../assets/images/icon/watch.png'
import quatation from '../../../../../assets/images/icon/quatation.png'
import bag from '../../../../../assets/images/icon/bag.png'
import star from '../../../../../assets/images/icon/star.png'
import AcceptBid from './AcceptBid';
import Review from './Review';
import SpProfile from './SpProfile';
import parse from 'html-react-parser';

const Index = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [acceptModalOpen, setAcceptModalOpen] = useState(false)

    const [openReviewModal, setopenReviewModal] = useState(false)
    const [openModelSpProfile, setOpenModelSpProfile] = useState(false)

    const [reviewList, setReviewList] = useState([])
    const [totalReview, setTotalReview] = useState(0)

    const [bidDetailsData, setbidDetailsData] = useState()

    const handleAcceptModal = () => {
        setAcceptModalOpen(!acceptModalOpen)
    }

    const handleSpProfileModal = () => {
        setOpenModelSpProfile(!openModelSpProfile)
    }

    const bidRejectButtonClick = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, reject it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const data = {
                    id: props.bidData._id,
                }
                await Http
                    .post(process.env.REACT_APP_BASE_URL + url.bid_reject_store, data)
                    .then((response) => {
                        successResponse(response);
                        props.getBidRequest();
                    })
                    .catch((error) => {
                        if (error.response) {
                            props.getBidRequest();
                            errorResponse(error);
                        }
                    });
            }
        })
    };

    useEffect(() => {
        getBidDetails()
    }, [props.bidId])

    const onHandleReviewModal = () => {
        setopenReviewModal(!openReviewModal)
    }
    const onCancelModal = async () => {
        // form.resetFields();
        await props.handleBidDetailModal(false);
    }

    const getReviewRequest = async () => {

        let dataPass = {
            vendor_id: props.bidData.vendor_id
        }
        if (dataPass) {
            setReviewList([])
            await Http
                .post(process.env.REACT_APP_BASE_URL + url.get_reviews, dataPass)
                .then((response) => {
                    setReviewList(response.data.data);
                    setTotalReview(response.data.data.length);
                })
                .catch((error) => {

                    if (error.response) {
                        errorResponse(error);
                    }
                });
        }

    };

    const getBidDetails = async () => {

        if (props.bidData._id) {

            let vId = {
                id: props.bidData._id
                // id: "63b7be3b63a495f3143a4481"
            }
            if (vId) {
                // setReviewList([])
                await Http
                    .post(process.env.REACT_APP_BASE_URL + url.get_bid_details, vId)
                    .then((response) => {
                        const result = response.data.data
                        setbidDetailsData(result)
                    })
                    .catch((error) => {

                        if (error.response) {
                            errorResponse(error);
                        }
                    });
            }
        }
    };


    useEffect(() => {
        if (props.bidDetailModalOpen && props.bidData?.vendor_id) {
            getReviewRequest()
            getBidDetails()
            // setbidDetailsData(props.bidData)  
        }

    }, [props.bidDetailModalOpen, props.bidData])
    return (
        <div className="page-card-view">
            <Modal title="Bid Details" centered footer={''} bodyStyle={{ padding: 0 }} open={props.bidDetailModalOpen} onCancel={onCancelModal}>

                {/* <Card title="Bid Details" bodyStyle={{ padding: 0 }} style={{ width: '40%', minWidth: 450 }} className="col-md-4 col-xs-12 col-lg-4 m-auto p-0"> */}
                <div className='mt-3'>
                    <div className='flex-direction-row-align-center ph-20'>
                        <div className='bid-details-profile'>
                            <img src={

                                (props.serviceRequestData && props.serviceRequestData?.userData) ?
                                    props.serviceRequestData.userData.profile_photo
                                    :
                                    "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"

                            } style={{ width: '100%', height: '100%' }} alt="" />
                        </div>
                        <div className='ms-3'>
                            <h5 style={{ color: '#000000' }} onClick={handleSpProfileModal}>
                                {(props.serviceRequestData && props.serviceRequestData.userData) ?
                                    props.serviceRequestData.userData?.first_name +
                                    props.serviceRequestData.userData?.last_name
                                    : ''}
                            </h5>
                            <div className='flex-justify-beetween'>
                                <div className='flex-direction-row-align-center'>
                                    <img src={dollar} style={{ width: 20, height: 20 }} alt="" /> <Typography.Text strong className='mx-2'>$ {bidDetailsData?.amount ?? ''}</Typography.Text>
                                </div>
                                <div className='flex-direction-row-align-center'>
                                    <img src={watch} style={{ width: 20, height: 20 }} alt="" className='ms-2' /> <Typography.Text strong className='mx-2'> {`${bidDetailsData?.delivery_timeframe} Day`}</Typography.Text>
                                </div>
                                <div className='flex-direction-row-align-center'>
                                    <img src={bag} style={{ width: 20, height: 20 }} alt="" className='ms-2' /> <Typography.Text strong className='mx-2'>105</Typography.Text>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='bid-details-second-block'>
                        <Row
                            gutter={{
                                xs: 8,
                                sm: 16,
                                md: 24,
                                lg: 32,
                            }}
                        >
                            <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
                                <div className='flex-direction-row-align-center'>
                                    <img src={quatation} style={{ width: 30, height: 30 }} className='ms-2' alt="" /> <Typography.Text strong className='mx-2'>Quotation</Typography.Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className='flex-direction-row-align-center ' onClick={onHandleReviewModal}>
                                    <img src={star} style={{ width: 30, height: 30 }} className='ms-2' alt='' />
                                    <div className='flex-direction-col'>
                                        <Typography.Text strong className='mx-2'>4.5</Typography.Text>
                                        <Typography.Text className='mx-2'>({totalReview} review)</Typography.Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className='App ph-20'>
                        <Button type="primary" className='my-submit-button bid-button' onClick={handleAcceptModal}>
                            ACCEPT
                        </Button>

                        <Button type="primary" className='bid-button reject-color' onClick={bidRejectButtonClick}>
                            REJECT
                        </Button>
                    </div>

                    <div className='mt-3 ph-20'>
                        <h6>
                            {
                                (props.serviceRequestData) ?
                                    props.serviceRequestData?.title
                                    :
                                    ""
                            }
                        </h6>
                        <Typography.Text>
                            {
                                (props?.serviceRequestData && props.serviceRequestData.detail) ?
                                    parse(props.serviceRequestData.detail)
                                    :
                                    ""
                            }
                        </Typography.Text>
                    </div>

                    <div className='mt-3 ph-20 bid-details-img'>
                        {bidDetailsData?.bidRequestImagesData?.map((val, ind) => {
                            return (
                                <Image src={val?.path} className='img-list' alt="" />
                            )

                        })


                        }


                    </div>

                </div>
            </Modal>

            {/* <div className="bid-details-second-block">
                <Row
                    gutter={{
                        xs: 8,
                        sm: 16,
                        md: 24,
                        lg: 32,
                    }}
                >
                    <Col
                        span={12}
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <div className="flex-direction-row-align-center">
                            <img
                                src={quatation}
                                style={{ width: 30, height: 30 }}
                                className="ms-2"
                                alt=""
                            />{" "}
                            <Typography.Text strong className="mx-2">
                                Quotation
                            </Typography.Text>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div
                            className="flex-direction-row-align-center "
                            onClick={onHandleReviewModal}
                        >
                            <img
                                src={star}
                                style={{ width: 30, height: 30 }}
                                className="ms-2"
                                alt=""
                            />
                            <div className="flex-direction-col">
                                <Typography.Text strong className="mx-2">
                                    4.5
                                </Typography.Text>
                                <Typography.Text className="mx-2">
                                    (100 review)
                                </Typography.Text>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div> */}

            <AcceptBid acceptModalOpen={acceptModalOpen} handleAcceptModal={handleAcceptModal} />
            <Review openReviewModal={openReviewModal} onHandleReviewModal={onHandleReviewModal} reviewList={reviewList} />
            <SpProfile openModelSpProfile={openModelSpProfile} handleSpProfileModal={handleSpProfileModal} serviceRequestData={props.serviceRequestData} />

        </div>
    )
}

export default Index
import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col, Card, CardBody, Media, Form, FormGroup } from 'reactstrap'
import { FaSearch } from "react-icons/fa";
import { Image, Input } from 'antd';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import profileIamge from '../../../../assets/images/dummy-profile-pic.jpg'
import {
    getUserList,
} from "../../../helpers/fireBase";
import { useNavigate } from 'react-router-dom';
import '../../../../Chat.css';

const Chat = () => {
    const [chatList, setChatList] = useState([]);
    const [id, setId] = useState('');
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    const { state } = useLocation()

    useEffect(() => {
        if (JSON.parse(localStorage.getItem('profile'))) {
            setUserId(JSON.parse(localStorage.getItem('profile'))._id);
        }
        if (state && state.id) {
            setId(state.id);
        }
        getUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, userId])

    const getUsers = async () => {
        if (userId) {
            try {
                let data = {
                    userId: userId,
                }
                let userListData = await getUserList(data)
                setChatList(userListData)
            } catch (err) {
            }
        }
    };

    const detailThis = async (item) => {
        const data = {
            userId: JSON.parse(localStorage.getItem('profile'))._id,
            oppositeUserID: item.userID
        }
        navigate('/chat-detail', { state: { chatData: data } });
    };

    let chatPeopleListing = chatList.length > 0 && chatList.map((item, i) => {
        let trimmedString = item?.lstMsg?.[userId]?.substring(0, 20);
        let time = item?.lstmsgtime?.[userId];
        let dateShow = moment(new Date(time.seconds * 1000), "YYYYMMDD").format("DD/MM/YYYY")
        let dateCheck = moment(new Date(time.seconds * 1000), "YYYYMMDD").format("DD/MM/YYYY")
        if (dateCheck === moment().format("DD/MM/YYYY")) {
            dateShow = moment(new Date(time.seconds * 1000), "YYYYMMDD").format("hh:mm A");
        }
        if (dateCheck === moment().subtract(1, 'days').format("DD/MM/YYYY")) {
            dateShow = 'Yesterday';
        }
        
        return <div key={i}>
            <div className={`clearfix cursor-pointer`} id="first-li" onClick={(e) => detailThis(item)}>
                <div className='chat-profile-img-content'>
                    <div className='profile-image'>
                        <Image src={item.profileImg} className="rounded-circle user-image" alt="" height={50} width={50} />
                    </div>
                    <div className="about">
                        <div className='m-2'>
                            <div className="name">
                                {item.userName}
                            </div>
                            <div className="float-end fw-bold">
                                {dateShow}
                            </div>
                        </div>
                        <div className="m-2 status">
                            {trimmedString}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    })

    return (
        <Fragment>
            <div className="p-3">

                <div className="page-card-view ">
                    <Row>
                        <Col span={4} >

                        </Col>
                        <Col span={16} className="">
                            <Card className=""  >
                                <CardBody className="chat-body">
                                    <div className="chat-box">
                                        <div className="chat-left-aside">

                                            <div className="people-list">
                                                <div className="chat-list-page-self">
                                                    {/* <div className='d-flex'>
                                                            <div className=''>
                                                                <Image src={(profile) ? profile : profileIamge} className="rounded-circle " alt=""
                                                                    height={50} width={50}
                                                                />
                                                                <div className={`status-circle online`}></div>
                                                            </div>
                                                            <div className="about">
                                                                <div className="name f-w-600">{name}</div>
                                                                <div className="status">
                                                                    online
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                    <h3>
                                                        Chat Inquiry
                                                    </h3>
                                                </div>

                                                <div className="list">
                                                    {chatPeopleListing}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col span={8} >

                        </Col>
                    </Row>
                </div>
            </div>

        </Fragment >
    );
}

export default Chat;
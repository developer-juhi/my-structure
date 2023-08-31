import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col, Card, CardBody, Media } from 'reactstrap'
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import Webcam from "react-webcam";
import { Button, Input, Upload, Modal, Space, Image, Badge } from 'antd';
import url from "../../../../Development.json";
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import sendGallery from '../../../../assets/images/gellry.png';
import sendVideo from '../../../../assets/images/video.png';
import sendAudio from '../../../../assets/images/audio.png';
import sendLocation from '../../../../assets/images/location.png';
import sendRecord from '../../../../assets/images/record.png';
import sendCapture from '../../../../assets/images/capture.jpg';
import $ from "jquery";
import {
    getMessagesFireBase,
    detailScreenGetOppositeUserData,
    storeMessagesFireBase,
} from "../../../helpers/fireBase";
import { useNavigate } from 'react-router-dom';
import thumb from '../../../../assets/images/thumb.jpg'
import GoogleMapReact from 'google-map-react';
import ReactAudioPlayer from 'react-audio-player';
import '../../../../Chat.css';

const Chat = () => {
    const [oppositeUserID, setOppositeUserID] = useState('');
    const [messages, setMessages] = useState([]);
    const [oppositeUserData, setOppositeUserData] = useState([]);
    const [messagesArray, setMessagesArray] = useState([]);
    const [userId, setUserId] = useState('');

    const { state } = useLocation()
    const navigate = useNavigate();

    useEffect(() => {
        getMessages();
    });
    useEffect(() => {
        if (state && state.chatData) {
            setOppositeUserID(state.chatData.oppositeUserID)
            setUserId(state.chatData.userId)
        }

        getMessages()
        getDetail()
        setTimeout(() => {
            scrollTopCustom();
        }, 1000);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oppositeUserID, userId])


    const scrollTopCustom = async () => {
        $(function () {
            var wtf = $('.chat');
            var height = wtf[0].scrollHeight;
            wtf.scrollTop(height);
        });
    };



    const getDetail = async () => {
        const data = {
            userId: oppositeUserID
        }

        let arrayStore = await detailScreenGetOppositeUserData(data)
        setOppositeUserData(arrayStore[0])
    }
    const getMessages = async () => {
        let data = {
            userId: userId,
            oppositeUserID: oppositeUserID,
        }
        let arrayStore = await getMessagesFireBase(data)
        setMessagesArray(arrayStore)
    }

    const sendMessage = async (data) => {
        try {
            data.userId = userId;
            data.oppositeUserID = oppositeUserID;

            await storeMessagesFireBase(data)
            await getMessages()
            setIsModalVisible(false);
            scrollTopCustom();

        } catch (error) {
            console.error(error);
        }
    }


    const handleKeyword = (event) => {
        setMessages(event.target.value);
    }
    const handleMessagePress = async (e) => {
        let sendMessageData = messages.trim()
        if (sendMessageData.length > 0) {
            const data = {
                msg: messages,
                IsURL: false,
                ImageUrl: false,
                mediaType: "text",
            }
            await sendMessage(data);
        }
        setMessages('');
    }


    // start here Chat related 
    const getLocation = async () => {
        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
        } else {
            await navigator.geolocation.getCurrentPosition(async (position) => {

                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }
                const data = {
                    msg: JSON.stringify(location),
                    IsURL: false,
                    ImageUrl: false,
                    mediaType: "location",
                }
                await sendMessage(data);

            }, () => {
                console.log('Unable to retrieve your location');
            });
        }
    }

    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onChangeImage = async (info) => {
        if (info.file.status === 'done') {
            const data = {
                msg: '',
                IsURL: true,
                ImageUrl: info.file.response.data.image_url,
                mediaType: "image",
            }
            await sendMessage(data);
        }
    };
    const onChangeVideo = async (info) => {
        if (info.file.status === 'done') {
            const data = {
                msg: '',
                IsURL: true,
                ImageUrl: info.file.response.data.image_url,
                mediaType: "video",
            }

            await sendMessage(data);
        }
    };
    const onChangeAudio = async (info) => {
        if (info.file.status === 'done') {
            const data = {
                msg: '',
                IsURL: true,
                ImageUrl: info.file.response.data.image_url,
                mediaType: "audio",
            }
            await sendMessage(data);
        }
    };

    // end here Chat related 


    //  Start Camero On And OFF
    const [isCameraModalVisible, setIsCameraModalVisible] = useState(false);
    const showCameraModal = () => {
        setIsModalVisible(false);
        setIsCameraModalVisible(true);
    };
    const handleCameraCancel = () => {
        setIsCameraModalVisible(false);
    };

    const [isCameraVideoModalVisible, setIsCameraVideoModalVisible] = useState(false);


    const showCameraVideoModal = () => {
        setIsModalVisible(false);
        setIsCameraVideoModalVisible(true);
    };
    const handleCameraVideoCancel = () => {
        setIsCameraVideoModalVisible(false);
    };
    const webcamRef = React.useRef(null);

    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);

    const handleStartCaptureClick = React.useCallback(() => {
        setCapturing(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [webcamRef, setCapturing, mediaRecorderRef]);

    const handleDataAvailable = React.useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCaptureClick = React.useCallback(() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const handleDownload = React.useCallback(() => {

        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "react-webcam-stream-capture.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            setRecordedChunks([]);
        }
    }, [recordedChunks]);

    const capture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const data = {
            msg: '',
            IsURL: true,
            ImageUrl: imageSrc,
            mediaType: "image",
        }
        await sendMessage(data);
        setIsCameraModalVisible(false);
    };
    //  End Camero On And OFF

    let chatListingMessage = messagesArray.map((item, i) => {
        let message = '';
        let time = item.createAt;
        let profileImg = ''
        let name = ''
        if (item.sendBy === userId) {
            // name = JSON.parse(localStorage.getItem('profile')).user_name;
            name = JSON.parse(localStorage.getItem('profile')).first_name + " " + JSON.parse(localStorage.getItem('profile')).last_name;
            profileImg = JSON.parse(localStorage.getItem('profile')).profile_photo;
        } else {
            profileImg = oppositeUserData.profileImg
            name = oppositeUserData.userName
        }

        if (item.mediaType === 'text') {
            message = item.msg
        }
        if (item.mediaType === 'image') {
            message = <Image
                width={100}
                height={100}
                src={item.ImageUrl}
            />
        }
        if (item.mediaType === 'video') {
            message = <video className='chatbox-height' controls>
                <source src={item.ImageUrl} />
            </video>
        }
        if (item.mediaType === 'audio') {
            message = <ReactAudioPlayer
                src={item.ImageUrl}
                controls
            />
        }
        if (item.mediaType === 'location') {
            const dataReplay = JSON.parse(item.msg)
            const defaultProps = {
                center: {
                    lat: dataReplay.latitude,
                    lng: dataReplay.longitude
                },
                zoom: 11
            };

            const AnyReactComponent = ({ text }) => <div>{text}</div>;

            message = <div className='' style={{ height: '199px', width: '50%' }} >
                <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_KEY }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                >
                    <AnyReactComponent
                        lat={dataReplay.latitude}
                        lng={dataReplay.longitude}
                        text="My Marker"
                    />
                </GoogleMapReact>
            </div>

        }

        let oldDate = '';
        let currentDate = '';
        if (i > 0) {
            oldDate = moment(new Date(messagesArray[i - 1].createAt.seconds * 1000), "YYYYMMDD").format("DD/MM/YYYY");
            currentDate = moment(new Date(messagesArray[i].createAt.seconds * 1000), "YYYYMMDD").format("DD/MM/YYYY");
        }
        let dateShow = ''
        if (i === 0) {
            dateShow = moment(new Date(messagesArray[0].createAt.seconds * 1000), "YYYYMMDD").format("DD/MM/YYYY");
        }
        if (oldDate != currentDate) {
            dateShow = currentDate
        }

        if (dateShow === moment().format("DD/MM/YYYY")) {
            dateShow = 'Today';
        }
        if (dateShow === moment().subtract(1, 'days').format("DD/MM/YYYY")) {
            dateShow = 'Yesterday';
        }

        return <div key={i}>
            <div className="chat__wrapper">

                <div className='text-center'>
                    {dateShow && <span className='chat-date'>{dateShow}</span>}
                </div>
                {(item.sendBy === userId) ?
                    <Fragment>
                        <div className=''>
                            <div className='Chat-time-wrapper left-chat'>
                                <div className="mx-2 chat-time">
                                    {(time) ? moment(new Date(time.seconds * 1000), "YYYYMMDD").format("hh:mm A") : ''}
                                </div>
                                <div className='chat__message chat__message-own' style={{
                                    margin: '3px 25px 5px 0'
                                }}>
                                    <div>{message}</div>
                                </div>

                            </div>
                            <div className='d-flex flex-row-reverse'>
                                <div className=''>
                                    <Image src={profileImg} className="rounded-circle user-image" alt="" height={40} width={40} />
                                </div>
                                <div className='m-2'>
                                    {name}
                                </div>
                            </div>
                        </div>
                    </Fragment>

                    :
                    <Fragment>
                        <div className=''>
                            <div className='Chat-time-wrapper right-chat'>

                                <div className='chat__message' style={{
                                    margin: '0 0 5px 26px'
                                }}
                                >
                                    <div>{message}</div>
                                </div>

                                <div className="mx-2 chat-time">
                                    {(time) ? moment(new Date(time.seconds * 1000), "YYYYMMDD").format("hh:mm A") : ''}
                                </div>
                            </div>
                            <div className='d-flex '>
                                <div className=''>
                                    <Image src={profileImg} className="rounded-circle user-image" alt="" height={40} width={40} />
                                </div>
                                <div className='m-2'>
                                    {name}
                                </div>
                            </div>
                        </div>
                    </Fragment>
                }

            </div>
        </div>

    })


    return (
        <Fragment>
            <div className="p-3">

                <div className="page-card-view">
                    <Row>
                        <Col span={4}>

                        </Col>
                        <Col span={16} className="call-chat-body">
                            <Card className="chat-card-open">
                                <CardBody className="p-0">
                                    <Row className="chat-box">
                                        <Col className="pr-0 chat-right-aside">
                                            {(oppositeUserData) ?
                                                <div className="">
                                                    <div className="chat-header clearfix">
                                                        <Media src={(oppositeUserData.profileImg) ? oppositeUserData.profileImg : thumb} className="rounded-circle" alt="" />
                                                        <div className="about pl-5">
                                                            <div className="name">
                                                                {oppositeUserData.userName}
                                                            </div>
                                                            {/* <div className="status digits" >
                                                                {'online'}
                                                            </div> */}
                                                        </div>
                                                        <div className="float-right">
                                                            <Button htmlType="button" className='my-reset-button' onClick={() => navigate(-1)}>
                                                                Return
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="chat">
                                                        {chatListingMessage}
                                                    </div>

                                                    <div className="">
                                                        {(oppositeUserData.name) ?
                                                            <Row>
                                                                <Col xl="12" className="d-flex">
                                                                    <Space.Compact
                                                                        style={{
                                                                            width: '100%',
                                                                        }}
                                                                    >
                                                                        <Input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Type a message......"
                                                                            value={messages}
                                                                            size="small"
                                                                            onChange={(e) => handleKeyword(e)}
                                                                            onKeyPress={(e) => {
                                                                                if (e.key === "Enter") {
                                                                                    handleMessagePress()
                                                                                }
                                                                            }}
                                                                        />
                                                                        <div className="pin-chat" onClick={showModal}>
                                                                            <FaPaperclip className="file-icon-select" />
                                                                        </div>
                                                                        <Button type="primary" className="send-Button-chat" onClick={() => handleMessagePress()}>
                                                                            <FaPaperPlane />
                                                                        </Button>
                                                                    </Space.Compact>
                                                                </Col>
                                                            </Row>
                                                            : ''}
                                                    </div>
                                                </div>
                                                : ''}
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col span={4}>

                        </Col>
                    </Row>
                </div>
            </div>
            <Modal title="" footer={''} open={isModalVisible} onCancel={handleCancel}>

                <div className="send-attech-button">
                    <Upload
                        name='files'
                        showUploadList={false}
                        action={process.env.REACT_APP_BASE_URL_LOCAL + url.image_upload + '?type=2'} //chat
                        multiple={false}
                        maxCount={1}
                        onChange={onChangeImage}
                        accept="image/*"
                    >
                        <img src={sendGallery} alt="imgData" className="send-attech-img" />
                    </Upload>
                </div>
                <div className="send-attech-button d-none">
                    <Upload
                        listType="picture"
                        name='files'
                        accept="video/mp4,video/x-m4v,video/*"
                        showUploadList={false}
                        action={process.env.REACT_APP_BASE_URL_LOCAL + url.upload_video + '?type=11'}
                        multiple={false}
                        maxCount={1}
                        onChange={onChangeVideo}
                    >
                        <img src={sendVideo} alt="Video data" className="send-attech-img" />
                    </Upload>
                </div>
                <div className="send-attech-button d-none">
                    <Upload
                        listType="picture"
                        accept="audio/mp3"
                        name='files'
                        showUploadList={false}
                        action={process.env.REACT_APP_BASE_URL_LOCAL + url.upload_video + '?type=12'}
                        multiple={false}
                        maxCount={1}
                        onChange={onChangeAudio}
                    >
                        <img src={sendAudio} alt="Audio data" className="send-attech-img" />
                    </Upload>
                </div>
                <div className="send-attech-button cursor-pointer d-none">
                    <img src={sendLocation} alt="Location data" className="send-attech-img" onClick={getLocation} />
                </div>

                <div className="send-attech-button cursor-pointer">
                    <img src={sendCapture} alt="Location data" className="send-attech-img" onClick={showCameraModal} />
                </div>
                <div className="send-attech-button cursor-pointer d-none">
                    <img src={sendRecord} alt="Location data" className="send-attech-img" onClick={showCameraVideoModal} />
                </div>

            </Modal>

            <Modal title="Camara Photo" footer={''} open={isCameraModalVisible} onCancel={handleCameraCancel}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    height={500}
                    width={500}
                />
                <button onClick={capture} className="btn btn-primary center">Capture photo</button>
            </Modal>
            <Modal title="Camara Video" footer={''} open={isCameraVideoModalVisible} onCancel={handleCameraVideoCancel}>
                <div className='p-1'>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        height={300}
                        width={300}
                    />
                    {capturing ? (
                        <Button type="primary" onClick={handleStopCaptureClick}>Stop Capture</Button>
                    ) : (
                        <Button type="primary" onClick={handleStartCaptureClick}>Start Capture</Button>
                    )}
                    {recordedChunks.length > 0 && (
                        <Button type="primary" onClick={handleDownload}>Download</Button>
                    )}

                </div>

            </Modal>
        </Fragment >
    );
}

export default Chat;
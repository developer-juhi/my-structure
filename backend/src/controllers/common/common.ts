import response from "../../helper/responseMiddleware";
import fs from "fs";
import aws from "../../helper/aws";
import jwt from "../../helper/jwt";
import mongoose from "mongoose";
import { Request, Response } from "express";
import Category from "../../models/category-model";
import ContactUs from "../../models/contactus-model";
import Admin from "../../models/admin-model";
import User from "../../models/user-model";
import Chat from "../../models/chat-model";
import { nonReSizeImage, reSizeImage } from "../../helper/sizeImage";
import Cms from "../../models/cms-model";
import Faq from "../../models/faq-model";
import SocialMedia from '../../models/social-media-model';
import OurContactUs from '../../models/our-contact-us-model';
import OtpModel from "../../models/otp-model";
import CommonFunction from "../../helper/commonFunction";
import ServiceType from "../../models/service-type-model";

const log4js = require("log4js");
const logger = log4js.getLogger();

const otpVerification = async (req: any, res: any) => {
    try {
        const { otp, token } = req.body;

        if (!token) {
            const sendResponse: any = {
                message: "token is not valid or missing",
            };
            return response.sendAuthError(res, sendResponse);
        }

        const clientData: any = await jwt.decode(token);

        const getOtp: any = await OtpModel.findOne({
            // user_id: new mongoose.Types.ObjectId(clientData.user_id),
            token: token,
        });

        const matchOtp: any = getOtp.otp == otp;

        if (!matchOtp) {
            const sendResponse: any = {
                message: "OTP is incorrect",
                data: {},
            };
            return response.sendAuthError(res, sendResponse);
        }

        const expired: any = new Date(clientData.expiry) <= new Date();

        if (expired) {
            const sendResponse: any = {
                message: "OTP is incorrect or Expired",
                data: {},
            };
            return response.sendAuthError(res, sendResponse);
        }

        const passwordResetToken: any = await jwt.sign({
            otp: otp,
            user_id: clientData.user_id,
            mobile_no: clientData.mobile_no,
        });

        // await OtpModel.findByIdAndUpdate(getOtp._id, {
        //     token: passwordResetToken,
        //     isVerified: true,
        //     isActive: false,
        // });

        await OtpModel.findByIdAndDelete(getOtp._id);

        const sendResponse: any = {
            // data: null,
            token: passwordResetToken,
            message: "OTP Verified",
            data: {}
        };

        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            // data: err.message,
            message: "OTP Expired",
        };
        return response.sendError(res, sendResponse);
    }
};

const uploadFiles = async (req: any, res: any) => {
    try {
        const imagePath = req.files[0].path;
        const blob = fs.readFileSync(imagePath);
        const originalFile = req.files[0].originalname;

        if (imagePath && blob) {
            let imageName = "file/" + Date.now() + originalFile;
            const uploadedImageData: any = await aws.uploadFileToS3(imageName, blob);

            fs.unlinkSync(req.files[0].path);
            const responseData: any = {
                data: {
                    url: uploadedImageData.Location,
                },
                message: "upload files successfully",
            };

            return response.sendResponse(res, responseData);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("uploadImage");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};
const uploadVideo = async (req: any, res: any) => {
    try {
        const imagePath = req.files[0].path;
        const type: number = req.query.type;
        const blob = fs.readFileSync(imagePath);
        const originalFile = req.files[0].originalname;
        if (imagePath && blob) {
            let imageName = "admin/" + Date.now() + originalFile;
            if (Number(type) === 11) {
                imageName = "chat/video/" + Date.now() + originalFile;
            }
            if (Number(type) === 12) {
                imageName = "chat/audio/" + Date.now() + originalFile;
            }
            const uploadedImageData: any = await aws.uploadFileToS3(imageName, blob);
            fs.unlinkSync(req.files[0].path);

            const responseData: any = {
                data: {
                    image_url: uploadedImageData.Location,
                },
                message: "upload video successfully",
            };

            return response.sendResponse(res, responseData);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("uploadImage");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};
const uploadImage = async (req: any, res: any) => {
    try {
        const imagePath = req.files[0].path;
        const type: number = req.query.type;
        const blob = fs.readFileSync(imagePath);
        const originalFile = req.files[0].originalname;
        if (imagePath && blob) {
            let imageName = "admin/" + Date.now() + originalFile;
            if (Number(type) === 1) {
                imageName = "admin/" + Date.now() + originalFile;
            }
            if (Number(type) === 2) {
                imageName = "chat/" + Date.now() + originalFile;
            }
            if (Number(type) === 3) {
                imageName = "customer/" + Date.now() + originalFile;
            }
            if (Number(type) === 4) {
                imageName = "vendor/" + Date.now() + originalFile;
            }
            if (Number(type) === 5) {
                imageName = "contact_us/" + Date.now() + originalFile;
            }
            if (Number(type) === 6) {
                imageName = "service_request/" + Date.now() + originalFile;
            }
            if (Number(type) === 7) {
                imageName = "bid_signature/" + Date.now() + originalFile;
            }
            if (Number(type) === 11) {
                imageName = "bid_photo/" + Date.now() + originalFile;
            }
            if (Number(type) === 8) {
                imageName = "our_services/" + Date.now() + originalFile;
            }
            if (Number(type) === 9) {
                imageName = "social_icon/" + Date.now() + originalFile;
            }
            if (Number(type) === 10) {
                imageName = "dispute/" + Date.now() + originalFile;
            }
            if (Number(type) === 11) {
                imageName = "accomplishment_report/" + Date.now() + originalFile;
            }
            if (Number(type) === 12) {
                imageName = "service_type/" + Date.now() + originalFile;
            }
            let comparessedImageData: any = await reSizeImage(blob, 400, 400);
            if(Number(type)===7){
             comparessedImageData = await nonReSizeImage(blob);
            }
            const uploadedImageData: any = await aws.uploadImageToS3(
                imageName,
                comparessedImageData
            );

            fs.unlinkSync(req.files[0].path);

            const responseData: any = {
                data: {
                    image_url: uploadedImageData.Location,
                },
                message: "upload image successfully",
            };

            return response.sendResponse(res, responseData);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("uploadImage");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};

const uploadImageMulti = async (req: any, res: any) => {
    try {
        let imgData: any = []
        req.files.map(async (val: any, i: number) => {
            const imagePath = req.files[i].path;
            const type: number = req.query.type;
            const blob = fs.readFileSync(imagePath);
            const originalFile = req.files[i].originalname;

            if (imagePath && blob) {
                let imageName = "admin/" + Date.now() + originalFile;
                if (Number(type) === 1) {
                    imageName = "admin/" + Date.now() + originalFile;
                }
                if (Number(type) === 2) {
                    imageName = "chat/" + Date.now() + originalFile;
                }
                if (Number(type) === 3) {
                    imageName = "customer/" + Date.now() + originalFile;
                }
                if (Number(type) === 4) {
                    imageName = "vendor/" + Date.now() + originalFile;
                }
                if (Number(type) === 5) {
                    imageName = "contact_us/" + Date.now() + originalFile;
                }
                if (Number(type) === 6) {
                    imageName = "service_request/" + Date.now() + originalFile;
                }
                if (Number(type) === 7) {
                    imageName = "bid_signature/" + Date.now() + originalFile;
                }
                if (Number(type) === 8) {
                    imageName = "our_services/" + Date.now() + originalFile;
                }
                if (Number(type) === 9) {
                    imageName = "social_icon/" + Date.now() + originalFile;
                }
                // const uploadedImageData: any = await aws.uploadImageToS3(imageName, blob);

                const comparessedImageData: any = await reSizeImage(blob, 400, 400);

                const uploadedImageData: any = await aws.uploadImageToS3(
                    imageName,
                    comparessedImageData
                );
                imgData.push(uploadedImageData.Location)
                fs.unlinkSync(req.files[i].path);
            }

            if (imgData.length === req.files.length) {
                const responseData: any = {
                    data: imgData,
                    message: "upload image successfully",
                };

                return response.sendResponse(res, responseData);
            }
        })


    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("upload Image Multipal ");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};
const getCategory = async (req: any, res: any) => {
    try {
        const categoryData: any = await Category.aggregate([
            CommonFunction.isActive(),
            {
                $project: {
                    _id: 1,
                    is_active: 1,
                    parent_id: 1,
                    name: 1,
                },
            },
        ]);

        const sendResponse: any = {
            message: process.env.APP_GET_MESSAGE,
            data: categoryData,
        };
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("get Category");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};
const GetActiveAdmin = async (req: any, res: any) => {
    try {
        const adminData: any = await Admin.aggregate([
            CommonFunction.isActive(),
            {
                $project: {
                    _id: 1,
                    first_name: 1,
                    last_name: 1,
                    user_name: 1,
                    mobile_no: 1,
                    email: 1,
                    profile_photo: 1,
                    location: 1,
                    is_active: 1,
                },
            },
        ]);

        const sendResponse: any = {
            message: process.env.APP_GET_MESSAGE,
            data: adminData,
        };
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("get GetActiveVendor");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};
const GetActiveVendor = async (req: any, res: any) => {
    try {
        const vendorData: any = await User.aggregate([
            CommonFunction.isActive(),

            {
                $project: {
                    _id: 1,
                    first_name: 1,
                    last_name: 1,
                    user_name: 1,
                    mobile_no: 1,
                    email: 1,
                    profile_photo: 1,
                    location: 1,
                    is_active: 1,
                },
            },
        ]);

        const sendResponse: any = {
            message: process.env.APP_GET_MESSAGE,
            data: vendorData,
        };
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("get GetActiveVendor");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};
const GetActiveCustomer = async (req: any, res: any) => {
    try {
        const customerData: any = await User.aggregate([
            CommonFunction.isActive(),
            {
                $project: {
                    _id: 1,
                    first_name: 1,
                    last_name: 1,
                    user_name: 1,
                    mobile_no: 1,
                    email: 1,
                    profile_photo: 1,
                    location: 1,
                    is_active: 1,
                },
            },
        ]);

        const sendResponse: any = {
            message: process.env.APP_GET_MESSAGE,
            data: customerData,
        };
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("get GetActiveVendor");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};

// *******************************************************************************************
// ================================= Store Record In Database =================================
// *******************************************************************************************

const getChat = async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        const { admin_id, vendor_id, user_id, type, search } = req.body;
        let filterText: object = {};
        if (Number(type) === 1) {
            filterText = {
                admin_id: new mongoose.Types.ObjectId(admin_id),
            };
        }
        if (Number(type) === 2) {
            filterText = {
                vendor_id: new mongoose.Types.ObjectId(vendor_id),
            };
        }
        if (Number(type) === 3) {
            filterText = {
                user_id: new mongoose.Types.ObjectId(user_id),
            };
        }

        if (search) {
            filterText = {
                ...filterText,
                $or: [
                    { "customerData.first_name": { $regex: `${search}`, $options: "i" } },
                    { "customerData.last_name": { $regex: `${search}`, $options: "i" } },
                    { "vendorData.first_name": { $regex: `${search}`, $options: "i" } },
                    { "vendorData.last_name": { $regex: `${search}`, $options: "i" } },
                    { "adminData.first_name": { $regex: `${search}`, $options: "i" } },
                    { "adminData.last_name": { $regex: `${search}`, $options: "i" } },
                ],
            };
        }


        const ChatStatus: any = await Chat.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "customerData",
                },
            },
            { $unwind: { path: "$customerData", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    localField: "vendor_id",
                    foreignField: "_id",
                    as: "vendorData",
                },
            },
            { $unwind: { path: "$vendorData", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "admins",
                    localField: "admin_id",
                    foreignField: "_id",
                    as: "adminData",
                },
            },
            { $unwind: { path: "$adminData", preserveNullAndEmptyArrays: true } },
            { $match: filterText },
            {
                $project: {
                    _id: 1,
                    admin_id: 1,
                    vendor_id: 1,
                    user_id: 1,
                    type: 1,
                    room_id: 1,
                    "customerData.first_name": 1,
                    "adminData.first_name": 1,
                    "vendorData.first_name": 1,
                    "customerData.last_name": 1,
                    "adminData.last_name": 1,
                    "vendorData.last_name": 1,
                    "customerData.profile_photo": 1,
                    "adminData.profile_photo": 1,
                    "vendorData.profile_photo": 1,
                    is_active: 1,
                    createdAt: 1,
                },
            },
        ]);

        await session.commitTransaction();
        await session.endSession();
        const responseData: any = {
            message: "Chat Joined",
            data: ChatStatus,
        };
        return response.sendSuccess(req, res, responseData);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("store chat Data");
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }
};

const storeContactUs = async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        const { email, name, mobile_no, message, user_id, images, location, subject } =
            req.body;
        let contactUsData: any = await new ContactUs();
        contactUsData.email = email;
        contactUsData.name = name;
        contactUsData.mobile_no = mobile_no;
        contactUsData.location = location;
        contactUsData.subject = subject;
        contactUsData.message = message;
        if (user_id) {
            contactUsData.user_id = new mongoose.Types.ObjectId(user_id);
        }
        contactUsData.images = JSON.stringify(images);

        await contactUsData.save();

        await session.commitTransaction();
        await session.endSession();
        const responseData: any = {
            message: "Thank you for contacting us",
            data: {},
        };
        return response.sendSuccess(req, res, responseData);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("store chat Data");
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }
};

const storeChat = async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        const { admin_id, vendor_id, user_id, type } = req.body;
        let filterText: object = {};
        // type
        // 1 admin and vendor chat
        // 2 admin and customer chat
        // 3 customer and customer chat
        // 4 customer and vendor chat
        if (Number(type) === 1) {
            filterText = {
                admin_id: new mongoose.Types.ObjectId(admin_id),
            };
        }
        if (Number(type) === 2) {
            filterText = {
                admin_id: new mongoose.Types.ObjectId(admin_id),
                vendor_id: new mongoose.Types.ObjectId(vendor_id),
            };
        }
        if (Number(type) === 3) {
            filterText = {
                admin_id: new mongoose.Types.ObjectId(admin_id),
                user_id: new mongoose.Types.ObjectId(user_id),
            };
        }
        if (Number(type) === 4) {
            filterText = {
                vendor_id: new mongoose.Types.ObjectId(vendor_id),
                user_id: new mongoose.Types.ObjectId(user_id),
            };
        }

        const chatFindData: any = await Chat.findOne(filterText).count();
        if (chatFindData <= 0) {
            const storeChatData = await new Chat();

            if (admin_id) {
                storeChatData.admin_id = new mongoose.Types.ObjectId(admin_id);
            }
            if (user_id) {
                storeChatData.user_id = new mongoose.Types.ObjectId(user_id);
            }
            if (vendor_id) {
                storeChatData.vendor_id = new mongoose.Types.ObjectId(vendor_id);
            }
            storeChatData.type = type;
            storeChatData.room_id = await CommonFunction.makeIdString(15);
            await storeChatData.save();
        }

        const chatData: any = await Chat.findOne(filterText);

        await session.commitTransaction();
        await session.endSession();
        const responseData: any = {
            message: "Chat Joined",
            data: chatData,
        };
        return response.sendSuccess(req, res, responseData);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("store chat Data");
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }
};

function replaceMulti(haystack: any, needle: any, replacement: any) {
    return haystack.split(needle).join(replacement);
}

const getCms = async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        let slug: any = req.query.slug;
        slug = slug.replace(
            /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|/gi,
            ""
        );
        slug = replaceMulti(slug, '-', '_')
        const cmsData: any = await Cms.aggregate([{ $match: { key: slug } }]);

        await session.commitTransaction();
        await session.endSession();
        const responseData: any = {
            message: "cms Get SuccessFully",
            data: cmsData[0],
        };
        return response.sendSuccess(req, res, responseData);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("getPost ");
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }
};

const getFaq = async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        const faqData: any = await Faq.aggregate([
            {
                $project: {
                    _id: 1,
                    question: 1,
                    answer: 1,
                    is_active: 1,
                },
            },
        ]);

        await session.commitTransaction();
        await session.endSession();
        const responseData: any = {
            message: "Faq Get SuccessFully",
            data: faqData,
        };
        return response.sendSuccess(req, res, responseData);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("get Faq ");
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }
};

const getSocialMedia = async (req: any, res: any) => {

    try {
        const socialMediaData: any = await SocialMedia.aggregate([
            {
                $project: {
                    _id: 1,
                    name: 1,
                    icon: 1,
                    value: 1
                },
            },
        ]);
        const sendResponse: any = {
            message: process.env.APP_GET_MESSAGE,
            data: socialMediaData,
        };
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("get assets uses");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};

const checkDataField = async (req: Request, res: Response) => {

    try {
        const { field, filed_value } = req.body;
        const userData: any = await User.aggregate([
            {
                $match: {
                    [field]: filed_value
                }
            },
            {
                $project: {
                    "_id": 1,
                    "first_name": 1,
                    "last_name": 1,
                    "user_name": 1,
                    "mobile_no": 1,
                    "email": 1,
                    "type": 1
                }
            },
        ]);

        if (userData.length === 0) {

            const sendResponse: any = {
                data: {},
                message: 'This ' + field + ' is available',
            };
            return response.sendSuccess(req, res, sendResponse);
        } else {
            const sendResponse: any = {
                message: 'This ' + field + ' is already registered ',
            };
            return response.sendError(res, sendResponse);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("field Checking api ");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }

};
const getOurContactUs = (async (req: Request, res: Response) => {
    try {
        const data: any = await OurContactUs.find();
        let fees_map: any = {};
        fees_map = await new Map(data.map((values: any) => [
            values.key, values.value
        ]));
        let feesMapArray: any = await Object.fromEntries(fees_map.entries());

        const sendResponse: any = {
            data: feesMapArray,
            message: "Our Contact Us get successfully",
        }
        return response.sendSuccess(req, res, sendResponse);

    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("Our Contact Us get");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
})

const getServiceType = async (req: any, res: any) => {
    try {
        const serviceTypeData: any = await ServiceType.aggregate([
            CommonFunction.isActive(),
            {
                $project: {
                    _id: 1,
                    is_active: 1,
                    name: 1,
                },
            },
        ]);

        const sendResponse: any = {
            message: process.env.APP_GET_MESSAGE,
            data: serviceTypeData,
        };
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("get ServiceType");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};


export default {
    uploadFiles,
    uploadImage,
    uploadVideo,
    getCategory,
    GetActiveAdmin,
    GetActiveVendor,
    GetActiveCustomer,
    storeChat,
    getChat,
    storeContactUs,
    getCms,
    getFaq,
    otpVerification,
    getSocialMedia,
    checkDataField,
    uploadImageMulti,
    getOurContactUs,
    getServiceType
};

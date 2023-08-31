import { Request, Response } from 'express';
import jwt from '../../helper/jwt';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import response from '../../helper/responseMiddleware';
import log4js from "log4js";
const logger = log4js.getLogger();
import Admin from '../../models/admin-model';
import AdminToken from '../../models/admin-token-model';
import User from '../../models/user-model';
import Category from '../../models/category-model';
import OtpModel from "../../models/otp-model";
import CommonFunction from "../../helper/commonFunction";
import moment from 'moment';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ============================================= Over Here Include Library =============================================
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const adminsDataGet = (async (id: any) => {
    const adminData: any = await Admin.findById(id).select("_id first_name last_name email role_id profile_photo")
    return adminData;
})
const login = (async (req: Request, res: Response) => {
    try {
        const { email, password, firebase_token } = req.body;
        const adminData: any = await Admin.findOne({
            email,
            deleted_by: null
        });
        if (adminData) {
            if (!adminData.password) {
                const sendResponse: any = {
                    message: "Invalid password",
                }
                return response.sendError(res, sendResponse);
            }
            const ispasswordmatch: any = await bcrypt.compare(password, adminData.password);
            if (!ispasswordmatch) {
                const sendResponse: any = {
                    message: "Invalid password",
                }
                return response.sendError(res, sendResponse);
            } else {
                const token: any = await jwt.sign({
                    email: email,
                    mobilenumber: adminData.mobile,
                    admin_id: adminData._id?.toString()
                });
                if (adminData && adminData._id) {
                    await AdminToken.create({
                        token: token,
                        firebase_token: firebase_token,
                        admin_id: adminData._id,
                    });
                }
                const sendData: any = await adminsDataGet(adminData._id);
                let AdminsData = sendData.toJSON();
                AdminsData['access_token'] = token;
                const sendResponse: any = {
                    data: AdminsData ? AdminsData : {},
                    message: "you are logged in successfully",
                }
                return response.sendSuccess(req, res, sendResponse);
            }
        } else {
            const sendResponse: any = {
                message: "The email or password is incorrect.",
            }
            return response.sendError(res, sendResponse);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("Login");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }

})

const changePassword = (async (req: Request, res: Response) => {
    try {
        const { old_password, password } = req.body;
        // @ts-ignore
        const admin_id = req?.admin?._id;
        const adminData: any = await Admin.findOne({
            _id: new mongoose.Types.ObjectId(admin_id)
        });
        if (adminData) {
            const isComparePassword: any = await bcrypt.compare(old_password, adminData.password);
            if (isComparePassword) {
                const passwordhash: any = await bcrypt.hash(password, Number(10));
                await Admin.findByIdAndUpdate(new mongoose.Types.ObjectId(admin_id), {
                    password: passwordhash,
                    updated_by: adminData.first_name,
                    updated_on: new Date()
                }, {
                    new: true
                })
                const sendResponse: any = {
                    message: "password changed successfully",
                }
                return response.sendSuccess(req, res, sendResponse);
            } else {
                const sendResponse: any = {
                    message: 'Oops, provide password is incorrect-+',
                }
                return response.sendError(res, sendResponse);
            }
        } else {
            const sendResponse: any = {
                message: 'Admin not found',
            }
            return response.sendError(res, sendResponse);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("change Password");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
})

const getProfile = (async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const admin_id = req?.admin?._id;
        const adminData: any = await Admin.findOne({
            _id: new mongoose.Types.ObjectId(admin_id)
        });
        const sendResponse: any = {
            data: adminData,
            message: 'get profile successfully',
        }
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("get Profile");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
})

const updateProfile = (async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, email, profile_photo, mobile_no } = req.body;
        // @ts-ignore
        const admin_id = req?.admin?._id;
        await Admin.findByIdAndUpdate(admin_id, {
            profile_photo: profile_photo,
            first_name: first_name,
            last_name: last_name,
            email: email,
            mobile_no: mobile_no
        });
        const adminData: any = await Admin.findOne({
            _id: new mongoose.Types.ObjectId(admin_id)
        });
        const sendResponse: any = {
            data: adminData,
            message: 'update profile successfully',
        }
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("update Profile");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
})

const logout = (async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const admin_id = req?.admin?._id;
        const token = req.headers['authorization']?.split(" ")[1];

        let getToken: any = await AdminToken.findOne({
            admin_id: new mongoose.Types.ObjectId(admin_id),
            token: token
        });

        if (getToken) {
            await AdminToken.deleteOne(new mongoose.Types.ObjectId(getToken._id.toString()), {
                is_active: false
            });
            const sendResponse: any = {
                message: 'logout Admin successfully',
            }
            return response.sendSuccess(req, res, sendResponse);
        } else {
            const sendResponse: any = {
                message: "Invalid token",
            }
            return response.sendError(res, sendResponse);
        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("Logout");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
})

const forgetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const admin: any = await Admin.findOne({ email: email });

        if (!admin) {
            const sendResponse: any = {
                message: "admin with given email doesn't exist",
            };
            return response.sendError(res, sendResponse);
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString(); //four digit otp

        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 10);

        const token = await jwt.sign({
            email: email,
            admin_id: admin._id,
            expiry: expiry,
        });


        await OtpModel.create([
            {
                otp: otp,
                token: token,
                admin_id: admin._id,
                is_active: true,
                expiry: expiry,
            },
        ]);


        logger.info("token");
        logger.info(token);

        try {
            let to: any = admin.email;
            let subject: any = process.env.APP_NAME + ' Reset Password Link';
            let template: any = 'forget-code-admin'
            let sendEmailTemplatedata: any = {
                name: admin.first_name + admin.last_name,
                token: token,
                app_name: process.env.APP_NAME,
                reset_button: process.env.ADMIN_LINK + 'reset-password/' + token,
            }

            let datta: any = {
                to: to,
                subject: subject,
                template: template,
                sendEmailTemplatedata: sendEmailTemplatedata
            }

            await CommonFunction.sendEmailTemplate(datta)
        } catch (err) {
            logger.info("Forget Password send email  ");
            logger.info(err);
        }

        // Email Services write down
        const sendResponse: any = {
            message: "Link sent on the registred Mail Id",
        };

        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        return response.sendError(res, sendResponse);
    }
};

const resetPassword = async (req: Request, res: Response) => {
    try {
        const { password, confirm_password, token } = req.body

        if (!token) {
            const sendResponse: any = {
                message: "token is not valid or missing",
            };
            return response.sendError(res, sendResponse);
        }

        const clientData: any = await jwt.decode(token);

        const expired = new Date(clientData.expiry) <= new Date();
        if (expired) {
            const sendResponse: any = {
                message: "Otp is not valid",
            };
            return response.sendError(res, sendResponse);
        }


        const passwordHash = await bcrypt.hash(password, Number(10));

        await Admin.findByIdAndUpdate(clientData.admin_id, {
            password: passwordHash,
        });

        const sendResponse: any = {
            message: "Password Successfully Changed",
            data: {}
        };

        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        return response.sendError(res, sendResponse);
    }
};



// Export default
export default {
    login,
    changePassword,
    getProfile,
    updateProfile,
    forgetPassword,
    resetPassword,
    logout
};

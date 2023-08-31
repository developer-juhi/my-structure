import { Request, Response } from 'express';
import mongoose from 'mongoose';
import response from '../../helper/responseMiddleware';
import log4js from "log4js";
const logger = log4js.getLogger();
import User from '../../models/user-model';
import bcrypt from 'bcrypt'
import uniqid from 'uniqid'

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ============================================= Over Here Include Library =============================================
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// *******************************************************************************************
// =========================== Get Data With Pagination And Filter ===========================
// *******************************************************************************************

const allFiled = [
    "_id",
    "first_name",
    "last_name",
    "user_name",
    "mobile_no",
    "email",
    "type",
    "profile_photo",
    "location",
    "date_of_birth",
    "password",
    "unique_id",
    "is_active",
    "email_is_active",
    "firebase_is_active",
    "current_commission",
    "commission_sing",
    "createdAt",
    "company_name",
    "upload_brochure",
    "serviceTypeData._id",
    "serviceTypeData.name",
]
let project: any = {}

const getAllFiled = async () => {
    await allFiled.map(function async(item: any) {
        project[item] = 1;
    })
}

getAllFiled();

const getAll = (async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        const userData: any = await User.aggregate([

            {
                $project: {
                    "_id": 1,
                    "first_name": 1,
                    "last_name": 1,
                    "user_name": 1,
                    "type": 1,
                    "mobile_no": 1,
                    "email": 1,
                    "profile_photo": 1,
                    "location": 1,
                    "is_active": 1,
                }
            },
        ]);
        const sendResponse: any = {
            'message': process.env.APP_GET_MESSAGE,
            'data': userData.length > 0 ? userData : {},
        };
        await session.commitTransaction();
        session.endSession();
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("User Data get");
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }

})
const get = (async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        const { per_page, page, sort_field, sort_direction, type } = req.query;
        let filterText: object = {
            type: type,
        };
        let filter: any = req.query.search;
        filter = filter.replace(" 91", "");
        filter = filter.replace("%", "");

        let filterTextValue: any = filter;
        let orders: any = {};
        let pageFind = page ? (Number(page) - 1) : 0;
        let perPage: number = per_page == undefined ? 10 : Number(per_page)
        if (sort_field) {
            orders[sort_field as string] = sort_direction == "ascend" ? 1 : -1;
        } else {
            orders = { 'createdAt': -1 };
        }

        if (filterTextValue) {
            let filterTextField: any = []
            await allFiled.map(function async(filed: any) {
                let filedData = {
                    [filed]: {
                        $regex: `${filterTextValue}`, $options: "i"
                    }
                }
                filterTextField.push(filedData);
            })

            filterText = {
                ...filterText,
                $or: filterTextField
            };

            if (mongoose.Types.ObjectId.isValid(filterTextValue)) {
                filterText = {
                    $or: [
                        { _id: new mongoose.Types.ObjectId(filterTextValue) },
                    ],
                }
            }
        }

        const userData: any = await User.aggregate([
            {
                $lookup: {
                    from: "service_types",
                    localField: "service_type_id",
                    foreignField: "_id",
                    as: "serviceTypeData",
                },
            },
            {
                $unwind: { path: "$serviceTypeData", preserveNullAndEmptyArrays: true },
            },
            { $project: project },
            { $match: filterText },
            { $sort: orders },
            {
                $facet: {
                    total: [{ $count: 'createdAt' }],
                    docs: [{ $addFields: { _id: '$_id' } }],
                },
            },
            { $unwind: '$total' },
            {
                $project: {
                    docs: {
                        $slice: ['$docs', perPage * pageFind, {
                            $ifNull: [perPage, '$total.createdAt']
                        }]
                    },
                    total: '$total.createdAt',
                    limit: { $literal: perPage },
                    page: { $literal: (pageFind + 1) },
                    pages: { $ceil: { $divide: ['$total.createdAt', perPage] } },
                },
            },
        ]);
        const sendResponse: any = {
            'message': process.env.APP_GET_MESSAGE,
            'data': userData.length > 0 ? userData[0] : {},
        };
        await session.commitTransaction();
        session.endSession();
        return response.sendSuccess(req, res, sendResponse);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("User Data get");
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }

})

// *******************************************************************************************
// ===================================== Delete Record  ======================================
// *******************************************************************************************

const destroy = (async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        await User.deleteMany({ _id: req.query.id, })
        const responseData: any = {
            'message': 'User record has been deleted',
            'data': {},
        };
        await session.commitTransaction();
        session.endSession();
        return response.sendSuccess(req, res, responseData);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("User destroy");
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }
})

// *******************************************************************************************
// =================================== Edit the Record Data ==================================
// *******************************************************************************************

const getData = (async (id: number) => {
    const userData: any = await User.aggregate([
        { $match: { "_id": new mongoose.Types.ObjectId(id) } },
        { $project: project },
    ]);
    return userData.length > 0 ? userData[0] : {};
});

const edit = (async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        let id: any = req.query.id;
        const responseData: any = {
            'message': 'User edit data get successfully',
            'data': await getData(id),
        };
        await session.commitTransaction();
        session.endSession();
        return response.sendSuccess(req, res, responseData);
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("User data has been get successfully");
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }
})

// *******************************************************************************************
// ================================= Change Status of Record =================================
// *******************************************************************************************

const changeStatus = (async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        let id: number = req.body.id;
        let status: string = req.body.status;
        const userData: any = await User.findOne({ _id: id });
        userData.is_active = status;
        await userData.save();
        const message: string = `User status ${(status === "true") ? 'Approved' : 'Rejected'} successfully`
        const responseData: any = {
            'message': message,
            'data': true,
        };
        await session.commitTransaction();
        session.endSession();
        return response.sendSuccess(req, res, responseData);

    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info(err.message);
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }
})


const changeStatusFirebase = (async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        let id: number = req.body.id;
        let status: string = req.body.status;
        const userData: any = await User.findOne({ _id: id });
        userData.firebase_is_active = status;
        await userData.save();
        const message: string = `User Firebase Notification status ${(status === "true") ? 'Approved' : 'Not Allowed'} successfully`
        const responseData: any = {
            'message': message,
            'data': true,
        };
        await session.commitTransaction();
        session.endSession();
        return response.sendSuccess(req, res, responseData);

    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info(err.message);
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }
})


const changeStatusEmail = (async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        let id: number = req.body.id;
        let status: string = req.body.status;
        const userData: any = await User.findOne({ _id: id });
        userData.email_is_active = status;
        await userData.save();
        const message: string = `User Email Notifcation status ${(status === "true") ? 'Allowed' : 'Not Allowed'} successfully`
        const responseData: any = {
            'message': message,
            'data': true,
        };
        await session.commitTransaction();
        session.endSession();
        return response.sendSuccess(req, res, responseData);

    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info(err.message);
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }
})
// *******************************************************************************************
// ================================= Store Record In Database =================================
// *******************************************************************************************

const store = (async (req: Request, res: Response) => {
    const session: any = await mongoose.startSession();
    session.startTransaction();
    try {
        let id: number = req.body.id;
        const {
            first_name,
            last_name,
            user_name,
            mobile_no,
            email,
            profile_photo,
            location,
            date_of_birth
        } = req.body;
        let userData: any = {}
        let message: any
        if (id) {
            userData = await User.findOne({ _id: id });
            message = 'User updated successfully';
        } else {
            userData = await new User();
            message = 'User added successfully';
            userData.unique_id = uniqid();
        }
        userData.first_name = first_name;
        userData.last_name = last_name;
        userData.user_name = user_name;
        userData.mobile_no = mobile_no;
        userData.email = email;
        userData.profile_photo = profile_photo;
        userData.location = location;
        userData.date_of_birth = date_of_birth;
        await userData.save();
        await session.commitTransaction();
        await session.endSession();
        const responseData: any = {
            'message': message,
            'data': await getData(userData._id),
        };
        return response.sendSuccess(req, res, responseData);

    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("store User Data");
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }
})

const changeUserPassword = async (req: Request, res: Response) => {
    try {
        const { user_id, password, updated_by } = req.body;
        // @ts-ignore
        // const user_id = req?.customer?._id;

        const userData: any = await User.findOne({
            _id: new mongoose.Types.ObjectId(user_id),
        });

        if (userData) {

            const passwordhash = await bcrypt.hash(password, Number(10));

            await User.findByIdAndUpdate(
                new mongoose.Types.ObjectId(user_id),
                {
                    password: passwordhash,
                    updated_by: updated_by,
                },
                {
                    new: true,
                }
            );

            const sendResponse: any = {
                message: "password changed successfully",
            };
            return response.sendSuccess(req, res, sendResponse);
        } else {
            const sendResponse: any = {
                message: "Oops, provide password is incorrect-+",
            };
            return response.sendError(res, sendResponse);

        }
    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        };
        logger.info("change Password");
        logger.info(err);
        return response.sendError(res, sendResponse);
    }
};

// Export default
export default {
    get,
    getAll,
    store,
    changeStatus,
    changeStatusFirebase,
    changeStatusEmail,
    edit,
    destroy,
    changeUserPassword
} as const;

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import response from '../../helper/responseMiddleware';
import log4js from "log4js";
const logger = log4js.getLogger();
import OurContactUs from '../../models/our-contact-us-model';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ============================================= Over Here Include Library =============================================
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// *******************************************************************************************
// =========================== Get Data With Pagination And Filter ===========================
// *******************************************************************************************
const get = (async (req: Request, res: Response) => {
    try {
        const data: any = await OurContactUs.find();
        let fees_map: any = {};
        fees_map = await new Map(data.map((values: any) => [
            values.key, values.value
        ]));
        let feesMapArray: any = await Object.fromEntries(fees_map.entries());

        const sendResponse: any = {
            data:  feesMapArray,
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


// *******************************************************************************************
// ================================= Store Record In Database =================================
// *******************************************************************************************

const store = (async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {
            contact_no,
            email,
            website,
            location,
            admin_email
        } = req.body;

        // await OurContactUs.create({ key: 'contact_no' ,value: contact_no });
        // await OurContactUs.create({ key: 'email', value: email });
        // await OurContactUs.create({ key: 'website',value: website });
        // await OurContactUs.create({ key: 'location', value: location });
        // await OurContactUs.create({key:'admin_email',value: admin_email })

        await OurContactUs.updateOne({ key: 'contact_no' }, { $set: { value: contact_no } });
        await OurContactUs.updateOne({ key: 'email' }, { $set: { value: email } });
        await OurContactUs.updateOne({ key: 'website' }, { $set: { value: website } });
        await OurContactUs.updateOne({ key: 'location' }, { $set: { value: location } });
        await OurContactUs.updateOne({key:'admin_email'},{ $set: { value: admin_email } })
        await session.commitTransaction();
        await session.endSession();
        
        const sendResponse: any = {
            'message': 'store Our Contact Us data successfully',
        };
        return response.sendSuccess(req, res, sendResponse);

    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("Our Contact Us data store in db");
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return response.sendError(res, sendResponse);
    }
})

// Export default
export default {
    get,
    store,
};

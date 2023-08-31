import { Request, Response } from 'express';
import mongoose from 'mongoose';
import response from '../../helper/responseMiddleware';
import log4js from "log4js";
const logger = log4js.getLogger();
import Cms from '../../models/cms-model';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ============================================= Over Here Include Library =============================================
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// *******************************************************************************************
// =========================== Get Data With Pagination And Filter ===========================
// *******************************************************************************************
const get = (async (req: Request, res: Response) => {
    try {
        const data: any = await Cms.find();
        let fees_map: any = {};
        fees_map = await new Map(data.map((values: any) => [
            values.key, values.value
        ]));
        let feesMapArray: any = await Object.fromEntries(fees_map.entries());

        const sendResponse: any = {
            data:  feesMapArray? feesMapArray:{},
            message: "Cms get successfully",
        }
        return response.sendSuccess(req, res, sendResponse);

    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("Cms get");
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
            about_us,
            who_we_are,
            terms_condition,
            privacy_policy,
            our_services,
            mission,
            brochure,
            vision,
        } = req.body;

        // await Cms.create({ key: 'about_us' ,value: about_us });
        // await Cms.create({ key: 'who_we_are' ,value: who_we_are });
        // await Cms.create({ key: 'terms_condition' ,value: terms_condition });
        // await Cms.create({ key: 'privacy_policy' ,value: privacy_policy });
        // await Cms.create({ key: 'our_services' ,value: our_services });
        // await Cms.create({ key: 'vision' ,value: vision });
        // await Cms.create({ key: 'mission' ,value: mission });
        // await Cms.create({ key: 'brochure' ,value: brochure });


        await Cms.updateOne({ key: 'about_us' }, { $set: { value: about_us } });
        await Cms.updateOne({ key: 'who_we_are' }, { $set: { value: who_we_are } });
        await Cms.updateOne({ key: 'terms_condition' }, { $set: { value: terms_condition } });
        await Cms.updateOne({ key: 'privacy_policy' }, { $set: { value: privacy_policy } });
        await Cms.updateOne({ key: 'our_services' }, { $set: { value: our_services } });
        await Cms.updateOne({ key: 'vision' }, { $set: { value: vision } });
        await Cms.updateOne({ key: 'mission' }, { $set: { value: mission } });
        await Cms.updateOne({ key: 'brochure' }, { $set: { value: brochure } });

        await session.commitTransaction();
        await session.endSession();
        const sendResponse: any = {
            'message': 'store Cms data successfully',
        };
        return response.sendSuccess(req, res, sendResponse);

    } catch (err: any) {
        const sendResponse: any = {
            message: err.message,
        }
        logger.info("Cms data store in db");
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

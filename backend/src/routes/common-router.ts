import { Router } from 'express';
import commonService from '../controllers/common/common';
import decMiddleware from "../helper/decryptData";

// Constants
const commonRouter = Router();
commonRouter.use(decMiddleware.DecryptedData);

commonRouter.get('/category', commonService.getCategory);
commonRouter.post('/admin-active', commonService.GetActiveAdmin);
commonRouter.post('/vendor-active', commonService.GetActiveVendor);
commonRouter.post('/customer-active', commonService.GetActiveCustomer);
commonRouter.get("/social-media-get", commonService.getSocialMedia);
commonRouter.post("/our-contact-us-get", commonService.getOurContactUs);
commonRouter.post('/service-type-active', commonService.getServiceType);


// Export default
export default commonRouter;

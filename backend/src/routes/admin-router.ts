import { Router } from "express";

import { authAdmin } from "../middleware/admin-guard";
import decMiddleware from "../helper/decryptData";

import authService from "../controllers/admin/auth";
import commonValidation from "../validation/common-validation";

import categoryService from "../controllers/admin/category";
import categoryValidation from "../validation/admin/category-validation";

import userService from "../controllers/admin/user";
import userValidation from "../validation/admin/user-validation";

import faqService from "../controllers/admin/faq";
import faqValidation from "../validation/admin/faq-validation";

import settingService from "../controllers/admin/setting";
import settingValidation from "../validation/admin/setting-validation";

import cmsService from "../controllers/admin/cms";
import cmsValidation from "../validation/admin/cms-validation";

import ourContactUsService from "../controllers/admin/ourContactUs";
import ourContactUsValidation from "../validation/admin/ourContactUs-validation";

import contactUsService from "../controllers/admin/contactUs";
import contactUsValidation from "../validation/admin/contactUs-validation";

import socialMediaService from "../controllers/admin/socialMedia";
import socialMediaValidation from "../validation/admin/socialMedia-validation";


// Constants
const adminRouter = Router();
adminRouter.use(decMiddleware.DecryptedData);
adminRouter.use(authAdmin);

adminRouter.post("/change-password", authService.changePassword);
adminRouter.post("/logout", authService.logout);
adminRouter.post("/profile-update", authService.updateProfile);
adminRouter.get("/profile", authService.getProfile);




// *******************************************************************************************
// ================================== Start Setting  Route =======================================
// *******************************************************************************************

adminRouter.get("/setting/get", settingService.get);
adminRouter.post("/setting/store", settingValidation.store, settingService.store);
adminRouter.get("/setting/edit-get", commonValidation.idRequiredQuery, settingService.edit);
adminRouter.delete("/setting/delete", commonValidation.idRequiredQuery, settingService.destroy);
adminRouter.post("/setting/change-status", commonValidation.idRequired, settingService.changeStatus);

// *******************************************************************************************
// ================================== End Setting  Route =========================================
// *******************************************************************************************



// *******************************************************************************************
// ================================== Start Socila Media  Route =======================================
// *******************************************************************************************

adminRouter.get("/social-media/get", socialMediaService.get);
adminRouter.post("/social-media/store", socialMediaValidation.store, socialMediaService.store);
adminRouter.get("/social-media/edit-get", commonValidation.idRequiredQuery, socialMediaService.edit);
adminRouter.delete("/social-media/delete", commonValidation.idRequiredQuery, socialMediaService.destroy);
adminRouter.post("/social-media/change-status", commonValidation.idRequired, socialMediaService.changeStatus);

// *******************************************************************************************
// ================================== End Socila Media  Route =========================================
// *******************************************************************************************

// *******************************************************************************************
// ================================== Start Faqs Route =======================================
// *******************************************************************************************

adminRouter.get("/faq/get", faqService.get);
adminRouter.post("/faq/store", faqValidation.store, faqService.store);
adminRouter.get("/faq/edit-get", commonValidation.idRequiredQuery, faqService.edit);
adminRouter.delete("/faq/delete", commonValidation.idRequiredQuery, faqService.destroy);
adminRouter.post("/faq/change-status", commonValidation.idRequired, faqService.changeStatus);

// *******************************************************************************************
// ================================== End Faqs Route =========================================
// *******************************************************************************************

// *******************************************************************************************
// ================================== Start category Route =======================================
// *******************************************************************************************

adminRouter.get("/category/get", categoryService.get);
adminRouter.post("/category/store", categoryValidation.store, categoryService.store);
adminRouter.get("/category/edit-get", commonValidation.idRequiredQuery, categoryService.edit);
adminRouter.delete("/category/delete", commonValidation.idRequiredQuery, categoryService.destroy);
adminRouter.post("/category/change-status", commonValidation.idRequired, categoryService.changeStatus);

// *******************************************************************************************
// ================================== End category Route =========================================
// *******************************************************************************************

// *******************************************************************************************
// ================================== Start customer Route =======================================
// *******************************************************************************************

adminRouter.get("/user/getAll", userService.getAll);
adminRouter.get("/user/get", userService.get);
adminRouter.post("/user/store", userValidation.store, userService.store);
adminRouter.get("/user/edit-get", commonValidation.idRequiredQuery, userService.edit);
adminRouter.delete("/user/delete", commonValidation.idRequiredQuery, userService.destroy);
adminRouter.post("/user/change-status", commonValidation.idRequired, userService.changeStatus);
adminRouter.post("/user/change-status-firebase", commonValidation.idRequired, userService.changeStatusFirebase);
adminRouter.post("/user/change-status-email", commonValidation.idRequired, userService.changeStatusEmail);


// *******************************************************************************************
// ================================== End customer Route =========================================
// *******************************************************************************************

// *******************************************************************************************
// ================================== Start setting Route =======================================
// *******************************************************************************************

adminRouter.get("/setting/get", settingService.get);
adminRouter.post("/setting/store", settingValidation.store, settingService.store);

// *******************************************************************************************
// ================================== End setting Route =========================================
// *******************************************************************************************

// *******************************************************************************************
// ================================== Start cms Route =======================================
// *******************************************************************************************

adminRouter.get("/cms/get", cmsService.get);
adminRouter.post("/cms/store", cmsValidation.store, cmsService.store);

// *******************************************************************************************
// ================================== End cms Route =========================================
// *******************************************************************************************

// *******************************************************************************************
// ================================== Start our-contact-us Route =======================================
// *******************************************************************************************

adminRouter.get("/our-contact-us/get", ourContactUsService.get);
adminRouter.post("/our-contact-us/store", ourContactUsValidation.store, ourContactUsService.store);

// *******************************************************************************************
// ================================== End our-contact-us Route =========================================
// *******************************************************************************************

// *******************************************************************************************
// ================================== Start contact_us Route =======================================
// *******************************************************************************************

adminRouter.get("/contact-us/get", contactUsService.get);
adminRouter.post("/contact-us/store", contactUsValidation.store, contactUsService.store);
adminRouter.get("/contact-us/edit-get", commonValidation.idRequiredQuery, contactUsService.edit);
adminRouter.delete("/contact-us/delete", commonValidation.idRequiredQuery, contactUsService.destroy);
adminRouter.post("/contact-us/change-status", commonValidation.idRequired, contactUsService.changeStatus);

// *******************************************************************************************
// ================================== End contact_us Route =========================================
// *******************************************************************************************

// Export default
export default adminRouter;

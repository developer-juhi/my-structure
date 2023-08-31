import { Router } from "express";
import decMiddleware from "../helper/decryptData";
import customerValidation from "../validation/customer/auth-validation";
import commonValidation from "../validation/common-validation";
import settingService from "../controllers/admin/setting";
import authAdminService from "../controllers/admin/auth";
import authCustomerService from "../controllers/customer/auth";
import commonService from "../controllers/common/common";
import authValidation from "../validation/admin/auth-validation"
import userAuthValidation from "../validation/customer/auth-validation"
import contactValidation from '../validation/customer/contactUs-validation'
// Constants
const noAuthRouter = Router();
noAuthRouter.use(decMiddleware.DecryptedData);

noAuthRouter.post("/admin/login", authValidation.login, authAdminService.login);
noAuthRouter.post("/admin/forget-password", authValidation.emailValidation, authAdminService.forgetPassword);
noAuthRouter.post("/admin/reset-password", authValidation.resetPassword, authAdminService.resetPassword);

// Customer NOAuth Route Start
noAuthRouter.post("/user/login", customerValidation.login, authCustomerService.login);
noAuthRouter.post("/user/register", customerValidation.register, authCustomerService.register);
// noAuthRouter.post("/user/register",authCustomerService.register)
noAuthRouter.post("/user/forget-password", userAuthValidation.emailValidation, authCustomerService.forgetPassword);
noAuthRouter.post("/user/reset-password", userAuthValidation.resetPassword, authCustomerService.resetPassword);

noAuthRouter.post("/user/verify-phone", userAuthValidation.verifyMobileNumber, authCustomerService.mobileVerification);
// Common
noAuthRouter.get("/setting/get", settingService.get);
noAuthRouter.post("/verify-otp", userAuthValidation.verifyOtp, commonService.otpVerification);
noAuthRouter.post("/chat-store", commonValidation.storeChat, commonService.storeChat);
noAuthRouter.post("/chat-get", commonService.getChat);
noAuthRouter.get("/faq-get", commonService.getFaq);

noAuthRouter.post("/contact-us", contactValidation.store, commonService.storeContactUs);
noAuthRouter.get("/cms", commonService.getCms);

// Export default
export default noAuthRouter;

import { Router } from "express";
import { authUser } from "../middleware/user-guard";
import decMiddleware from "../helper/decryptData";


import authService from "../controllers/customer/auth";
import authValidation from "../validation/customer/auth-validation";


// Constants
const customerRouter = Router();
customerRouter.use(decMiddleware.DecryptedData);
customerRouter.use(authUser);

customerRouter.post("/change-password", authValidation.changePassword, authService.changePassword);
customerRouter.post("/logout", authService.logout);
customerRouter.post("/profile-update", authValidation.profile, authService.updateProfile);
customerRouter.get("/profile", authService.getProfile);
customerRouter.post("/notification", authService.getNotification);
customerRouter.get("/notification/count", authService.getCountNotification);
customerRouter.get("/notification/read", authService.readNotification);


// Export default
export default customerRouter;

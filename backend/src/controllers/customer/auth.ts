import { Request, Response } from "express";
import jwt from "../../helper/jwt";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import response from "../../helper/responseMiddleware";
import log4js from "log4js";
const logger = log4js.getLogger();
import User from "../../models/user-model";
import UserToken from "../../models/user-token-model";
import OtpModel from "../../models/otp-model";
import Notification from "../../models/notification-model";
import CommonFunction from "../../helper/commonFunction";
const stripe = require('stripe')(process.env.STRIPE_KEY);
import FirebaseFunction from '../../helper/firebase';
import uniqid from 'uniqid';
import moment from 'moment'

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ============================================= Over Here Include Library =============================================
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const userDataGet = async (id: any) => {
	const userData: any = await User.findById(id).select(
		"_id first_name last_name email role_id profile_photo user_name type mobile_no date_of_birth location service_type_id company_name upload_brochure"
	);
	return userData ? userData : {};
};

const register = async (req: Request, res: Response) => {
	try {

		const {
			email,
			first_name,
			last_name,
			type,
			user_name,
			date_of_birth,
			password,
			location,
			profile_photo,
			firebase_token,
			service_type_id,
			company_name,
			token
		} = req.body;
		const passwordHash = await bcrypt.hash(password, Number(10));

		if (!token) {
			const sendResponse: any = {
				message: "token is not valid or missing",
			};
			return response.sendError(res, sendResponse);
		}

		const clientData: any = await jwt.decode(token);
		if (!clientData.mobile_no) {
			const sendResponse: any = {
				message: "token is not valid or missing",
			};
			return response.sendError(res, sendResponse);
		}
		// const userFound = User.findOne({mobile_no:clientData.mobile_no})

		// const userData: any = await User.findOneAndUpdate({
		// 	mobile_no: clientData.mobile_no
		// }, {
		// 	unique_id: uniqid(),
		// 	first_name: first_name,
		// 	last_name: last_name,
		// 	user_name: user_name,
		// 	type: type,
		// 	email: email,
		// 	profile_photo: profile_photo,
		// 	location: location,
		// 	date_of_birth: date_of_birth,
		// 	password: passwordHash,
		// 	is_verified: true,

		// });
		let updateData: any = {
			unique_id: uniqid(),
			profile_photo: profile_photo,
			first_name: first_name,
			last_name: last_name,
			user_name: user_name,
			type: type,
			email: email,
			date_of_birth: date_of_birth,
			location: location,
			password: passwordHash,
			is_verified: true,
		}

		if (Number(type) === 2) {
			updateData.company_name = company_name;
			updateData.service_type_id = new mongoose.Types.ObjectId(service_type_id);
		}
		const userData: any = await User.findOneAndUpdate({ mobile_no: clientData.mobile_no }, updateData);



		let balance: any = 0;
		const customerInStripe = await stripe.customers.create({
			description: 'Create New Customer ' + email,
			balance: balance,
			email: email,
			name: first_name + last_name,
			phone: clientData.mobile_no,
		});

		userData.stripe_user_id = customerInStripe.id;
		userData.stripe_payload = JSON.stringify(customerInStripe);
		userData.wallet_amount = balance;
		userData.save()

		const tokenLogin = await jwt.sign({
			email: email,
			mobilenumber: userData.mobile,
			user_id: userData._id?.toString(),
		});

		if (userData && userData._id) {
			await UserToken.create({
				token: tokenLogin,
				firebase_token: firebase_token,
				user_id: userData._id,
			});
		}
		let userName = 'user'
		if (Number(type) === 2) {
			userName = 'Service Provider'
		}

		// if (userData && userData._id) {

		// 	if (userData) {
		// 		// start here Push 
		// 		let pushTitle: any = first_name + last_name + ' register successfully';
		// 		let message: any = 'new' + userName + 'registered successfully';
		// 		let payload: any = userData;

		// 		await Notification.create({
		// 			user_id: userData._id,
		// 			title: pushTitle,
		// 			message: message,
		// 			payload: JSON.stringify(payload),
		// 		})
		// 		const userNotification = await User.findOne({
		// 			_id: new mongoose.Types.ObjectId(userData._id)
		// 		});
		// 		let getToken: any = (await UserToken.find({
		// 			user_id: new mongoose.Types.ObjectId(userData._id)
		// 		})).map(value => value.firebase_token);
		// 		if (userNotification && userNotification.firebase_is_active) {
		// 			try {

		// 				let dataStore: any = getToken;

		// 				let notificationData = {
		// 					"type": 1,
		// 					"title": pushTitle,
		// 					"message": message,
		// 					"extraData": JSON.stringify(payload),
		// 					"updatedAt": new Date().toString(),
		// 				};
		// 				let fcmData: any = {
		// 					"subject": pushTitle,
		// 					"content": message,
		// 					"data": notificationData,
		// 					"image": ""
		// 				};

		// 				let token: any = dataStore

		// 				await FirebaseFunction.sendPushNotification(token, fcmData)
		// 			}
		// 			catch (err) {
		// 				logger.info("sendPushNotification");
		// 				logger.info(err);
		// 			}
		// 		}
		// 	}
		// 	// end here push 

		// }

		const sendData: any = await userDataGet(userData._id);
		let customersData = sendData.toJSON();
		customersData["access_token"] = tokenLogin;

		const sendResponse: any = {
			data: customersData,
			message: "you are Registerd successfully",
		};
		return response.sendSuccess(req, res, sendResponse);
	} catch (err: any) {
		const sendResponse: any = {
			message: err.message,
		};
		return response.sendError(res, sendResponse);
	}
};

const forgetPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		const user: any = await User.findOne({ email: email });

		if (!user) {
			const sendResponse: any = {
				message: "user with given email doesn't exist",
			};
			return response.sendError(res, sendResponse);
		}

		const otp = Math.floor(1000 + Math.random() * 9000).toString(); //four digit otp

		const expiry = new Date();
		expiry.setMinutes(expiry.getMinutes() + 10);

		const token = await jwt.sign({
			email: email,
			user_id: user._id,
			expiry: expiry,
		});

		await OtpModel.create([
			{
				otp: otp,
				token: token,
				user_id: user._id,
				is_active: true,
				expiry: expiry,
			},
		]);

		try {
			let message: any = process.env.APP_NAME + " is your Otp  " + otp;
			//start  send email
			await CommonFunction.smsGatway(user.mobile_no, message);
		} catch (err) {
			logger.info("EmailwithMessage");
			logger.info(err);
		}


		try {
			let to: any = user.email;
			let subject: any = process.env.APP_NAME + ' Forgot Password Otp';
			let template: any = 'customer-forget-password'
			let sendEmailTemplatedata: any = {
				name: user.first_name + user.last_name,
				otp: otp,
				app_name: process.env.APP_NAME,
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
			data: {
				token: token,
				otp: otp,
			},
			message: "Otp sent on the registred Email Address",
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
				message: "OTP is incorrect",
			};
			return response.sendError(res, sendResponse);
		}


		const passwordHash = await bcrypt.hash(password, Number(10));

		await User.findByIdAndUpdate(clientData.user_id, {
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

const login = async (req: Request, res: Response) => {
	try {
		const { email, password, firebase_token } = req.body;

		const userData: any = await User.findOne({
			$or: [{ 'email': email }, { 'user_name': email }],
			deleted_by: null,
		});

		if (userData) {
			if (!userData.password) {
				const sendResponse: any = {
					message: "Invalid password",
				};
				return response.sendError(res, sendResponse);
			}

			if (!userData.is_active) {
				const sendResponse: any = {
					message: "your account is blocked please contact to admin",
				};
				return response.sendError(res, sendResponse);
			}


			const ispasswordmatch = await bcrypt.compare(
				password,
				userData.password
			);

			if (!ispasswordmatch) {
				const sendResponse: any = {
					message: "Wrong Password",
				};
				return response.sendError(res, sendResponse);
			} else {
				const token = await jwt.sign({
					email: userData.email,
					mobilenumber: userData.mobile,
					user_id: userData._id?.toString(),
				});

				if (userData && userData._id) {
					await UserToken.create({
						token: token,
						firebase_token: firebase_token,
						user_id: userData._id,
					});
				}

				const sendData: any = await userDataGet(userData._id);

				let customersData = sendData.toJSON();
				customersData["access_token"] = token;
				const sendResponse: any = {
					data: customersData ? customersData : {},
					message: "you are logged in successfully",
				};
				return response.sendSuccess(req, res, sendResponse);
			}
		} else {
			const sendResponse: any = {
				message: "The username or email or password is incorrect.",
			};
			return response.sendError(res, sendResponse);
		}
	} catch (err: any) {
		const sendResponse: any = {
			message: err.message,
		};
		logger.info("Login");
		logger.info(err);
		return response.sendError(res, sendResponse);
	}
};

const changePassword = async (req: Request, res: Response) => {
	try {
		const { old_password, password } = req.body;
		// @ts-ignore
		const user_id = req?.user?._id;
		const userData: any = await User.findOne({
			_id: new mongoose.Types.ObjectId(user_id),
		});

		if (userData) {
			const isComparePassword = await bcrypt.compare(
				old_password,
				userData.password
			);
			if (isComparePassword) {
				const passwordhash = await bcrypt.hash(password, Number(10));

				await User.findByIdAndUpdate(
					new mongoose.Types.ObjectId(user_id),
					{
						password: passwordhash,
						updated_by: userData.first_name,
						updated_on: new Date(),
					},
					{
						new: true,
					}
				);

				const sendResponse: any = {
					message: "password changed successfully",
					data: {}
				};
				return response.sendSuccess(req, res, sendResponse);
			} else {
				const sendResponse: any = {
					message: "oops, old password is incorrect",
				};
				return response.sendError(res, sendResponse);
			}
		} else {
			const sendResponse: any = {
				message: "Admin not found",
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

const readNotification = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const user_id = req?.user?._id;
		await Notification.updateMany({
			"user_id": new mongoose.Types.ObjectId(user_id)
		}, {
			is_read: true,
		});

		const sendResponse: any = {
			data: {},
			message: "read all notification successfully",
		};
		return response.sendSuccess(req, res, sendResponse);
	} catch (err: any) {
		const sendResponse: any = {
			message: err.message,
		};
		logger.info("read notification");
		logger.info(err);
		return response.sendError(res, sendResponse);
	}
};
const getCountNotification = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const user_id = req?.user?._id;

		const notificationData: any = await Notification.count([
			{ $match: { user_id: new mongoose.Types.ObjectId(user_id) } },
		]);
		const sendResponse: any = {
			data: (notificationData.length) > 0 ? notificationData : {},
			message: "get count notification successfully",
		};
		return response.sendSuccess(req, res, sendResponse);
	} catch (err: any) {
		const sendResponse: any = {
			message: err.message,
		};
		logger.info("get count notification");
		logger.info(err);
		return response.sendError(res, sendResponse);
	}
};
const getNotification = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const user_id = req?.user?._id;
		const { page, per_page } = req.body;
		let perPage: any = per_page == undefined ? 10 : Number(per_page)
		let skipPage: any = (page && page > 0) ? (Number(Number(page-1)) * Number(perPage)) : 0;
		let filterText: object = {}

		filterText = {
			user_id: new mongoose.Types.ObjectId(user_id),
		};

		let countData = await Notification.count(filterText);

		const notificationData: any = await Notification.aggregate([
			{
				$lookup: {
					from: "users",
					localField: "user_id",
					foreignField: "_id",
					as: "userData",
				},
			},
			{ $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
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
					user_id: 1,
					type: 1,
					title: 1,
					message: 1,
					notification: 1,
					is_active: 1,
					createdAt: 1,
					// payload:1,
					"userData.first_name": 1,
					"userData.last_name": 1,
					"userData.profile_photo": 1,
					createdAtFormatted: {
						$dateToString: { format: "%d/%m/%Y", date: "$createdAt" },
					},
				},
			},
			{ $sort: { 'createdAt': -1 } },
			{ $skip: parseInt(skipPage) },
			{ $limit: parseInt(perPage) },
          
		]);
		const sendResponse: any = {
			data: {
				data: notificationData,
				total: countData,
			},
			message: "get notification successfully",
		};
		return response.sendSuccess(req, res, sendResponse);
	} catch (err: any) {
		const sendResponse: any = {
			message: err.message,
		};
		logger.info("get notification");
		logger.info(err);
		return response.sendError(res, sendResponse);
	}
};

const getProfile = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const user_id = req?.user._id;

		const sendResponse: any = {
			data: await userDataGet(user_id),
			message: "get profile successfully",
		};
		return response.sendSuccess(req, res, sendResponse);
	} catch (err: any) {
		const sendResponse: any = {
			message: err.message,
		};
		logger.info("get Profile");
		logger.info(err);
		return response.sendError(res, sendResponse);
	}
};

const updateProfile = async (req: Request, res: Response) => {
	try {
		const {
			first_name,
			last_name,
			email,
			profile_photo,
			user_name,
			date_of_birth,
			mobile_no,
			location,
			company_name,
			upload_brochure,
			service_type_id,
		} = req.body;

		// @ts-ignore
		const user_id = req?.user?._id;
		// @ts-ignore
		const type = req?.user?.type;

		let updateData: any = {
			profile_photo: profile_photo,
			first_name: first_name,
			last_name: last_name,
			user_name: user_name,
			email: email,
			date_of_birth: date_of_birth,
			location: location,
			mobile_no: mobile_no,
		}

		if (Number(type) === 2) {
			updateData.upload_brochure = upload_brochure;
			updateData.company_name = company_name;
			updateData.service_type_id = new mongoose.Types.ObjectId(service_type_id);
		}
		await User.findByIdAndUpdate(user_id, updateData);

		const userData = await userDataGet(user_id);

		const sendResponse: any = {
			data: userData ? userData : {},
			message: "update profile successfully",
		};
		return response.sendSuccess(req, res, sendResponse);
	} catch (err: any) {
		const sendResponse: any = {
			message: err.message,
		};
		logger.info("update Profile");
		logger.info(err);
		return response.sendError(res, sendResponse);
	}
};

const logout = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const user_id = req?.user?._id;
		const token = req.headers["authorization"]?.split(" ")[1];
		let getToken: any = await UserToken.findOne({
			user_id: new mongoose.Types.ObjectId(user_id),
			token: token,
		});

		if (getToken) {
			await UserToken.deleteOne(
				new mongoose.Types.ObjectId(getToken._id.toString()),
				{
					is_active: false,
				}
			);

			const sendResponse: any = {
				message: "logout successfully",
				data: {}
			};
			return response.sendSuccess(req, res, sendResponse);
		} else {
			const sendResponse: any = {
				message: "Invalid token",
			};
			return response.sendError(res, sendResponse);
		}
	} catch (err: any) {
		const sendResponse: any = {
			message: err.message,
		};
		logger.info("Logout");
		logger.info(err);
		return response.sendError(res, sendResponse);
	}
};

const mobileVerification = async (req: any, res: any) => {
	try {
		const { mobile_no } = req.body;

		const user: any = await User.findOne({ mobile_no: mobile_no });
		const otp = Math.floor(1000 + Math.random() * 9000).toString(); //four digit otp

		console.log(otp)
		if (user) {
			if (user.is_verified) {
				const sendResponse: any = {
					message: "User With This Mobile Already Exist",
					data: {}
				};
				return response.sendError(res, sendResponse);
			}
		} else {

			try {
				let message: any = process.env.APP_NAME + " is your Otp  " + otp;
				//start  send email

				const smsGatwayData = await CommonFunction.smsGatway(mobile_no, message);
				// if (smsGatwayData === false) {

				// 	const sendResponse: any = {
				// 		message: `The number ${mobile_no} is not a valid phone number`,
				// 	};
				// 	return response.sendError(res, sendResponse);
				// }
			} catch (err) {
				logger.info("EmailwithMessage");
				logger.info(err);
			}
			await User.create({ mobile_no: mobile_no })
		}




		const expiry = new Date();
		expiry.setMinutes(expiry.getMinutes() + 10);

		const token = await jwt.sign({
			mobile_no: mobile_no,
			expiry: expiry,
		});

		await OtpModel.create([
			{
				otp: otp,
				token: token,
				isActive: true,
				expiry: expiry,
			},
		]);

		console.log('otp',otp)

		const sendResponse: any = {
			data: {
				token: token,
				otp: otp,
			},
			message: "Otp sent on the registred Phone",
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
	register,
	forgetPassword,
	resetPassword,
	getNotification,
	login,
	changePassword,
	getProfile,
	updateProfile,
	logout,
	mobileVerification,
	getCountNotification,
	readNotification,
};

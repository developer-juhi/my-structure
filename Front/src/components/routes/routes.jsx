// import ErrorPage from "../pages/view/ErrorPage";
import Logout from "../pages/view/Logout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/view/Login";
import ResetPassword from "../pages/view/ResetPassword";
import ChangePassword from "../pages/view/ChangePassword";
import Profile from "../pages/view/Profile";

import Customer from "../pages/view/customer/Index";
import CustomerForm from "../pages/view/customer/PageForm";

import Vendor from "../pages/view/vendor/Index";
import VendorForm from "../pages/view/vendor/PageForm";

import Category from "../pages/view/category/Index";
import CategoryForm from "../pages/view/category/PageForm";

import Faq from "../pages/view/faq/Index";
import FaqForm from "../pages/view/faq/PageForm";

import SocialMedia from "../pages/view/socialMedia/Index";
import SocialMediaForm from "../pages/view/socialMedia/PageForm";

import Settings from "../pages/view/settings/Index";
import SettingsForm from "../pages/view/settings/PageForm";

import ContactUs from "../pages/view/contactUs/Index";
// import Setting from "../pages/view/setting/Index";
import Cms from "../pages/view/cms/Index";
import OurContactUs from "../pages/view/ourContactUs/Index";
import Chat from "../pages/view/chat/Index";
import ChatDetail from "../pages/view/chat/detail";
const routes = [
    

    {
        path: "/chat",
        exact: true,
        auth: true,
        component: <Chat title="Chat" />
    },
    {
        path: "/chat-detail",
        exact: true,
        auth: true,
        permission: [1, 2], // 1 for customer 2 for service providers
        layout: 2,
        component: <ChatDetail title="Chat Detail" />
    },
    {
        path: "/setting",
        exact: true,
        auth: true,
        component: <Settings title="Setting" />
    },
    {
        path: "/setting/form",
        exact: true,
        auth: true,
        component: <SettingsForm title="Setting Form" />
    },

    {
        path: "/our-contact-us",
        exact: true,
        auth: true,
        component: <OurContactUs title="Our Contact Us" />
    },

    {
        path: "/cms",
        exact: true,
        auth: true,
        component: <Cms title="CMS" />
    },

    {
        path: "/contact-us",
        exact: true,
        auth: true,
        component: <ContactUs title="Contact Us" />
    },

    
    {
        path: "/faq",
        exact: true,
        auth: true,
        component: <Faq title="Faqs" />
    },
    {
        path: "/faq/form",
        exact: true,
        auth: true,
        component: <FaqForm title="Faqs Form" />
    },
    {
        path: "/social-media",
        exact: true,
        auth: true,
        component: <SocialMedia title="Social Media" />
    },
    {
        path: "/social-media/form",
        exact: true,
        auth: true,
        component: <SocialMediaForm title="Social Media Form" />
    },

  
    {
        path: "/category",
        exact: true,
        auth: true,
        component: <Category title="Category" />
    },
    {
        path: "/category/form",
        exact: true,
        auth: true,
        component: <CategoryForm title="Category Form" />
    },
    {
        path: "/customer",
        exact: true,
        auth: true,
        component: <Customer title="Customer" />
    },
    {
        path: "/customer/form",
        exact: true,
        auth: true,
        component: <CustomerForm title="Customer Form" />
    },
   
    {
        path: "/vendor",
        exact: true,
        auth: true,
        component: <Vendor title="Vendor" />
    },
    {
        path: "/vendor/form",
        exact: true,
        auth: true,
        component: <VendorForm title="Vendor Form" />
    },


    {
        path: "/logout",
        exact: true,
        auth: true,
        component: <Logout title="Logout" />
    },
    {
        path: "/profile",
        exact: true,
        auth: true,
        component: <Profile title="Profile" />
    },
    {
        path: "/change-password",
        exact: true,
        auth: true,
        component: <ChangePassword title="Change Password" />
    },
    {
        path: "/dashboard",
        exact: true,
        auth: true,
        component: <Dashboard title="Dashboard" />
    },
    {
        path: "/login",
        exact: true,
        auth: false,
        component: <Login title="login" />
    },
    {
        path: "/reset-password/:tokens",
        exact: true,
        auth: false,
        component: <ResetPassword title="Reset Password" />
    },
   
    {
        path: "/",
        exact: true,
        auth: false,
        component: <Dashboard title="Dashboard" />

        // component: <Login title="Login" />
    },
    // {
    //     path: "*",
    //     exact: true,
    //     auth: false,
    //     component: <ErrorPage title="Error 404" />
    // },

]

export default routes;
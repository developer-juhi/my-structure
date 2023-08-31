import React, { useEffect } from "react";
import Http from '../../security/Http'
import url from "../../../Development.json";
import {
    errorResponse,

} from "../../helpers/response";


const Logout = () => {
    useEffect(() => {
        const isLogin = localStorage.getItem("accessToken") || false;
        if (isLogin) {
            const obj = {
                access_token: localStorage.getItem('accessToken')
            };
            Http
                .post(process.env.REACT_APP_BASE_URL + url.logout,
                    obj
                )
                .then((response) => {
                    if (response.status === 200) {
                        localStorage.clear();
                        window.location.href = "/login";
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        errorResponse(error);
                    }
                });
        }

    }, []);

    return (
        <div>
        </div>
    );
}

export default Logout;
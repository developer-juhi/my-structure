import { toast } from 'react-toastify';
import { Button } from "antd";

function isLoginResponse(navigate) {
    const isLogin = localStorage.getItem("accessToken") || false;
    if (isLogin === null) {
        navigate('/login');
    }
    if (isLogin === false) {
        navigate('/login');
    }
}
function isJson(objData) {
    try {
        JSON.parse(objData);
    } catch (e) {
        //Error
        //JSON is not okay
        return false;
    }

    return true;

}
function validateMessages() {
    /* eslint-disable no-template-curly-in-string */

    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    /* eslint-enable no-template-curly-in-string */

    return validateMessages;
}

function configEditorInit() {
    const config = {
        height: 500,
        menubar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | image |help ',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    }
    return config;
}
function configHeaderAxios() {
    const config = {
        headers: {
            'content-type': 'application/json',
            'authorization': localStorage.getItem('accessToken')
        }
    }
    return config;
}
function errorResponse(error) {
    if (error.response.status === 422) {
        let errorData = error.response.data;
        if (errorData) {
            if (errorData.message) {
                toast(`${errorData.message} !`);
            }
            if (error.response.data.data) {
                var errors = Object.values(error.response.data.data);
                if (errors) {
                    errors.forEach((err) => {
                        toast(`${err} !`);
                    });
                }
            }
        }
    }
    if (error.response.status === 401) {
        let errorData = error.response.data.message;
        localStorage.clear();
        toast(`${errorData} !`);
        window.location.reload();
    }

}

function successResponse(response) {
    if (response.status === 200) {
        if (response.data.message) {
            toast.success(`${response.data.message} !`, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }
}


export {
    isLoginResponse,
    validateMessages,
    configHeaderAxios,
    configEditorInit,
    errorResponse,
    successResponse,
    isJson,
};
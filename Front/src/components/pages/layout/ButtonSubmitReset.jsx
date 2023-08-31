import { Button, Form } from 'antd';
import React from 'react';
import { useNavigate } from "react-router-dom";

const ButtonSubmitReset = (props) => {
    const { isLoading, onReset } = props;
    let navigate = useNavigate();

    return (
        <Form.Item >
            <Button type="primary" className='my-submit-button' htmlType="submit" loading={isLoading}>
                Submit
            </Button>
            <Button htmlType="button" className='my-reset-button' onClick={onReset}>
                Reset
            </Button>
            <Button htmlType="button" className='my-reset-button' onClick={() => navigate(-1)}>
                Cancel
            </Button>
        </Form.Item>
    )
}
export default ButtonSubmitReset;
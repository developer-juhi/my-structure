import React from 'react';
import { Link } from 'react-router-dom';
import ErrorImg from '../../../assets/images/404.svg';
import Container from 'react-bootstrap/Container';

const ErrorPage = () => {
    return (
        <div className="ptb80">
            <Container>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="page-not-found-box">
                            <img src={ErrorImg} className="error-image" alt="Error" />
                            <p>The page you are looking for can not be found</p>
                            <Link to={'/'} className="btn-theme btn-theme-primary box-shadow-primary">Go Back To Home</Link>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}
export default ErrorPage;
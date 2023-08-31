import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Master from '../pages/layout/Main';
import routes from './routes';

const RoutePage = () => {
    const isLogin = localStorage.getItem("accessToken") ? true : false;
    return (
        <Router>
            <Routes>
                {routes.map(({ path, auth, component: Component }, key) => {
                    return (
                        auth === true && isLogin === true ?
                            <Route path="/" element={<Master ptitle={Component.props.title} />} key={"layouts_auth" + key}>
                                <Route exact path={path} element={Component} />
                            </Route>
                            :
                            auth === true && isLogin === false ?
                                <Route path="/" element={<Master ptitle={Component.props.title} LoginAsModalOpenStatus={true} />} key={"layouts_false_auth" + key}>
                                    <Route exact path={path} element={<Navigate replace to="/login" />} />
                                </Route>

                                :
                                // <Route path="/" element={<Master ptitle={Component.props.title} />} key={key}>
                                <Route exact path={path} element={Component} key={"login_" + key} />
                        // </Route>
                    )
                })
                }
            </Routes>
        </Router>
    )
}
export default RoutePage;
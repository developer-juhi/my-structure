import { Fragment } from 'react';
import RoutePage from './components/routes/index';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import './reset.css'; // anrd css 

const App = () => {
    return (
        <Fragment>
            <RoutePage />
            <ToastContainer />
        </Fragment>
    );
}

export default App;

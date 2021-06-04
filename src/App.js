import React, { Component } from 'react';
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom';
import history from './_helpers/history';

import './scss/style.scss';
import AuthRoute from './_helpers/AuthRoute';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)


// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
const ForgotPW= React.lazy(()=>import('./views/pages/forgotpassword/forgotpassword'));
const ResetPW= React.lazy(()=>import('./views/pages/resetpassword/resetpassword'));

class App extends Component {

  render() {
    return (
      // <Router history={history}>
      <BrowserRouter>

      {/* <HashRouter> */}
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route exact path="/forgotpassword" name="Forgot Password" render={props => <ForgotPW {...props}/>} />
              <Route exact path="/resetpassword"  name="Reset Password" render={props => <ResetPW {...props} />} />
              <Route exact path="/resetpassword/:id" name="Reset Password" render={props => <ResetPW {...props}/>} />

              <AuthRoute  path="/" name="Home" render={props => <TheLayout {...props}/>} />
            </Switch>
          </React.Suspense>
       {/* </HashRouter> */}
      {/* // </Router> */}
      </BrowserRouter>
    );
  }
}

export default App;

import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import './scss/style.scss'
import AuthRoute from './_helpers/AuthRoute'
import GoogleAnalytics from './_helpers/GoogleAnalytics'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const ForgotPW = React.lazy(() => import('./views/pages/forgotpassword/forgotpassword'))
const ResetPW = React.lazy(() => import('./views/pages/resetpassword/resetpassword'))
const DashboardMenu = React.lazy(() => import('./views/Components/dashboardMenu/TheDashboardMenu'))
const Payment = React.lazy(() => import('./views/Components/payment/Payment'))
const OnBoarding = React.lazy(() => import('./views/pages/onboarding/onBoardingComplete'))
const PaymentMobile = React.lazy(() => import('./views/Components/paymentMobile/PaymentMobileLink'))
const PaymentVerification = React.lazy(() => import('./views/Components/Payment-Verification/paymentverification'))
const SuccessPage = React.lazy(() => import('./views/pages/successpage/success'))
const PaymentDirect = React.lazy(() => import('./views/Components/payment/PaymentDirect'))

class App extends Component {
  render() {
    return (
      // <Router history={history}>
      // <BrowserRouter>
      <HashRouter hashType="slash">
        {/* <HashRouter> */}

        <GoogleAnalytics />
        <React.Suspense fallback={loading}>
          <Switch>
            <Route exact path="/login" name="Login Page" render={(props) => <Login {...props} />} />
            <Route exact path="/register" name="Register Page" render={(props) => <Register {...props} />} />
            <Route exact path="/404" name="Page 404" render={(props) => <Page404 {...props} />} />
            <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} />
            <Route
              exact
              path="/onboardingcomplete"
              name="On Boarding Complete"
              render={(props) => <OnBoarding {...props} />}
            />

            <Route exact path="/successaction" name="Success" render={props => <SuccessPage {...props} />} />
            <Route
              exact
              path="/paymentsms"
              name="Payment Mobile Link"
              render={(props) => <PaymentMobile {...props} />}
            />

            <Route
              exact
              path="/paymentverificationprovider"
              name="payment verification "
              render={(props) => <PaymentVerification {...props} />}
            />
            <Route
              exact
              path="/paymentverificationprovider/:id"
              name="payment verification "
              render={(props) => <PaymentVerification {...props} />}
            />
            <Route
              exact
              path="/paymentverificationprovider/:id/:providerid"
              name="payment verification "
              render={(props) => <PaymentVerification {...props} />}
            />

            <Route
              exact
              path="/paymentverificationfacility"
              name="payment verification "
              render={(props) => <PaymentVerification {...props} />}
            />
            <Route
              exact
              path="/paymentverificationfacility/:id"
              name="payment verification "
              render={(props) => <PaymentVerification {...props} />}
            />

            <Route exact path="/payment" name="payment" render={(props) => <Payment {...props} />} />
            <Route exact path="/payment/:id" name="payment" render={(props) => <Payment {...props} />} />

            <Route exact path="/forgotpassword" name="Forgot Password" render={(props) => <ForgotPW {...props} />} />
            <Route exact path="/resetpassword" name="Reset Password" render={(props) => <ResetPW {...props} />} />
            <Route exact path="/resetpassword/:id" name="Reset Password" render={(props) => <ResetPW {...props} />} />

            <AuthRoute exact path="/directpayment" name="direct Pay" render={(props) => <PaymentDirect {...props} />} />
            <AuthRoute
              exact
              path="/directpayment/:id"
              name="direct Pay"
              render={(props) => <PaymentDirect {...props} />}
            />
            <AuthRoute path="/main" name="main" render={(props) => <DashboardMenu {...props} />} />
            {/* <AuthRoute  path="/payment" name="payment" render={props => <Payment {...props}/>} /> */}

            <AuthRoute path="/" name="Home" render={(props) => <TheLayout {...props} />} />
          </Switch>
        </React.Suspense>
        {/* </HashRouter> */}
        {/* // </Router> */}
      </HashRouter>

      // {/* </BrowserRouter> */}
    )
  }
}

export default App

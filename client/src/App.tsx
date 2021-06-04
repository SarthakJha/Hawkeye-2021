import React, { ReactElement } from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import AdminPage from './pages/Admin';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import { get } from './utils/requests';
import Questions from './pages/Questions';

import NotFound from './pages/NotFound';

//TODO
//***Correct the fonts EVERYWHERE
// background blur chage only for mozilla
// Are you sure question
// Ask Nishika about sqaure rotation in shop
// Ask Nishika about shop background color
// Indication shop mei when something is selected
// Are you sure
// Make sure HUD is in every page
// Spread auth pages background
// Add corners
// HUD is breaking in Home

export default function App(): ReactElement {
  return (
    <React.Fragment>
      <Switch>
        <PrivateRoute auth path="/login" component={Login} />
        <PrivateRoute auth path="/register" component={Register} />
        <PrivateRoute
          auth
          path="/reset-password/:token"
          component={ResetPassword}
        />
        <PrivateRoute auth path="/forgot-password" component={ForgotPassword} />
        <PrivateRoute path="/question/:id" component={Questions} />
        <PrivateRoute admin exact path="/admin" component={AdminPage} />
        <PrivateRoute exact path="/" component={Home} />
        <Route path="**" component={NotFound} />
      </Switch>
    </React.Fragment>
  );
}

import React from "react";
import PrivateRoute from "./components/PrivateRoute";
import { logout } from "./store/actions";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CreateVideo from "./components/CreateVideo";
import VideoList from "./components/VideoList";
import Navigation from "./components/Navigation";
import Video from "./components/VideoPage";
function App(props) {
  return (
    <>
      <Navigation />
      <Switch>
        <PrivateRoute
          path="/"
          exact
          component={localStorage.getItem("token") ? VideoList : Signup}
        />
        <PrivateRoute
          path="/create"
          exact
          component={localStorage.getItem("token") ? CreateVideo : Signup}
        />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route
          exact
          path="/"
          render={() =>
            localStorage.getItem("token" === props.token) ? (
              <Redirect to="/" />
            ) : (
              <Signup />
            )
          }
        />
      </Switch>
    </>
  );
}

const mapStateToProps = state => ({
  loginStart: state.loginStart,
  token: state.token
});

export default connect(
  mapStateToProps,
  { logout }
)(App);

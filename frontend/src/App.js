import "./App.css";
import { connect } from "react-redux";
import React, { Component } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import { set_log_in } from "./actions/user-action";
import Home from "./components/app_components/Home";
import Users from "./components/app_components/Users";
import Login from "./components/app_components/Login";
import Header from "./components/base_components/Header";
import { get_current_user } from "./actions/user-action";
import NewUser from "./components/app_components/NewUser";
import NewGroup from "./components/app_components/NewGroup";

class App extends Component {
  componentDidMount() {
    if (localStorage.getItem("access_token") !== null) {
      this.props.set_log_in();
    }
    this.props.get_current_user();
  }
  render() {
    let is_loggedin = this.props.is_loggedin;
    return (
      <div className="App">
        <Header />
        <ToastContainer />
        <NewUser />
        <NewGroup />
        <Routes>
          {is_loggedin && <Route path="/" element={<Home />} />}
          {is_loggedin && <Route path="/users" element={<Users />} />}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    set_log_in: () => dispatch(set_log_in()),
    get_current_user: () => dispatch(get_current_user()),
  };
};

const mapStateToProps = (state) => {
  return {
    page: state.ui.page,
    is_loggedin: state.user.is_logged_in,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);

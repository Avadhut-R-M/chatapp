
import React, { useState } from "react"
import { connect } from "react-redux";
import { login } from "../../actions/user-action";

class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      passward: '',
      username: ''
    }
  }

  clickToLogin = (e) => {
    e.preventDefault()
    this.props.login(this.state.username, this.state.passward)
  }

  render(){
    return (
      <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="form-group mt-3">
              <label>Username</label>
              <input
                type="text"
                className="form-control mt-1"
                placeholder="Enter Username"
                onChange={(e) => this.setState({'username':e.target.value})}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                onChange={(e) => this.setState({'passward':e.target.value})}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit"
            //   disabled={this.state}
            onClick={this.clickToLogin}
               className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

}


const mapDispatchToProps = dispatch => {
  return {
    login: (username, passward) => dispatch(login(username, passward)),
  }
}

const mapStateToProps = state => {
  return{
      is_loggedin: state.user.is_logged_in
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
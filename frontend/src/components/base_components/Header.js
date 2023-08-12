import React from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
// import { logout } from "../../actions/auth-action";
import { open_new_user_modal, logout } from "../../actions/user-action";
import { open_new_group_modal } from "../../actions/group-actions";
import { change_page, reset_page } from "../../actions/ui-action";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
  }
  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <Link to="/" onClick={() => this.props.reset_page()}>Home</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
          {this.props.is_loggedin &&<Nav className="me-auto">
              <Nav.Link>
                <Link to="#" onClick={() => this.props.open_new_group_modal()}>
                  New Group
                </Link>
              </Nav.Link>
              {this.props.is_admin && <Nav.Link>
                <Link to="#" onClick={() => this.props.open_new_user_modal()}>
                  New User
                </Link>
              </Nav.Link>}
              <Nav.Link>
                <Link to="#" onClick={() => this.props.change_page('user_listing')}>
                  Users
                </Link>
              </Nav.Link>
            </Nav>}
            <Nav>
              {this.props.is_loggedin && <Nav.Link onClick={() => this.props.logout()}><Link>Logout</Link></Nav.Link>}
              {this.props.user_name && this.props.is_loggedin && (
                <Nav.Link>
                  {`Hi, ${this.props.user_name}`}
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    open_new_user_modal: () => dispatch(open_new_user_modal()),
    open_new_group_modal: () => dispatch(open_new_group_modal()),
    change_page: (page) => dispatch(change_page(page)),
    reset_page: () => dispatch(reset_page())
  };
};

const mapStateToProps = (state) => {
  return {
    user_name: state?.user?.current_user?.first_name,
    is_loggedin: state?.user?.is_logged_in,
    is_admin: state?.user?.current_user?.is_admin
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

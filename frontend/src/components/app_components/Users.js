import React from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import { get_groups, set_selected_group } from "../../actions/group-actions";
import { get_messages } from "../../actions/message-action";
import Form from "react-bootstrap/Form";
import {
  get_users,
  delete_users,
  open_edit_user_modal,
} from "../../actions/user-action";
import { reset_page } from "../../actions/ui-action";
import Button from "react-bootstrap/Button";
import DeleteUser from "./DeleteUser";
import EditUser from "./EditUser";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show_delete: false,
      delete_id: null,
    };
  }

  componentDidMount() {
    this.props.get_users();
  }

  onGroupSelection = (group) => {
    this.props.set_selected_group(group.id, group.name);
    this.props.get_messages(group.id);
    this.props.reset_page();
  };

  formValueChange = (event) => {
    let fleldVal = event.target.value;
    this.props.get_users(fleldVal);
  };

  handleDeleteSuccess = () => {
    this.props.delete_users(this.state.delete_id);
    this.setState({ show_delete: false });
  };

  render() {
    return (
      <div>
        <EditUser />
        <DeleteUser
          show={this.state.show_delete}
          onHide={() => this.setState({ show_delete: false })}
          handleSave={this.handleDeleteSuccess}
        />
        <Container className="group-listing-container user-container">
          <Form inline className="group-search user-search">
            <Form.Control
              type="text"
              placeholder="Search"
              className=" mr-sm-2"
              onChange={this.formValueChange}
            />
          </Form>
          {this.props.users.map((user) => (
            <div className="user-listing">
              <div>
                {user.first_name} {user.last_name}
              </div>
              {this.props.is_admin && (
                <div className="user-listing-buttons">
                  <Button
                    variant="primary"
                    onClick={() => this.props.open_edit_user_modal(user.id)}
                    style={{ height: "2em" }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() =>
                      this.setState({ show_delete: true, delete_id: user.id })
                    }
                    style={{ height: "2em" }}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </Container>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    get_groups: (name) => dispatch(get_groups(name)),
    set_selected_group: (id, name) => dispatch(set_selected_group(id, name)),
    get_messages: (group_id) => dispatch(get_messages(group_id)),
    get_users: (name) => dispatch(get_users(name)),
    reset_page: () => dispatch(reset_page()),
    delete_users: (id) => dispatch(delete_users(id)),
    open_edit_user_modal: (id) => dispatch(open_edit_user_modal(id)),
  };
};

const mapStateToProps = (state) => {
  return {
    groups: state.group.list,
    messages: state.message.list,
    selected_group_id: state.group.selected_group_id,
    selected_group_name: state.group.selected_group_name,
    users: state.user.list,
    page: state.ui.page,
    is_admin: state?.user?.current_user?.is_admin,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);

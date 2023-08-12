import React from "react";
import { useRef } from "react";
import { connect } from "react-redux";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {
  get_groups,
  set_selected_group,
  edit_group,
  delete_group,
  open_member_addition,
  remove_group_member,
} from "../../actions/group-actions";
import {
  send_messages,
  like_messages,
  reset_scroll,
  delete_messages,
  edit_messages,
} from "../../actions/message-action";
import { toast, ToastContainer } from "react-toastify";
import EditMessage from "./EditMessage";
import LikeImage from "./LikeImage";
import DeleteMessage from "./DeleteMessage";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { reset_page } from "../../actions/ui-action";
import AddMembers from "./AddMembers";
import RemoveMember from "./RemoveMember";

class GroupInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_name: "",
      new_members: [],
      change_group_name: false,
      show_delete: false,
      remove_member: false,
      remove_member_id: null,
    };
  }

  handleDeleteSuccess = () => {
    this.props.delete_group(this.props.selected_group_id);
    this.setState({ show_delete: false });
    this.props.set_selected_group();
    this.props.reset_page();
  };

  handleRemoveSuccess = () => {
    this.props.remove_group_member(this.props.selected_group_id, {
      member_id: this.state.remove_member_id,
    });
    this.setState({ remove_member: false });
  };

  closeAddMember = () => {
    this.setState({})
  }

  render() {
    let selected_group = this.props.selected_group_id
      ? this.props.groups?.find(
          (group) => group.id == this.props.selected_group_id
        )
      : {};
    return (
      <>
        <Col xs={8} className="group-info-main">
          <AddMembers members={selected_group?.members || []} />
          <DeleteMessage
            show={this.state.show_delete}
            onHide={() => this.setState({ show_delete: false })}
            handleSave={this.handleDeleteSuccess}
          />
          <RemoveMember
            show={this.state.remove_member}
            onHide={() => this.setState({ remove_member: false })}
            handleSave={this.handleRemoveSuccess}
          />
          {this.props.selected_group_id && (
            <div className="message-listing-main-container group-info-container">
              <Button
                variant="primary"
                onClick={() => this.props.reset_page()}
                style={{ height: "2em" }}
              >
                back
              </Button>
              <div className="message-listing-groupname">
                {this.props.selected_group_name}
              </div>
            </div>
          )}
          {this.state.change_group_name && (
            <Form>
              <Row>
                <Col>
                  <Form.Control
                    placeholder="New Name"
                    onChange={(e) =>
                      this.setState({ new_name: e.target.value })
                    }
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.edit_group(this.props.selected_group_id, {
                        name: this.state.new_name,
                      });
                      this.setState({ change_group_name: false, new_name: "" });
                    }}
                  >
                    Submit
                  </Button>
                </Col>
                <Col sm={2}>
                  <Button
                    variant="danger"
                    onClick={() =>
                      this.setState({ change_group_name: false, new_name: "" })
                    }
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
          {!this.state.change_group_name && (
            <Button
              variant="primary"
              onClick={() => this.setState({ change_group_name: true })}
            >
              Change Group Name
            </Button>
          )}
          <div>
            <div className="group-members-title">
              <div className="group-members-title-span">
                <span>Members:</span>
              </div>
              <div>
                <Button
                  variant="primary"
                  onClick={() => this.props.open_member_addition()}
                >
                  + Add members
                </Button>
              </div>
            </div>
            <div className="group-members-main">
              {selected_group?.members?.map((member) => (
                <div className="group-members">
                  <div>
                    {" "}
                    {`${member.first_name} ${member.last_name}${
                      member.is_admin ? " - admin" : ""
                    }`}{" "}
                  </div>
                  <Button
                    variant="danger"
                    onClick={() =>
                      this.setState({
                        remove_member_id: member.id,
                        remove_member: true,
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="danger"
            onClick={() => this.setState({ show_delete: true })}
          >
            Delete Group
          </Button>
        </Col>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    get_groups: () => dispatch(get_groups()),
    set_selected_group: (id, name) => dispatch(set_selected_group(id, name)),
    send_messages: (data) => dispatch(send_messages(data)),
    like_messages: (id, is_liked) => dispatch(like_messages(id, is_liked)),
    reset_scroll: () => dispatch(reset_scroll()),
    delete_messages: (id) => dispatch(delete_messages(id)),
    edit_messages: (id, data) => dispatch(edit_messages(id, data)),
    reset_page: () => dispatch(reset_page()),
    edit_group: (id, data) => dispatch(edit_group(id, data)),
    delete_group: (id) => dispatch(delete_group(id)),
    open_member_addition: () => dispatch(open_member_addition()),
    remove_group_member: (id, data) => dispatch(remove_group_member(id, data)),
  };
};

const mapStateToProps = (state) => {
  return {
    groups: state.group.list,
    messages: state.message.list,
    selected_group_id: state.group.selected_group_id,
    selected_group_name: state.group.selected_group_name,
    scroll_to_bottom: state.message.scroll_to_bottom,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupInfo);

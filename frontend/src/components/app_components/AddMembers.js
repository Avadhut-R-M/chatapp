import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import { connect } from "react-redux";
import { close_member_addition, add_group_member } from "../../actions/group-actions";

class AddMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_users: [],
    };
  }

  getUserOptions = () => {
    let members_ids = this.props?.members?.map(({ id }) => id) || [];
    let remaining_users = this.props.users.filter(user => !members_ids.includes(user.id))
    let userOptions = remaining_users.map((user) => {
        return {
          label: user.first_name + " " + user.last_name,
          value: user.id,
        };
    });
    return userOptions;
  };

  render() {
    return (
      <>
        <Modal
          show={this.props.member_addition}
          onHide={this.props.close_member_addition}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Members</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span>Select Users:</span>
            <Select
              options={this.getUserOptions()}
              onChange={(opt) => {
                this.setState({ selected_users: opt });
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() =>
                {this.props.add_group_member(this.props.group_id, {
                  member_id: this.state.selected_users?.value,
                });
            this.props.close_member_addition()}
              }
              variant="primary"
              disabled={
                this.state?.selected_users?.length < 1}
            >
              Add Member
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    close_member_addition: () => dispatch(close_member_addition()),
    add_group_member: (id, data) => dispatch(add_group_member(id, data)),
  };
};

const mapStateToProps = (state) => {
  return {
    member_addition: state.group.member_addition,
    users: state.user.list,
    group_id: state.group.selected_group_id,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMembers);

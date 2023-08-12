import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import { connect } from "react-redux";
import {
    close_new_group_modal,
    create_group,
} from "../../actions/group-actions";

class NewGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected_users: [],
            group_name: "",
        };
    }

    getUserOptions = () => {
        let userOptions = this.props.users.map((user) => {
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
                    show={this.props.create_new_group}
                    onHide={this.props.close_new_group_modal}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>New Group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group
                            as={Row}
                            className="mb-3"
                            controlId="formPlaintextPassword"
                        >
                            <Form.Label column sm="2">
                                Group Nmae
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    type="text"
                                    placeholder="New Group Name"
                                    onChange={(e) =>
                                        this.setState({
                                            group_name: e.target.value,
                                        })
                                    }
                                />
                            </Col>
                        </Form.Group>
                        <span>Select Users:</span>
                        <Select
                            isMulti
                            options={this.getUserOptions()}
                            onChange={(opt) => {
                                let options = [];
                                options = opt.map((o) => {
                                    return o.id;
                                });
                                this.setState({ selected_users: options });
                            }}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() =>
                                this.props.create_group({
                                    name: this.state.group_name,
                                    members: this.state.selected_users,
                                })
                            }
                            variant="primary"
                            disabled={
                                this.state.selected_users.length < 1 ||
                                this.state.group_name.length < 1
                            }
                        >
                            Create Group
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        close_new_group_modal: () => dispatch(close_new_group_modal()),
        create_group: (data) => dispatch(create_group(data)),
    };
};

const mapStateToProps = (state) => {
    return {
        create_new_group: state.group.create_new_group,
        users: state.user.list,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewGroup);

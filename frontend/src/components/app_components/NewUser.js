import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";
import { connect } from "react-redux";
import { close_new_user_modal, create_user } from "../../actions/user-action";

class NewUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            username: "",
        };
    }

    render() {
        return (
            <>
                <Modal
                    show={this.props.new_user_modal_open}
                    onHide={() => this.props.close_new_user_modal()}
                    size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>New User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group
                                    as={Col}
                                    controlId="formGridFirstName"
                                >
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter First Name"
                                        value={this.state?.first_name}
                                        onChange={(e) =>
                                            this.setState({
                                                first_name: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>

                                <Form.Group
                                    as={Col}
                                    controlId="formGridLastName"
                                >
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter Last Name"
                                        value={this.state?.last_name}
                                        onChange={(e) =>
                                            this.setState({
                                                last_name: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group
                                    as={Col}
                                    controlId="formGridUsername"
                                >
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter Username"
                                        value={this.state?.username}
                                        onChange={(e) =>
                                            this.setState({
                                                username: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        placeholder="Enter Email"
                                        value={this.state?.email}
                                        onChange={(e) =>
                                            this.setState({
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                            </Row>
                            <Form.Group
                                className="mb-3"
                                controlId="formGroupPassword"
                            >
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Enter password"
                                    value={this.state?.password}
                                    onChange={(e) =>
                                        this.setState({
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </Form.Group>
                            <Button
                                disabled={
                                    !this.state.first_name ||
                                    !this.state.last_name ||
                                    !this.state.username ||
                                    !this.state.email  ||
                                    !this.state.password
                                }
                                type="submit"
                                onClick={(e) =>{
                                    e.preventDefault()
                                    this.props.create_user(this.state)
                                }
                                }
                            >
                                Submit form
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        close_new_user_modal: () => dispatch(close_new_user_modal()),
        create_user: (data) => dispatch(create_user(data)),
    };
};

const mapStateToProps = (state) => {
    return {
        new_user_modal_open: state.user.new_user_modal_open,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewUser);

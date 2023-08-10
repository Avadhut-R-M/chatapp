import React from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { get_groups, set_selected_group } from "../../actions/group-actions";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){
        this.props.get_groups()
    }
    render() {
        return (
            <div>
                <Container className="group-listing-container">
                    <Row>
                        <Col className="group-listing-main">
                            {this.props.groups.map((group) => (
                                <div
                                    className={`group-listing ${
                                        this.props.selected_group_id == group.id
                                            ? "group-listing-selected"
                                            : ""
                                    }`}
                                    onClick={()=> this.props.set_selected_group(group.id)}
                                    key = {group.id}
                                >
                                    {group.name}
                                </div>
                            ))}
                        </Col>
                        <Col xs={8} className="message-listing-main">
                            <div className="message-listing-main-container">
                                {this.props.messages.map((message) => (
                                    <div className={`message-listing ${""}`} key={message.id}>
                                        <div className="message-lising-sender">
                                            {message.sender} -
                                        </div>
                                        <div className="message-lising-content">
                                            {message.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="message-input-grp">
                                <textarea
                                    className="message-input"
                                    placeholder="Add new message here"
                                    rows={4}
                                ></textarea>
                                <Button className="message-send" variant="primary">Send</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        get_groups: () => dispatch(get_groups()),
        set_selected_group: (id) => dispatch(set_selected_group(id))
    };
};

const mapStateToProps = (state) => {
    return {
        groups: state.group.list,
        messages: state.message.list,
        selected_group_id: state.group.selected_group_id
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

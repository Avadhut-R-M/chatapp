import React from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { get_groups, set_selected_group } from "../../actions/group-actions";
import MessageListinge from "./MessageListinge";
import { get_messages } from "../../actions/message-action";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.get_groups();
    }

    onGroupSelection = (group) => {
        this.props.set_selected_group(
            group.id,
            group.name
        )
        this.props.get_messages(group.id)
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
                                    onClick={() =>
                                        this.onGroupSelection(group)
                                    }
                                    key={group.id}
                                >
                                    {group.name}
                                </div>
                            ))}
                        </Col>
                        <MessageListinge/>
                    </Row>
                </Container>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        get_groups: () => dispatch(get_groups()),
        set_selected_group: (id, name) =>
            dispatch(set_selected_group(id, name)),
        get_messages: (group_id) => dispatch(get_messages(group_id))
    };
};

const mapStateToProps = (state) => {
    return {
        groups: state.group.list,
        messages: state.message.list,
        selected_group_id: state.group.selected_group_id,
        selected_group_name: state.group.selected_group_name,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

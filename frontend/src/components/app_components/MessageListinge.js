import React from "react";
import { useRef } from "react";
import { connect } from "react-redux";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { get_groups, set_selected_group } from "../../actions/group-actions";
import { send_messages } from "../../actions/message-action";

class MessageListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            bottomRef: React.createRef(),
        };
    }

    componentDidMount() {
        this.props.get_groups();
        this.state.bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    componentDidUpdate(prevProps) {
        if (this?.props?.messages != prevProps?.messages) {
            this.state.bottomRef.current?.scrollIntoView({
                behavior: "smooth",
            });
        }
    }

    sendMessage = () => {
        this.props.send_messages({
            group_id: this.props.selected_group_id,
            content: this.state.message,
        });
        this.setState({ message: "" });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    };

    render() {
        let date = "";
        return (
            <Col xs={8} className="message-listing-main">
                {this.props.selected_group_id && (
                    <div className="message-listing-main-container">
                        <div className="message-listing-groupname">
                            {this.props.selected_group_name}
                        </div>
                        <div className="message-listing-messages">
                            {this.props.messages.map((message) => {
                                if (message.time.split(" ")[0] != date) {
                                    date = message.time.split(" ")[0];

                                    return (
                                        <div>
                                            {/* <div> date - {date} </div> */}
                                            <div class="date-container blue">
                                                <div class="circle"> date - {date} </div>
                                            </div>
                                            <div
                                                className={`message-listing ${""}`}
                                                key={message.id}
                                            >
                                                <div className="message-lising-sender">
                                                    <span>
                                                        {message.sender_name}{" "}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: "0.8em",
                                                        }}
                                                    >
                                                        (
                                                        {
                                                            message.time.split(
                                                                " "
                                                            )[1]
                                                        }{" "}
                                                        {
                                                            message.time.split(
                                                                " "
                                                            )[2]
                                                        }
                                                        )
                                                    </span>
                                                    <span> - </span>
                                                </div>
                                                <div className="message-lising-content">
                                                    {message.content}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <div
                                        className={`message-listing ${""}`}
                                        key={message.id}
                                    >
                                        <div className="message-lising-sender">
                                            <span>{message.sender_name} </span>
                                            <span style={{ fontSize: "0.8em" }}>
                                                ({message.time.split(" ")[1]}{" "}
                                                {message.time.split(" ")[2]})
                                            </span>
                                            <span> - </span>
                                        </div>
                                        <div className="message-lising-content">
                                            {message.content}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={this.state.bottomRef} />
                        </div>
                    </div>
                )}
                {this.props.selected_group_id && (
                    <div className="message-input-grp">
                        <textarea
                            className="message-input"
                            placeholder="Add new message here"
                            rows={4}
                            onChange={(e) =>
                                this.setState({ message: e.target.value })
                            }
                            onKeyDown={this.handleKeyDown}
                            value={this.state.message}
                        ></textarea>
                        <Button
                            className="message-send"
                            variant="primary"
                            onClick={this.sendMessage}
                        >
                            Send
                        </Button>
                    </div>
                )}
            </Col>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        get_groups: () => dispatch(get_groups()),
        set_selected_group: (id, name) =>
            dispatch(set_selected_group(id, name)),
        send_messages: (data) => dispatch(send_messages(data)),
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageListing);

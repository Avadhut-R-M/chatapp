import React from "react";
import { useRef } from "react";
import { connect } from "react-redux";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { get_groups, get_group_info } from "../../actions/group-actions";
import {
  send_messages,
  like_messages,
  reset_scroll,
  delete_messages,
  edit_messages,
} from "../../actions/message-action";
import EditMessage from "./EditMessage";
import LikeImage from "./LikeImage";
import DeleteMessage from "./DeleteMessage";
import { change_page } from "../../actions/ui-action";

class MessageListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      bottomRef: React.createRef(),
      edited_message: "",
      edit_message_id: null,
      show_edit: false,
      show_delete: false,
      delete_message_id: null,
    };
  }

  componentDidMount() {
    this.props.get_groups();
    this.state.bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  componentDidUpdate() {
    if (this?.props?.scroll_to_bottom) {
      this.state.bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
      this.props.reset_scroll();
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

  handleLike = (message) => {
    if (message.is_liked) {
      this.props.like_messages(message.id, false);
    } else {
      this.props.like_messages(message.id);
    }
  };

  handleEditSuccess = () => {
    this.props.edit_messages(this.state.edit_message_id, {
      content: this.state.edited_message,
    });
    this.setState({
      show_edit: false,
      edit_message_id: null,
      edited_message: "",
    });
  };

  handleDeleteSuccess = () => {
    this.props.delete_messages(this.state.delete_message_id);
    this.setState({ show_delete: false, delete_message_id: null });
  };

  onEdit = (e, message) => {
    e.preventDefault();
    this.setState({
      show_edit: true,
      edit_message_id: message.id,
      edited_message: message.content,
    });
  };

  onDelete = (e, id) => {
    e.preventDefault();
    this.setState({ show_delete: true, delete_message_id: id });
  };

  render() {
    let date = "";
    return (
      <>
        {" "}
        <EditMessage
          show={this.state.show_edit}
          handleClose={() => this.setState({ show_edit: false })}
          changeValue={(data) => this.setState(data)}
          onSave={this.handleEditSuccess}
          value={this.state.edited_message}
        />
        <DeleteMessage
          show={this.state.show_delete}
          onHide={() => this.setState({ show_delete: false })}
          handleSave={this.handleDeleteSuccess}
        />
        <Col xs={8} className="message-listing-main">
          {this.props.selected_group_id && (
            <div className="message-listing-main-container">
              <div
                className="message-listing-groupname"
                onClick={() => {
                  this.props.get_group_info(this.props.selected_group_id);
                  this.props.change_page("group-info");
                }}
              >
                {this.props.selected_group_name}
              </div>
              <div className="message-listing-messages">
                {this.props.messages.map((message) => {
                  if (message?.time?.split(" ")?.[0] != date) {
                    date = message.time?.split(" ")?.[0];

                    return (
                      <div key={message.id}>
                        <div className="date-container blue">
                          <div className="circle"> {date} </div>
                        </div>
                        <div
                          className={`message-listing ${""}`}
                          key={message.id}
                        >
                          <div className="message-lising-sender">
                            <span>{message.sender_name} </span>
                            <span
                              style={{
                                fontSize: "0.8em",
                              }}
                            >
                              ({message?.time?.split(" ")[1]}{" "}
                              {message?.time?.split(" ")[2]})
                            </span>
                            <span> - </span>
                          </div>
                          <div className="message-lising-content">
                            {message.content}
                          </div>
                          <div className="message-edit-container">
                            <div
                              onClick={() => this.handleLike(message)}
                              className="message-like"
                            >
                              <LikeImage is_liked={message?.is_liked} />
                            </div>
                            <a
                              href="#"
                              onClick={(e) => this.onEdit(e, message)}
                            >
                              Edit
                            </a>
                            <a
                              href="#"
                              onClick={(e) => this.onDelete(e, message.id)}
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className={`message-listing ${""}`} key={message.id}>
                      <div className="message-lising-sender">
                        <span>{message.sender_name} </span>
                        <span
                          style={{
                            fontSize: "0.8em",
                          }}
                        >
                          ({message?.time?.split(" ")[1]}{" "}
                          {message?.time?.split(" ")[2]})
                        </span>
                        <span> - </span>
                      </div>
                      <div className="message-lising-content">
                        {message.content}
                      </div>
                      <div className="message-edit-container">
                        <div
                          onClick={() => this.handleLike(message)}
                          className="message-like"
                        >
                          <LikeImage is_liked={message?.is_liked} />
                        </div>
                        <a href="#" onClick={(e) => this.onEdit(e, message)}>
                          Edit
                        </a>
                        <a
                          href="#"
                          onClick={(e) => this.onDelete(e, message.id)}
                        >
                          Delete
                        </a>
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
                onChange={(e) => this.setState({ message: e.target.value })}
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
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    get_groups: () => dispatch(get_groups()),
    send_messages: (data) => dispatch(send_messages(data)),
    like_messages: (id, is_liked) => dispatch(like_messages(id, is_liked)),
    reset_scroll: () => dispatch(reset_scroll()),
    delete_messages: (id) => dispatch(delete_messages(id)),
    edit_messages: (id, data) => dispatch(edit_messages(id, data)),
    get_group_info: (id) => dispatch(get_group_info(id)),
    change_page: (page) => dispatch(change_page(page)),
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageListing);

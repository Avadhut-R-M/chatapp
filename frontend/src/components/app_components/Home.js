import React from "react";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { get_groups, set_selected_group } from "../../actions/group-actions";
import MessageListinge from "./MessageListinge";
import { get_messages } from "../../actions/message-action";
import Form from "react-bootstrap/Form";
import { get_users, get_current_user } from "../../actions/user-action";
import NewUser from "./NewUser";
import NewGroup from "./NewGroup";
import GroupInfo from "./GroupInfo";
import { reset_page } from "../../actions/ui-action";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.get_groups();
    this.props.get_users();
    this.props.get_current_user();
  }

  onGroupSelection = (group) => {
    this.props.set_selected_group(group.id, group.name);
    this.props.get_messages(group.id);
    this.props.reset_page();
  };

  formValueChange = (event) => {
    let fleldVal = event.target.value;
    this.props.get_groups(fleldVal);
  };

  render() {
    return (
      <div>
        <NewUser />
        <NewGroup />
        <Container className="group-listing-container">
          <Row>
            <Col className="group-listing-main">
              <Form inline className="group-search">
                <Form.Control
                  type="text"
                  placeholder="Search"
                  className=" mr-sm-2"
                  onChange={this.formValueChange}
                />
              </Form>
              <div className="group-listing-all">
                {this.props.groups.map((group) => (
                  <div
                    className={`group-listing ${
                      this.props.selected_group_id == group.id
                        ? "group-listing-selected"
                        : ""
                    }`}
                    onClick={() => this.onGroupSelection(group)}
                    key={group.id}
                  >
                    {group.name}
                  </div>
                ))}
              </div>
            </Col>
            {this.props.page == "messages" && <MessageListinge />}
            {this.props.page == "group-info" && <GroupInfo />}
          </Row>
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
    get_users: () => dispatch(get_users()),
    reset_page: () => dispatch(reset_page()),
    get_current_user: () => dispatch(get_current_user()),
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

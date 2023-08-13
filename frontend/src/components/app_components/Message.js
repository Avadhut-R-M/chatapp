import LikeImage from "./LikeImage";

function Message(props) {
  return (
    <div className={`message-listing ${""}`} key={props.message.id}>
      <div className="message-lising-sender">
        <span>{props.message.sender_name} </span>
        <span
          style={{
            fontSize: "0.8em",
          }}
        >
          ({props.message?.time?.split(" ")[1]} {props.message?.time?.split(" ")[2]})
        </span>
        <span> - </span>
      </div>
      <div className="message-lising-content">{props.message.content}</div>
      <div className="message-edit-container">
        <div onClick={() => props.handleLike(props.message)} className="message-like">
          <LikeImage is_liked={props.message?.is_liked} />
        </div>
        <a href="#" onClick={(e) => props.onEdit(e, props.message)}>
          Edit
        </a>
        <a href="#" onClick={(e) => props.onDelete(e, props.message.id)}>
          Delete
        </a>
      </div>
    </div>
  );
}

export default Message;

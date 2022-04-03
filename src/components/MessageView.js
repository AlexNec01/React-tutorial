import React, { Component } from "react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

class MessageView extends Component {
  render() {
    const { message } = this.props;
    const { user, date } = message;
    const { username, displayName, image } = user;
    const relativeDate = format(date);

    return (
      <div className="card p-2">
        <div className="d-flex">
          <ProfileImageWithDefault
            className="rounded-circle m-1"
            width="32"
            height="32"
            image={image}
          />
          <div className="flex-fill m-auto ps-2 pt-2">
            <div>
              <Link to={`/${username}`} className="list-group-item-action">
                <h6 className="d-inline">
                  {displayName}@{username}
                </h6>
              </Link>
              <br></br>
              <span className="text-black-50 fs-7">{relativeDate}</span>
            </div>
          </div>
        </div>
        <div className="ps-5 pt-2">{message.content}</div>
      </div>
    );
  }
}

export default MessageView;

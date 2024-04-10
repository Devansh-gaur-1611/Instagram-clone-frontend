import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { getUser } from "../../../features/User/UserSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatItem = ({ details, setUnReadMap, unReadMap, socket }) => {
  const current_user = useSelector(getUser);
  console.log(unReadMap.get(details._id));

  const navigate = useNavigate();
  const [user, setUser] = useState();
  useEffect(() => {
    if (current_user && current_user.user) {
      setUser(details.users[0]._id === current_user.user.id ? details.users[1] : details.users[0]);
    }
  }, [current_user]);
  return (
    <>
      <div
        className={styles.container}
        onClick={() => {
          navigate("/direct/t/" + details._id);
          setUnReadMap((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.delete(details._id);
            return newMap;
          });
          if (socket) {
            socket.emit("updateUnRead", {
              chatId: details._id,
              count: 0,
            });
          }
        }}
      >
        <div className={styles.left_container}>
          <div className={styles.avatar}>
            <img
              src={user && user.profileImageUrl != "" ? user.profileImageUrl : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
              alt="avatar"
              className={styles.avatar_img}
            />
          </div>
        </div>
        <div className={styles.right_container}>
          <div className={styles.info}>
            <div className={styles.name}>{!details.isGroupChat ? user && user.name : details.chatName}</div>
            <div className={styles.msg}>{details.latestMessage && details.latestMessage.content}</div>
          </div>
        </div>
        {unReadMap && unReadMap.get(details._id) && (
          <div className={styles.unReadDiv}>
            <p className={styles.unReadCount}>{unReadMap.get(details._id)}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatItem;

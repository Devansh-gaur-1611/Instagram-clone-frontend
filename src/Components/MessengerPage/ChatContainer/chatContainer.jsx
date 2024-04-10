import React, { useEffect, useState, useRef } from "react";
import styles from "./styles.module.css";
import { GetAuthRequest, PostAuthRequest } from "../../../helper/authRequest";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { formatDate, formatTime } from "../../../helper/dateConverter";
import { getUser } from "../../../features/User/UserSlice";
import { Avatar, Box, Divider, Toolbar, Typography } from "@mui/material";
import { memo } from "react";

// const ENDPOINT = "http://localhost:5000";
// var socket

const ChatContainer = memo(({ updateChatsArray, socket, setUnReadMap, unReadMap }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [allMsg, setAllMsg] = useState([]);
  const [content, setContent] = useState("");
  const [cursor, setCursor] = useState(null);
  const [unReadCount, setUnReadCount] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const params = useParams();
  const id = params.id;
  const [activeChat, setActiveChat] = useState();
  const current_user = useSelector(getUser);
  const [user, setUser] = useState();
  const msgScroll = useRef();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (socket) {
      socket.on("message received chat", (newMessage) => {
        console.log("object - message received");
        if (params.id && newMessage.chat._id == params.id) {
          setAllMsg((prevAllMsg) => [...prevAllMsg, newMessage]);
          setUnReadCount(0);
        } else {
          // Give notification
          console.log("object opposite to message received");
        }
        console.log("msg received in chat");
      });
    }
    return () => {
      if (socket) {
        socket.off("message received chat");
      }
    };
  });

  useEffect(() => {
    const successFxn = (res) => {
      console.log(res);
      setActiveChat(res.data.data);
      setUser(res.data.data.users[0]._id === current_user.user.id ? res.data.data.users[1] : res.data.data.users[0]);
    };
    if (current_user && current_user.user) {
      GetAuthRequest("api/chat/getOne?id=" + id, successFxn, enqueueSnackbar, navigate, setLoading);
    }
  }, [id, current_user.user]);

  useEffect(() => {
    if (activeChat && unReadMap.size > 0) {
      console.log("object change");
      const newMap = new Map(unReadMap);
      newMap.delete(activeChat._id);
      if (newMap.size !== unReadMap.size) {
        // Check if the map has changed
        setUnReadMap(newMap);
      }
    }
  }, [activeChat, unReadMap]);

  useEffect(() => {
    msgScroll?.current?.scrollIntoView({ behaviour: "instant" });
  }, [allMsg, unReadCount]);

  useEffect(() => {
    const successFxn = (res) => {
      // console.log(res);
      setAllMsg(res.data.data);
      setCursor(res.data.cursor);
      setUnReadCount(parseInt(res.data.unReadCount));
      // socket.emit("join-chat", id);
    };
    if (
      // socket &&
      current_user &&
      current_user.user
    )
      GetAuthRequest("api/message/" + id, successFxn, enqueueSnackbar, navigate, setLoading);
  }, [
    id,
    // socket,
    current_user.user,
  ]);

  const sendMessage = (e) => {
    e.preventDefault();
    const body = {
      content: content,
      chat: activeChat._id,
    };
    const successFxn = (res) => {
      console.log(res);
      socket.emit("new-message", res.data.data);
      setContent("");
      setUnReadCount(0);
      updateChatsArray(res.data.data);
      setAllMsg([...allMsg, res.data.data]);
    };
    if (content) {
      PostAuthRequest("api/message/", body, successFxn, enqueueSnackbar, navigate, setLoading);
    }
  };
  return (
    <div className={styles.main_container}>
      <Toolbar className={styles.toolbar}>
        <Box className={styles.t_left_div}>
          <Avatar></Avatar>
          <Typography className={styles.text_1}>{activeChat && (!activeChat.isGroupChat ? user && user.name : activeChat.chatName)}</Typography>
        </Box>
      </Toolbar>
      <div className={styles.body_container} ref={containerRef}>
        {allMsg.map((ele, i) => {
          return (
            <div className={styles.m_main_container} key={ele._id}>
              <div className={styles.m_date_container}>{formatDate(ele.createdAt) + " " + formatTime(ele.createdAt)}</div>
              <div className={ele.isSender ? styles.m_container_right : styles.m_container_left}>
                <div className={ele.isSender ? styles.msg_container_right : styles.msg_container_left}>{ele.content}</div>
              </div>
              {unReadCount == 0 && i == allMsg.length - 1 && <div ref={msgScroll}></div>}
              {unReadCount != 0 && i == allMsg.length - unReadCount - 1 && (
                <div ref={msgScroll}>
                  <Divider variant="middle">{unReadCount} unread messages</Divider>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.footer}>
        <form onSubmit={sendMessage} className={styles.form}>
          <input type="text" className={styles.input} value={content} placeholder="Message" onChange={(e) => setContent(e.target.value)} />
          <button className={styles.btn}>Send</button>
        </form>
      </div>
    </div>
  );
});
export default ChatContainer;

import React, { useCallback, useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import styles from "./styles.module.css";
import ChatItem from "./ChatItem/chatItem";
import ChatContainer from "./ChatContainer/chatContainer";
import { GetAuthRequest } from "../../helper/authRequest";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import New_Chat_Modal from "./newChatModal/newChatModal";
import { getUser } from "../../features/User/UserSlice";
import { io } from "socket.io-client";
import { Box, Button, CssBaseline } from "@mui/material";
import SideBar from "../sidebar/sidebar";
import FolderList from "./list";

const ENDPOINT = "http://localhost:5000";

const Messenger = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [allChats, setAllChats] = useState([]);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const params = useParams();
  const id = params.id;
  const [unReadMap, setUnReadMap] = useState(new Map());
  const [socketState, setSocketState] = useState();
  // var socket = useSelector(getSocket).socket;

  const current_user = useSelector(getUser);
  const [width, setWidth] = useState(window.innerWidth);
  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [width]);

  useEffect(() => {
    const successFunction = (res) => {
      console.log(res);
      console.log(id);
      setAllChats(res.data.data);
      setUnReadMap(new Map(Object.entries(res.data.unReadMap)));
    };
    GetAuthRequest("api/chat/", successFunction, enqueueSnackbar, navigate, setLoading);
  }, []);

  useEffect(() => {
    if (current_user && current_user.user) {
      const socket = io(ENDPOINT, {
        query: {
          userData: current_user.user,
        },
      });
      setSocketState(socket);
      socket.emit("setup", current_user.user);
      return () => {
        socket.disconnect();
      };
    }
  }, [current_user.user]);

  const updateChatsArray = useCallback((newMessage) => {
    console.log("object run callback")
    var singleChat;
    allChats.map((chat) => {
      if (chat._id == newMessage.chat._id) {
        singleChat = { ...chat };
        if (singleChat.latestMessage == undefined || singleChat.latestMessage === null) {
          var lat_msg = {
            _id: newMessage._id,
            content: newMessage.content,
            sender: newMessage.sender._id,
            chat: newMessage.chat._id,
            readBy: [],
            createdAt: newMessage.createdAt,
            updatedAt: newMessage.updatedAt,
            __v: 0,
          };
          singleChat.latestMessage = lat_msg;
        } else {
          singleChat.latestMessage._id = newMessage._id;
          singleChat.latestMessage.content = newMessage.content;
          singleChat.latestMessage.sender = newMessage.sender._id;
          singleChat.latestMessage.chat = newMessage.chat._id;
          singleChat.latestMessage.createdAt = newMessage.createdAt;
          singleChat.latestMessage.updatedAt = newMessage.updatedAt;
        }
        setAllChats([singleChat, ...allChats.filter((chat) => chat._id != newMessage.chat._id)]);
      }
    });
    if (singleChat == undefined) {
      const successFxn = (res) => {
        setAllChats([res.data.data, ...allChats]);
      };

      GetAuthRequest("api/chat/getOne?id=" + id, successFxn, enqueueSnackbar, navigate, setLoading);
    }
  }, [allChats]);

  useEffect(() => {
    if (socketState) {
      socketState.on("message received", (newMessage) => {
        updateChatsArray(newMessage);
        if (newMessage.chat._id != params.id && current_user && current_user.user) {
          setUnReadMap((prevMap) => {
            const newMap = new Map(prevMap);
            const key = newMessage.chat._id;
            if (newMap.has(key)) {
              newMap.set(key, parseInt(newMap.get(key)) + 1);
            } else {
              newMap.set(key, 1);
            }
            return newMap;
          });
          socketState.emit("updateUnRead", {
            chatId: newMessage.chat._id,
            count: 1,
          });
        }
      });
    }
    return () => {
      if (socketState) {
        socketState.off("message received");
      }
    };
  });

  return (
    <>
      {newChatModalOpen && <New_Chat_Modal setNewChatModalOpen={setNewChatModalOpen} />}
      {/* <NavBar />
      <div className={styles.main_container}>
        <div className={styles.container}>
          <div className={styles.left_container}>
            <div className={styles.header}>
              <h1 className={styles.heading}>Messenger</h1>
              <div
                className={styles.newBtn}
                onClick={() => {
                  setNewChatModalOpen(true);
                }}
              >
                <HiMiniPencilSquare />
              </div>
            </div>
            <div className={styles.body_container}>
              {allChats &&
                allChats.length > 0 &&
                allChats.map((ele) => {
                  return <ChatItem details={ele} key={ele._id} setUnReadMap={setUnReadMap} unReadMap={unReadMap} socket={socketState} />;
                })}
            </div>
          </div>
          <div className={styles.right_container}>
            {id == null ? (
              <>
                <div className={styles.ec_main_container}>
                  <p>Send private photos and messages to a friend or group</p>
                </div>
              </>
            ) : (
              <>
                <ChatContainer updateChatsArray={updateChatsArray} socket={socketState} setUnReadMap={setUnReadMap} unReadMap={unReadMap} />
              </>
            )}
          </div>
        </div>
      </div> */}
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <SideBar />
        <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", display: "flex" }}>
          {width > 950 && <FolderList setNewChatModalOpen={setNewChatModalOpen} allChats={allChats} setUnReadMap={setUnReadMap} unReadMap={unReadMap} socket={socketState} />}
          {width <= 950 && id == undefined && <FolderList setNewChatModalOpen={setNewChatModalOpen} allChats={allChats} setUnReadMap={setUnReadMap} unReadMap={unReadMap} socket={socketState} />}
          <div className={styles.right_container}>
            {id != null && id != undefined && <ChatContainer updateChatsArray={updateChatsArray} socket={socketState} setUnReadMap={setUnReadMap} unReadMap={unReadMap} />}
            {width > 950 && id == null && (
              <div className={styles.ec_main_container}>
                <h2 className={styles.h2}>Your messages</h2>
                <p className={styles.p}>Send private photos and messages to a friend or group</p>
                <Button size="small" variant="contained" sx={{ background: "#0095f6" }} onClick={() => setNewChatModalOpen(true)}>
                  Send Messages
                </Button>
              </div>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};

export default Messenger;

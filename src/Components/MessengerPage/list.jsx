import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import styles from "./list.module.css";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { Toolbar, IconButton, ListItemButton, Typography } from "@mui/material";
import { getUser } from "../../features/User/UserSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { memo } from "react";

const FolderList = memo(({ setNewChatModalOpen, allChats, setUnReadMap, unReadMap, socket }) => {
  const current_user = useSelector(getUser);
  const navigate = useNavigate();
  return (
    <div className={styles.mainContainer}>
      <Toolbar className={styles.toolbar}>
        <Typography className={styles.text_1}>{current_user && current_user.user && current_user.user.userName}</Typography>
        <IconButton onClick={() => setNewChatModalOpen(true)}>
          <HiMiniPencilSquare color="black"  />
        </IconButton>
      </Toolbar>
      <List className={styles.list}>
        {allChats &&
          current_user.user &&
          allChats.length > 0 &&
          allChats.map((ele) => {
            const user = ele.users[0]._id === current_user.user.id ? ele.users[1] : ele.users[0];
            const name = ele.isGroupChat ? ele.chatName : user.name;

            return (
              <ListItem
                disablePadding
                key={ele._id}
                onClick={() => {
                  navigate("/direct/t/" + ele._id);
                  setUnReadMap((prevMap) => {
                    const newMap = new Map(prevMap);
                    newMap.delete(ele._id);
                    return newMap;
                  });
                  // if (socket) {
                  //   socket.emit("updateUnRead", {
                  //     chatId: ele._id,
                  //     count: 0,
                  //   });
                  // }
                }}
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={name}
                    secondary={ele.latestMessage && ele.latestMessage.content}
                    className={styles.list_item}
                    primaryTypographyProps={{ className: styles.primaryText }}
                    secondaryTypographyProps={{ className: styles.secondaryText }}
                  />
                  {unReadMap && unReadMap.get(ele._id) && <div className={styles.badge}>{unReadMap.get(ele._id)}</div>}
                </ListItemButton>
              </ListItem>
            );

            // return <ChatItem details={ele} key={ele._id} setUnReadMap={setUnReadMap} unReadMap={unReadMap} socket={socketState} />;
          })}
        {/* <ListItem disablePadding>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={name}
              secondary={details.latestMessage && details.latestMessage.content}
              className={styles.list_item}
              primaryTypographyProps={{ className: styles.primaryText }}
              secondaryTypographyProps={{ className: styles.secondaryText }}
            />
            <div className={styles.badge}>5</div>
          </ListItemButton>
        </ListItem> */}
      </List>
    </div>
  );
})

export default FolderList;
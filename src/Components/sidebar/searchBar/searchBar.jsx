import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import styles from "./styles.module.css";
import { Avatar, CssBaseline, InputAdornment, ListItemAvatar, TextField, Toolbar, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { RxCrossCircled } from "react-icons/rx";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TemporaryDrawer({ setSearchBarOpen, searchBarOpen }) {
  const { enqueueSnackbar } = useSnackbar();
  const toggleDrawer = (newOpen) => () => {
    setSearchBarOpen(newOpen);
  };
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = React.useState();
  const [searchResult, setSearchResult] = React.useState([]);
  const searchUsers = (text) => {
    console.log(text);
    if (text != "") {
      axios
        .get("http://localhost:5000/api/user/search/" + text)
        .then((res) => {
          console.log(res);
          setSearchResult(res.data.data);
        })
        .catch(() => {
          enqueueSnackbar("Error", {
            variant: "error",
          });
        });
    } else {
      setSearchResult([]);
    }
  };
  return (
    <>
      <Drawer
        sx={{
          width: 320,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 320,
            boxSizing: "border-box",
          },
        }}
        onClose={()=>setSearchBarOpen(false)}
        className={styles.drawer}
        open={searchBarOpen}
        PaperProps={{ className: styles.drawer_paper }}
        ModalProps={{ className: styles.drawer_model }}
        slotProps={{ backdrop: { className: styles.backdrop } }}
      >
        <Toolbar className={styles.toolbar}>
          <Typography className={styles.text_h1}>Search</Typography>
        </Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center", marginBottom: "10px" }}>
          <TextField
            className={styles.search_Input}
            // label="TextField"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <RxCrossCircled />
                </InputAdornment>
              ),
              className: styles.input,
            }}
            placeholder="Search"
            onChange={(e) => searchUsers(e.target.value)}
            variant="filled"
          />
        </Box>
        <Box className={styles.box_output}>
          {searchResult && searchResult.length > 0 && (
            <List className={styles.search_list}>
              {searchResult.map((item, index) => (
                <ListItem key={index} className={styles.search_list_item} onClick={() => navigate("/" + item.userName)}>
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.userName}
                    secondary={item.name}
                    primaryTypographyProps={{ className: styles.primaryProps }}
                    secondaryTypographyProps={{ className: styles.secondaryProps }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
}

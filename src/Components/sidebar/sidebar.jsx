import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import insta_logo from "../../images/logoinsta.png";
import insta_logo_small from "../../images/instaLogoSmall.png";
import { GoHomeFill, GoSearch } from "react-icons/go";
import { ImCompass2 } from "react-icons/im";
import { BiMoviePlay } from "react-icons/bi";
import { BiMessageRounded } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { Avatar, ListItemAvatar } from "@mui/material";
import { IoMenuOutline } from "react-icons/io5";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "../../features/User/UserSlice";
import { GetAuthRequest } from "../../helper/authRequest";
import { useState, useEffect } from "react";
import NewPostModal from "../NavBar/NewPostModal";
import TemporaryDrawer from "./searchBar/searchBar";
import { memo } from "react";
import { LuPlusSquare } from "react-icons/lu";

const SideBar = memo(() => {
  const dispatch = useDispatch();
  const [searchBarOpen,setSearchBarOpen] = useState(false)
  const current_user = useSelector(getUser);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const[loading,setLoading] = useState(false);
  const iconsArray = [
    <GoHomeFill size={"24px"} color="black" title="Home" />,
    <GoSearch size={"24px"} color="black" />,
    <ImCompass2 size={"24px"} color="black" />,
    <BiMoviePlay size={"24px"} color="black" />,
    <BiMessageRounded size={"24px"} color="black" />,
    <LuPlusSquare size={"24px"} color="black" />,
  ];

  const handleClick = (index) => {
    switch (index) {
      case 0:
        navigate("/");
        break;
      case 1:
        console.log("object")
        setSearchBarOpen(!searchBarOpen)
        break;
      case 2:
        // Handle Explore click
        
        break;
      case 3:
        // Handle Reels click
        break;
      case 4:
        navigate("/direct/inbox")
        break;
      case 5:
        setIsOpen(true)
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const SuccessFxn = (response) => {
      console.log(response);
      dispatch(setUser(response.data.user));
    };
    if (!current_user.user) {
      GetAuthRequest("api/user/profile/isUser", SuccessFxn, enqueueSnackbar, navigate, setLoading);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);
  return (
    // <Box sx={{ display: "flex" }}>
    //   <CssBaseline />
    <>
      {isOpen && <NewPostModal setIsOpen={setIsOpen} />}

      <Drawer
        sx={{
        //   width: state == 0 ? 68 : 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            // width: state == 0 ? 68 : 240,
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "space-between",
          },
        }}
        PaperProps={{ className: styles.drawer_paper }}
        className={styles.drawer}
        variant="permanent"
        anchor="left"
      >
        <div>
          <List>
            <ListItem className={styles.listItemLogo} onClick={() => navigate("/")}>
               <img src={insta_logo} alt="instalogo" width="105px" onClick={() => navigate("/")} className={styles.logo_large} />
              <img src={insta_logo_small} alt="instalogo" width="24px" onClick={() => navigate("/")} className={styles.logo_small} />
            </ListItem>
            {["Home", "Search", "Explore", "Reels", "Messages","Create"].map((text, index) => (
              <ListItem key={text} disablePadding onClick={()=>handleClick(index)}>
                <ListItemButton className={styles.listItemBtn}>
                  <ListItemIcon className={styles.icon}>{iconsArray[index]}</ListItemIcon>
                  <ListItemText primary={text} className={styles.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding onClick={()=>{current_user.user && navigate("/"+current_user.user.userName)}}>
              <ListItemButton className={styles.listItemBtn}>
                <ListItemAvatar className={styles.listItemBtn}>
                  <Avatar sizes="24px" className={styles.avatar}>
                    {/* <ImageIcon /> */}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Profile" className={styles.text} />
              </ListItemButton>
            </ListItem>
          </List>
        </div>
        <List>
          <ListItem disablePadding>
            <ListItemButton className={styles.listItemBtn}>
              <ListItemIcon className={styles.icon}>{<IoMenuOutline size={"24px"} color="black" />}</ListItemIcon>
              <ListItemText primary="More" className={styles.text} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      {<TemporaryDrawer searchBarOpen={searchBarOpen} setSearchBarOpen={setSearchBarOpen}/>}
    </>
  );
})

export default SideBar;

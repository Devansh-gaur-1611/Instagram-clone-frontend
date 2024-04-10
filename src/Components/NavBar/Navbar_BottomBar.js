import React, { useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import { useSelector } from "react-redux";
import { getUser } from "../../features/User/UserSlice";
import NewPostModal from "./NewPostModal";
import { useNavigate } from "react-router-dom";
import home from "../../images/home1.svg";
import discover from "../../images/discover.svg";
import newPost from "../../images/newPost1.svg";
import feed from "../../images/feed.svg";
import { Avatar, BottomNavigation, BottomNavigationAction } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
import { GoHomeFill, GoSearch } from "react-icons/go";
import { ImCompass2 } from "react-icons/im";
import { BiMoviePlay } from "react-icons/bi";
import { BiMessageRounded } from "react-icons/bi";
import { LuPlusSquare } from "react-icons/lu";

const BottomBar = () => {
  const current_user = useSelector(getUser);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);
  return (
    <>
      {isOpen && <NewPostModal setIsOpen={setIsOpen} />}
      <div className={styles.bottombar_main_container}>
        {/* <div className={styles.bottom_icon} onClick={() => navigate("/")}>
          <img src={home} />
        </div>
        <div className={styles.bottom_icon}>
          <img src={discover} />
        </div>
        <div className={styles.bottom_icon} onClick={() => setIsOpen(true)}>
          <img src={newPost} />
        </div>
        <div className={styles.bottom_icon}>
          <img src={feed} />
        </div>
        <div className={styles.bottom_icon}>
          <Avatar src={current_user.user && current_user.user.profileImageUrl} className={styles.bottombar_profile_pic} onClick={() => navigate("/" + current_user.user.userName)} />
        </div> */}
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          className={styles.bottomNavigation}
        >
          <BottomNavigationAction icon={<GoHomeFill size={"24px"} />} onClick={() => navigate("/")} />
          <BottomNavigationAction icon={<GoSearch size={"24px"} />} />
          <BottomNavigationAction icon={<LuPlusSquare size={"24px"} onClick={() => setIsOpen(true)} />} />
          <BottomNavigationAction icon={<BiMoviePlay size={"24px"} />} />
          <BottomNavigationAction icon={<Avatar className={styles.avatar} sizes="24px" onClick={() => navigate("/" + current_user.user.userName)} />} />
        </BottomNavigation>
      </div>
    </>
  );
};

export default BottomBar;

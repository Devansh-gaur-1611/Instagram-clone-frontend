import React from "react";
import styles from "./MainContent.module.css";
import StatusBar from "../StatusBar/StatusBar";
import MainPage from "../MainPage/MainPage";
import InfoSection from "../info_section/info_section";
import Suggestions from "../Suggestions/Suggestions";
// import BottomBar from "../NavBar/Navbar_BottomBar";
import SideBar from "../sidebar/sidebar";
import { Box, CssBaseline } from "@mui/material";
function MainContent() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <SideBar />
        <div className={styles.main_container}>
          <div className={styles.container}>
            <div className={styles.left_container}>
              <StatusBar />
              <MainPage />
            </div>
            <div className={styles.right_container}>
              <InfoSection />
              <Suggestions />
            </div>
          </div>
        </div>
        {/* <BottomBar /> */}
      </Box>
    </>
  );
}

export default MainContent;

import React, { useRef, useState } from "react";
import styles from "./styles.module.css";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";
import { CiPlay1, CiPause1 } from "react-icons/ci";

const VideoV1 = ({src}) => {
  const [mute, setMute] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const video = useRef();

  const play = () => {
    if (video.current) {
      if (video.current.paused) {
        video.current.play();
        setIsPlaying(true);
      } else {
        video.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const muteVideo = () => {
    setMute(!mute);
    if (video.current) {
      video.current.muted = !video.current.muted;
    }
  };

  return (
    <div className={styles.container}>
      <video ref={video} src="https://firebasestorage.googleapis.com/v0/b/snapgram-57e54.appspot.com/o/images%2Fposts%2F20221105_134547.mp4?alt=media&token=86782fb3-e4a6-4a91-a672-1beab45732c1" autoPlay loop className={styles.video} muted></video>
      <button onClick={play} className={styles.playBtn}>
        {!isPlaying && <CiPlay1 />}
      </button>
      <button className={styles.muteBtn} onClick={muteVideo}>
        {mute ? <IoVolumeMuteOutline /> : <VscUnmute />}
      </button>
    </div>
  );
};

export default VideoV1;

import React, { useRef, useState } from 'react'
import { Avatar } from "@material-ui/core"
import styles from "./Stories.module.css"
import Stories from 'react-insta-stories';
import { useEffect } from 'react';
const StoriesPage = ({ setIsOpen, statusUrls }) => {
    const story = useRef()


    const [divHeight, setDivHeight] = useState();
    const [divWidth, setDivWidth] = useState()
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();

    useEffect(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    });
    const updateDimensions = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };
    const updateHeight = () => {
        setHeight(window.innerHeight);
    };
    const updateWidth = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", updateHeight);
        window.addEventListener("resize", updateWidth);
        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, [width, height]);

    useEffect(() => {
        if (width < height) {
            setDivWidth(0.34 * width);
            setDivHeight(0.34 * width / 0.5625);
        } else {
            setDivHeight(0.92 * height);
            setDivWidth(0.92 * height * 0.5625)
        }
    }, [width, height]);

    return (
        <>
            <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
            <div className={styles.modal}>
                <Stories
                    keyboardNavigation
                    stories={statusUrls}
                    defaultInterval={1500}
                    width={divWidth}
                    height={divHeight}
                    loop={true}
                />
            </div>
        </>
    )
}

export default StoriesPage
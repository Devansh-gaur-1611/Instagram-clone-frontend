import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { AiOutlineClose, AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { BiUserPlus } from "react-icons/bi";
import axios from "axios";
import { PostAuthRequest } from "../../../helper/authRequest";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { getUser } from "../../../features/User/UserSlice";
const New_Chat_Modal = ({ setNewChatModalOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const current_user = useSelector(getUser)
  const [loading,setLoading] = useState(false)
  const searchUsers = (text) => {
    console.log(text);
    if (text != "") {
      axios
        .get("http://localhost:5000/api/user/search/" + text)
        .then((res) => {
          setUsers(res.data.data);
          var newArray = [];
          res.data.data.map((ele) => {
            newArray.push(selectedUsers.find((selectedUser) => selectedUser._id == ele._id));
          });
          setCheckedList(newArray);
          console.log(res);
        })
        .catch(() => {
          enqueueSnackbar("Error", {
            variant: "error",
          });
        });
    } else {
      setUsers([]);
    }
  };
  const addUsers = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    // setUsers([]);
  };

  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id != userId));
  };
  const removeUserTags = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id != userId));
    users.map((user, i) => {
      if (user._id === userId) {
        updateCheckList(i, !checkedList[i]);
      }
    });
  };

  const updateCheckList = (index, val) => {
    var newArray = [...checkedList];
    newArray[index] = val;
    setCheckedList(newArray);
  };

  const createChat = () => {
    if (selectedUsers.length == 0) {
      enqueueSnackbar("Please select atleast one user", {
        variant: "error",
      });
      return;
    }
    if (selectedUsers.length == 1) {
      const body = {
        userId: selectedUsers[0]._id,
      };
      const successFunction = (res) => {
        navigate("/direct/t/" + res.data.data._id);
        setNewChatModalOpen(false);
      };
      PostAuthRequest("api/chat/", body, successFunction, enqueueSnackbar, navigate,setLoading);
    } else {
      var userIds = [];
      selectedUsers.map((user) => {
        userIds.push(user._id);
      });

      const body = {
        users: selectedUsers,
        chatName: "You, " + selectedUsers[0].name + " & " + (selectedUsers.length - 1) + " others",
      };
      const successFunction = (res) => {
        console.log(res);
        navigate("/direct/t/" + res.data.data._id);
      };
      PostAuthRequest("api/chat/group/", body, successFunction, enqueueSnackbar, navigate,setLoading);
    }
  };

  return (
    <>
      <div className={styles.darkBG} onClick={() => setNewChatModalOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>New Message</h5>
            <button className={styles.closeBtn} onClick={() => setNewChatModalOpen(false)}>
              <AiOutlineClose width="24px" />
            </button>
          </div>

          <form className={styles.form}>
            <div className={styles.search}>
              <label className={styles.text}>To : </label>
              <input
                className={styles.input}
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  searchUsers(e.target.value);
                  setCheckedList([]);
                }}
              />
            </div>
            {selectedUsers && selectedUsers.length > 0 && (
              <div className={styles.tagsContainer}>
                {selectedUsers.map((user) => {
                  return (
                    <div className={styles.tag}>
                      <p className={styles.tag_text}>{user.name}</p>
                      <AiOutlineClose width="8px" color={"#2ca0ff"} fontSize={"12px"} cursor={"pointer"} onClick={() => removeUserTags(user._id)} />
                    </div>
                  );
                })}
              </div>
            )}
          </form>
          <div className={styles.modalFooter}>
            {current_user.user && users.map((user, i) => {
              if(current_user.user.id == user._id ){
                return;
              }
              //   setCheckedList([...checkedList, selectedUsers.find((selectedUser) => selectedUser._id == user._id)]);
              return (
                <div
                  className={styles.container}
                  onClick={() => {
                    if (checkedList[i]) {
                      removeUser(user._id);
                      updateCheckList(i, !checkedList[i]);
                    } else {
                      addUsers(user);
                      updateCheckList(i, !checkedList[i]);
                    }
                  }}
                >
                  <div className={styles.left_container}>
                    <div className={styles.avatar}>
                      <img src={"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} alt="avatar" className={styles.avatar_img} />
                    </div>
                  </div>
                  <div className={styles.right_container}>
                    <div className={styles.info}>
                      <div className={styles.name}>{user.name}</div>
                      <div className={styles.msg}>{user.userName}</div>
                    </div>
                    <div>
                      <input
                        className={styles.input_radio}
                        type="radio"
                        checked={checkedList[i]}
                        onClick={(e) => {
                          if (e.target.checked) {
                            updateCheckList(i, !checkedList[i]);
                            addUsers(user);
                          } else {
                            updateCheckList(i, !checkedList[i]);
                            removeUser(user);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.btn_container}>
            {/* <button className={styles.btn} onClick={() => createChat()}>
              Chat
            </button> */}
            <Button className={styles.btn} variant="contained" disabled={selectedUsers.length > 0 ? false : true}onClick={() => createChat()}>
              Chat
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default New_Chat_Modal;

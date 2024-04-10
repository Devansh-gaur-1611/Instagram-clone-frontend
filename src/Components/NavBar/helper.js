import { storage } from "../../firebase";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
import { PostAuthRequest } from "../../helper/authRequest";
import { setLoading } from "../../features/Loading/LoadingSlice";

// Upload the image on firebase storage
export const uploadFiles = (file, fileType, successFxn, enqueueSnackbar, navigate, setLoading) => {
  // setLoading(true);
  setLoading(true);
  if (!file) return;
  const storageRef = ref(storage, `images/posts/${new Date().getTime()}${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (error) => {
      // enqueueSnackbar("Some error occurred while uploading image. Please try again", {
      //   variant: "error",
      // });
      // setLoading(false);
      setLoading(false);
      alert("Some error occurred while uploading image. Please try again");
      // return null
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        postFunctions(url, fileType, successFxn, enqueueSnackbar, navigate, setLoading);
      });
    }
  );
};

export const postFunctions = (url, fileType, successFxn, enqueueSnackbar, navigate, setLoading) => {
  if (url != null) {
    const data = {
      postFileUrl: url,
      postType: fileType,
    };

    PostAuthRequest("api/post/create", data, successFxn, enqueueSnackbar, navigate, setLoading);
    setLoading(false);
  } else {    
    console.log("File Url not found");
  }
};

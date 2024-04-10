import { storage } from "../../firebase";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
import { PostAuthRequest } from "../../helper/authRequest";
import { setLoading } from "../../features/Loading/LoadingSlice";

// Upload the image on firebase storage
export const uploadFiles = (file, successFxn, enqueueSnackbar, navigate, setLoading) => {
  setLoading(true);
  if (!file) return;
  const storageRef = ref(storage, `images/status/${new Date().getTime()}${file.name}`);
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
        postFunctions(url, successFxn, enqueueSnackbar, navigate, setLoading);
      });
    }
  );
};

export const postFunctions = (url, successFxn, enqueueSnackbar, navigate, setLoading) => {
  if (url != null) {
    const data = {
      fileUrl: url,
    };
    PostAuthRequest("api/status/create", data, successFxn, enqueueSnackbar, navigate, setLoading);
  } else {
    console.log("No first");
    setLoading(false);
  }
};

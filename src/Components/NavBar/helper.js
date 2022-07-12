import { storage } from "../../firebase";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
import { PostAuthRequest } from "../Post/authRequest"



// Upload the image on firebase storage
export const uploadFiles = (file, fileType,successFxn, enqueueSnackbar, navigate) => {
    // setLoading(true);
    if (!file) return;
    const storageRef = ref(storage, `images/posts/${new Date().getTime()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        "state_changed",
        (snapshot) => { },
        (error) => {
            // enqueueSnackbar("Some error occurred while uploading image. Please try again", {
            //   variant: "error",
            // });
            // setLoading(false);
            alert("Some error occurred while uploading image. Please try again")
            // return null
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log("Hi       " + url);
                postFunctions(url, fileType,successFxn, enqueueSnackbar, navigate)
            });
        }
    );
};

export const postFunctions = (url, fileType,successFxn, enqueueSnackbar, navigate) => {

    if (url != null) {
        console.log("first")
        const data = {
            "postUserId": localStorage.getItem("userId"),
            "postFileUrl": url,
            "postLikesCount": 0,
            "postLikeUserIds": [],
            "postType": fileType

        }
     
        PostAuthRequest("api/post/create", data, successFxn, enqueueSnackbar, navigate)


    } else {
        console.log("No first")
    }

}
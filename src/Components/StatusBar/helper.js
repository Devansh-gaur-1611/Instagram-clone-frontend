import { storage } from "../../firebase";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
import { PostAuthRequest } from "../Post/authRequest"



// Upload the image on firebase storage
export const uploadFiles = (file, successFxn, enqueueSnackbar, navigate) => {
    // setLoading(true);
    if (!file) return;
    const storageRef = ref(storage, `images/status/${new Date().getTime()}${file.name}`);
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
                postFunctions(url, successFxn, enqueueSnackbar, navigate)
            });
        }
    );
};

export const postFunctions = (url, successFxn, enqueueSnackbar, navigate) => {

    if (url != null) {
        console.log("first")
        const data = {
            userId:localStorage.getItem("userId"),
            fileUrl:url

        }
     
        PostAuthRequest("api/status/create", data, successFxn, enqueueSnackbar, navigate)


    } else {
        console.log("No first")
    }

}
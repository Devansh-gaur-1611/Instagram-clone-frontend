import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {useEffect} from "react"
import LoginPage from "./Components/LoginPage/LoginPage";
import HomePage from "./Components/HomePage/HomePage";
import SignupPage from "./Components/LoginPage/Register"
import { useVideoAutoplay } from "./Components/Post/videoAutoPlay"
import UserProfile from "../src/Components/Profile/userProfile"
import PostsPage from "./Components/Post/PostsPage";
import {useSelector} from "react-redux"
import {getLoading} from "./features/Loading/LoadingSlice"

function App() {
  useVideoAutoplay()
  const loadingState = useSelector(getLoading)

  useEffect(() => {
    if (loadingState && loadingState.loading==true) {
      document.body.style.overflow = 'hidden'
    }else{
      document.body.style.overflow = 'auto'
    }
  }, [loadingState.loading])

  return (
    <Router>
      <div className="App">

        <Routes>
          <Route key="1" exact path="/login" element={<LoginPage />} />
          <Route key="2" exact path="/" element={<HomePage />} />
          <Route key="3" exact path="/signup" element={<SignupPage />} />
          <Route key="4" exact path="/:userName" element={<UserProfile />} />
          <Route key="5" exact path="/p/:postSlug" element={<PostsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

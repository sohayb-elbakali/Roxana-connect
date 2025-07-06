import { Fragment, useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Alert from "./components/Alert";
import Developers from "./components/Developers";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Post from "./components/Posts/Post";
import Posts from "./components/Posts/Posts";
import Private from "./components/Private";
import Profile from "./components/Profile";
import AddEducation from "./components/ProfileForms/AddEducation";
import AddExperience from "./components/ProfileForms/AddExperience";
import ProfileForm from "./components/ProfileForms/ProfileForm";
import Settings from "./components/Settings";
import Sidebar from "./components/Sidebar";
import Login from "./components/Users/Login";
import Register from "./components/Users/Register";
import { loadUser } from "./redux/modules/users";
import store from "./redux/store";
import { setAuthToken } from "./utils";

const App = () => {
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter basename="/roxana">
        <ToastContainer
          position="top-right"
          autoClose={500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Fragment>
          <Alert />
          <Navbar />
          <Sidebar />
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/home" element={<Private component={Home} />} />
            <Route
              exact
              path="/create-profile"
              element={<Private component={ProfileForm} />}
            />
            <Route
              exact
              path="/add-education"
              element={<Private component={AddEducation} />}
            />
            <Route
              exact
              path="/add-experience"
              element={<Private component={AddExperience} />}
            />
            <Route
              exact
              path="/developers"
              element={<Private component={Developers} />}
            />
            <Route
              exact
              path="/profile/:id"
              element={<Private component={Profile} />}
            />
            <Route
              exact
              path="/settings"
              element={<Private component={Settings} />}
            />
            <Route
              exact
              path="/edit-profile"
              element={<Private component={ProfileForm} />}
            />
            <Route
              exact
              path="/posts"
              element={<Private component={Posts} />}
            />
            <Route
              exact
              path="/posts/:id"
              element={<Private component={Post} />}
            />
          </Routes>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

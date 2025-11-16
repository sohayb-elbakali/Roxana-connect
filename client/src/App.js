import { Fragment, useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Alert from "./components/Alert";
import AdminDashboard from "./components/AdminDashboard";
import Developers from "./components/Developers";
import Home from "./components/Home";
import Landing from "./components/Landing";
import Navbar from "./components/Navbar";
import Post from "./components/Posts/Post";
import Posts from "./components/Posts/Posts";
import Private from "./components/Private";
import { InternshipFeed, InternshipDetail, InternshipForm } from "./components/Internships";
import { TrackerDashboard } from "./components/Tracker";
import Profile from "./components/Profile";
import AddEducation from "./components/ProfileForms/AddEducation";
import AddExperience from "./components/ProfileForms/AddExperience";
import ProfileForm from "./components/ProfileForms/ProfileForm";
import Settings from "./components/Settings";
import Sidebar from "./components/Sidebar";
import Login from "./components/Users/Login";
import Register from "./components/Users/Register";
import VerifyEmail from "./components/Users/VerifyEmail";
import ForgotPassword from "./components/Users/ForgotPassword";
import ResetPassword from "./components/Users/ResetPassword";
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
      <BrowserRouter 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
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
            <Route exact path="/verify-email/:token" element={<VerifyEmail />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/reset-password/:token" element={<ResetPassword />} />
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
            <Route
              exact
              path="/feed"
              element={<Private component={InternshipFeed} />}
            />
            <Route
              exact
              path="/tracker"
              element={<Private component={TrackerDashboard} />}
            />
            <Route
              exact
              path="/internship/:id"
              element={<Private component={InternshipDetail} />}
            />
            <Route
              exact
              path="/internship/create"
              element={<Private component={InternshipForm} />}
            />
            <Route
              exact
              path="/internship/edit/:id"
              element={<Private component={InternshipForm} />}
            />
            <Route
              exact
              path="/admin"
              element={<Private component={AdminDashboard} />}
            />
          </Routes>
        </Fragment>
      </BrowserRouter>
    </Provider>
  );
};

export default App;

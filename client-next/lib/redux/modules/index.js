import { combineReducers } from "redux";
import users from "./users";
import alerts from "./alerts";
import profiles from "./profiles";
import posts from "./posts";
import internships from "./internships";
import tracking from "./tracking";

export default combineReducers( {
    users, alerts, profiles, posts, internships, tracking
});
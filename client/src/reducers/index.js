import { combineReducers } from "redux";
import anotherReducer from "./anotherReducer";

const rootReducer = combineReducers({
  another: anotherReducer
});

export default rootReducer;

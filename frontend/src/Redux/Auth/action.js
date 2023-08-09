import * as types from "./actionType";
import { axiosInstance } from "../../utils/axioxconfig";

export const loginAPI = (creds) => async (dispatch) => {
  dispatch({ type: types.ACCOUNT_LOADING });
  try {
    const res = await axiosInstance.post("/users/login", creds);
    dispatch({ type: types.LOGIN_SUCCESS, payload: res.data.token, message: res.data.msg });
  } catch (error) {
    dispatch({ type: types.ACCOUNT_ERROR, payload: error });
    return Promise.reject(error.response.data.message);
  }
};

export const signupAPI = (creds) => async (dispatch) => {
  dispatch({ type: types.ACCOUNT_LOADING });
  try {
    const res = await axiosInstance.post("/users/signup", creds);
    dispatch({ type: types.SIGNUP_SUCCESS, payload: res });
  } catch (error) {
    dispatch({ type: types.ACCOUNT_ERROR, payload: error.response.data.message });
    return Promise.reject(error.response.data.message);
  }
};

export const checkuserDetails = () => async (dispatch) => {
  dispatch({ type: types.CHECK_USER_DETAILS_REQUEST });
  try {
    const res = await axiosInstance.get("/users/");
    dispatch({ type: types.CHECK_USER_DETAILS_SUCCESS, payload: res.data.email });
  } catch (error) {
    dispatch({ type: types.CHECK_USER_DETAILS_FAILED, payload: error });
    return Promise.reject(error.response.data.message);
  }
};

export const logoutAPI = () => async (dispatch) => {
  dispatch({ type: types.ACCOUNT_LOGOUT });
};

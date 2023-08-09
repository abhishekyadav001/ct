import { clearLocalStorage, getLocalStorageItem, setLocalStorageItem } from "../../utils/localStorage";
import * as types from "./actionType";

const initData = {
  isLoading: false,
  isError: false,
  errorMessage: "",
  signupStatus: false,
  userDetails: "",
  auth: getLocalStorageItem("accessToken") || "",
  token: getLocalStorageItem("accessToken") || "",
};

export const authReducer = (state = initData, { type, payload }) => {
  switch (type) {
    case types.ACCOUNT_LOADING:
      return { ...state, isLoading: true };
    case types.ACCOUNT_ERROR:
      console.log(payload);
      return {
        ...state,
        isLoading: false,
        isError: true,
        signupStatus: false,
        errorMessage: payload.response.data.msg,
      };
    case types.LOGIN_SUCCESS:
      setLocalStorageItem("accessToken", payload);
      return { ...state, isLoading: false, token: payload };
    case types.SIGNUP_SUCCESS:
      return { ...state, isLoading: false, signupStatus: true };
    case types.ACCOUNT_LOGOUT:
      clearLocalStorage();
      return { ...state, isLoading: false, token: "", auth: "" };
    case types.CHECK_USER_DETAILS_REQUEST:
      return { ...state, isLoading: true };
    case types.CHECK_USER_DETAILS_SUCCESS:
      return { ...state, isLoading: false, userDetails: payload };
    case types.CHECK_USER_DETAILS_FAILED:
      return { ...state, isError: true };
    default:
      return state;
  }
};

const initialState = {
  userList: {},
};

const loginData = (state = initialState, action) => {
  switch (action.type) {
    case "USER_DATA":
      return { ...state, userList: action.payload };

    default:
      return state;
  }
};
export default loginData;

const initialState = {
  clientLogin: {},
  empLogin: {},
};

const loginData = (state = initialState, action) => {
  switch (action.type) {
    case "CLIENT_LOGIN":
      return { ...state, clientLogin: action.payload };
    case "EMP_LOGIN":
      return { ...state, empLogin: action.payload };

    default:
      return state;
  }
};
export default loginData;
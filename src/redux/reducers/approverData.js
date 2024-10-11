const initialState = {
  approvers: {},
};

const approverData = (state = initialState, action) => {
  switch (action.type) {
    case "APPROVER_GET":
      return { ...state, userList: action.payload };

    default:
      return state;
  }
};
export default approverData;

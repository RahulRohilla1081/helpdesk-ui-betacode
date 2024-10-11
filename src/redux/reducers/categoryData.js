const initialState = {
  category: [],
  subCategory: {},
};

const categoryData = (state = initialState, action) => {
  switch (action.type) {
    case "CATEGORY":
      return { ...state, category: action.payload };
    case "SUB_CATEGORY":
      return { ...state, subCategory: action.payload };

    default:
      return state;
  }
};
export default categoryData;

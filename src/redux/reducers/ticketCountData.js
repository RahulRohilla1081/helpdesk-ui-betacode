const initialState = {
  ticketCount: {},
};

const ticketCountData = (state = initialState, action) => {
  switch (action.type) {
    case "TICKET_COUNT":
      return { ...state, ticketCount: action.payload };

    default:
      return state;
  }
};
export default ticketCountData;

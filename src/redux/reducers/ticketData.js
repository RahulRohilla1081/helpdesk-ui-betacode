const initialState = {
  allTickets: [],
  ticketByFlag: [],
};

const ticketData = (state = initialState, action) => {
  switch (action.type) {
    case "ALL_TICKET":
      return { ...state, allTickets: action.payload };
    case "TICKET_DATA_BY_FLAG":
      return { ...state, ticketByFlag: action.payload };

    default:
      return state;
  }
};
export default ticketData;

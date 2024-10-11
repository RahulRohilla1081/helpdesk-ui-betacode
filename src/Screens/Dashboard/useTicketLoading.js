import axios from "axios";
import React, { useEffect, useState } from "react";
import AXIOS from "../../Utils/AXIOS";

function useTicketLoading(
  query,
  pageNumber,
  LOGIN_ID,
  SelectedDDfilter,
  selectedSearchByFilter,
  searchQuery,
  CLIENT_ID,
  setPageNumber
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [Tickets, setTickets] = useState([]);

  useEffect(() => {
    setTickets([]);
  }, [query, SelectedDDfilter]);
  useEffect(() => {
    if (SelectedDDfilter) {
      let tempFlagArr = [];
      SelectedDDfilter.map((val) => {
        tempFlagArr.push(val.value);
      });
      setLoading(true);
      setError(false);

      let cancel;
      axios({
        method: "GET",
        url: AXIOS.defaultPort + AXIOS.getDashboardTickets,
        params: {
          LOGIN_ID: LOGIN_ID,
          pageNumber: pageNumber,
          FLAG: JSON.stringify(tempFlagArr),
          searchFlag: selectedSearchByFilter,
          searchValue: searchQuery,
          CLIENT_ID: CLIENT_ID == null ? "" : CLIENT_ID,
        },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
        .then((res) => {
          console.log("resData....", res.data.TICKETS);

          if (res.data.TICKETS.length > 0) {
            setHasMore(true);
          } else {
            setHasMore(false);
          }

          let allTickets = [];

          allTickets = [...Tickets, , ...res.data.TICKETS];
          console.log(
            "Sdajsdhjasdasd",
            res.data.TICKETS.length,
            allTickets.length
          );

          let uniqueTickets = [];

          allTickets.map((val) => {
            let index = uniqueTickets.findIndex((item) => {
              return item.TICKET_ID == val.TICKET_ID;
            });

            if (index == -1) {
              uniqueTickets.push({
                ...val,
              });
            }
          });

          uniqueTickets.sort((a, b) => b.TICKET_ID - a.TICKET_ID);
          setTickets(uniqueTickets);
          setLoading(false);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
          setLoading(false);
          setError(true);
        });

      return () => cancel();
    }
  }, [query, pageNumber]);

  useEffect(() => {
    if (SelectedDDfilter) {
      setTickets([]);

      let tempFlagArr = [];
      SelectedDDfilter.map((val) => {
        tempFlagArr.push(val.value);
      });
      setLoading(true);
      setError(false);

      let cancel;

      axios({
        method: "GET",
        url: AXIOS.defaultPort + AXIOS.getDashboardTickets,
        params: {
          LOGIN_ID: LOGIN_ID,
          pageNumber: 1,
          FLAG: JSON.stringify(tempFlagArr),
          searchFlag: selectedSearchByFilter,
          searchValue: searchQuery,
          CLIENT_ID: CLIENT_ID == null ? "" : CLIENT_ID,
        },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
        .then((res) => {
          setPageNumber(1);
          console.log(
            "ASdsakjdbhasj kajsdas",
            {
              LOGIN_ID: LOGIN_ID,
              pageNumber: 1,
              pageNumber2: pageNumber,
              FLAG: JSON.stringify(tempFlagArr),
              searchFlag: selectedSearchByFilter,
              searchValue: searchQuery,
              CLIENT_ID: CLIENT_ID == null ? "" : CLIENT_ID,
            },
            res.data.TICKETS
          );
          if (res.data.TICKETS.length > 0) {
            setHasMore(true);
          } else {
            setHasMore(true);
          }

          let allTickets = [];
          allTickets = [...res.data.TICKETS];

          let uniqueTickets = [];

          allTickets.map((val) => {
            let index = uniqueTickets.findIndex((item) => {
              return item.TICKET_ID == val.TICKET_ID;
            });

            if (index == -1) {
              uniqueTickets.push({
                ...val,
              });
            }
          });

          uniqueTickets.sort((a, b) => b.TICKET_ID - a.TICKET_ID);
          setTickets(uniqueTickets);
          setLoading(false);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
          setLoading(false);
          setError(true);
        });
      return () => cancel();
    }
  }, [searchQuery, SelectedDDfilter]);
  return {
    loading,
    error,
    Tickets,
    hasMore,
  };
}

export default useTicketLoading;

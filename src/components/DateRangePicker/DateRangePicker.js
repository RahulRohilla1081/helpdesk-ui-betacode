import React, { useEffect, useState } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";
import moment from "moment";
import "./style.css"

const DateRangePickerComponent = ({ dateRange, setDateRange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {

    console.log(
      "Asdkjasdjkasdsa",
      moment(startDate).format("YYYY-MM-DD"),
      startDate
    );
    
    setDateRange({
      START_DATE: startDate ==null ? null : moment(startDate).format("YYYY-MM-DD"),
      END_DATE: endDate ==null ? null : moment(endDate).format("YYYY-MM-DD"),
    });
  }, [startDate,endDate]);

  return (
    <div>
      <DateRangePicker
        startDate={startDate}
        startDateId="your_unique_start_date_id"
        endDate={endDate}
        endDateId="your_unique_end_date_id"
        onDatesChange={({ startDate, endDate }) => {
          setStartDate(startDate);
          setEndDate(endDate);
          // setDateRange({
          //   START_DATE: startDate,
          //   END_DATE: endDate,
          // });
        }}
        focusedInput={focusedInput}
        onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
        isOutsideRange={() => false} // Allows selection of past dates
        showClearDates={true} // Option to clear selected dates
        numberOfMonths={2} // Show 2 months side by side
      />
    </div>
  );
};

export default DateRangePickerComponent;

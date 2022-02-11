import { useEffect, useState } from "react";
import addYears from "date-fns/addYears";
import isWeekend from "date-fns/isWeekend";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import PickersDay from "@mui/lab/PickersDay";
import TextField from "@mui/material/TextField";
import { useQuery } from "@apollo/react-hooks";
import { QUERY_INTERVIEWS } from "../../gql/interview/queries";
import { PickersDayProps } from "@mui/lab";
import { IInterviewResult } from "../../gql/interview/types";
import { convertToSimpleDate } from "../../date-converter";
import Interviews from "../interviews";

const today = new Date();
const one_year_from_today = addYears(today, 1);

const Calendar = () => {
  const { loading, data } = useQuery<IInterviewResult>(QUERY_INTERVIEWS, {
    pollInterval: 500,
  });
  const [interviewDates, setInterviewDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  useEffect(() => {
    if (!data) return;
    if (data.interviews) {
      setInterviewDates(
        data.interviews.map((i) => convertToSimpleDate(i.scheduledTime))
      );
    }
  }, [data]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <h2>Interview Schedule</h2>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          openTo="day"
          value={selectedDate}
          onChange={(newDate) => {
            setSelectedDate(newDate!);
          }}
          renderInput={(params) => <TextField {...params} />}
          minDate={today}
          maxDate={one_year_from_today}
          shouldDisableDate={(day) => isWeekend(day)}
          renderDay={(
            day: Date,
            selecteddays: (Date | null)[],
            dayProps: PickersDayProps<Date>
          ) => {
            if (interviewDates.includes(convertToSimpleDate(day))) {
              return (
                <PickersDay
                  {...dayProps}
                  style={{ backgroundColor: "#ffd600", fontWeight: "bold" }}
                />
              );
            }

            return <PickersDay {...dayProps} />;
          }}
        />
      </LocalizationProvider>
      <Interviews selectedDate={selectedDate} interviews={data?.interviews} />
    </div>
  );
};

export default Calendar;

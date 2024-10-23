import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend Day.js with the necessary plugins
dayjs.extend(utc);
dayjs.extend(timezone);

let hoursdate = {};

function BasicDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: "80vw" }}>
      <DemoContainer
        components={["DatePicker"]}
        sx={{
          width: "80vw",
          display: "block",
          textAlign: "center",
          margin:"5vw",
          
          
        }}
      >
        <DatePicker 
          
          sx={{
            width: "100%",  // Set to 100% width
            flexGrow: 1,     // Ensure it grows within its container
            maxWidth: "none", // Remove any max-width constraints
            textAlign: "center",
            
            
          }}
          label="Please select booking date"
          onChange={(value) => {
            // Convert the date to Indian Standard Time (IST)
            const dateInTimezone = dayjs(value).tz('Asia/Kolkata');

            // Manually format the date as YYYY-MM-DDTHH:mm:ss.sssZ but in IST
            hoursdate = dateInTimezone.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            //console.log(hoursdate); // Log the date in IST timezone in ISO-like format
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

export { BasicDatePicker, hoursdate };

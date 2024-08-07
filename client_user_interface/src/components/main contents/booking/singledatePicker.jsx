import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
let hoursdate = {};
 function BasicDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
      
        components={["DatePicker"]}
        style={{
          width: "80vw",
        }}
      >
        <DatePicker label="Basic date picker" onChange={(value) => {
        hoursdate = value.$d;
        console.log(value.$d);
      }} />
      </DemoContainer>
    </LocalizationProvider>
  );
}
export { BasicDatePicker, hoursdate };

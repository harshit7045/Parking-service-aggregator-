import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
let endTime={};
 function EndStaticTimePickerLandscape() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticTimePicker orientation="landscape" sx={{borderRadius: "20px"}}
      onChange={(value)=>{
         endTime=value.$d.toTimeString()
         console.log(value.$d)
      }} />
    </LocalizationProvider>
  );
}
export {EndStaticTimePickerLandscape,endTime};
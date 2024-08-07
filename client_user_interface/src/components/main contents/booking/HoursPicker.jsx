import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
let startTime={}
 function StaticTimePickerLandscape() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticTimePicker onChange={(value) => {
        startTime=value.$d.toTimeString()
        console.log(value.$d)
      }
      } orientation="landscape" />
    </LocalizationProvider>
  );
}
export {StaticTimePickerLandscape,startTime} 
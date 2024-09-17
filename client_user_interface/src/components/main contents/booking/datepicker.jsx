import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DesktopDateRangePicker, MobileDateRangePicker } from '@mui/x-date-pickers-pro';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/material';

let dateData = {
  start: []
};

function BasicDateRangePicker() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Checks if screen is small

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%' }}>
        <DemoContainer components={['DateRangePicker']}>
          {isSmallScreen ? (
            // Render the mobile version on small screens
            <MobileDateRangePicker
              onChange={(value) => {
                dateData = value;
              }}
              localeText={{ start: 'Check-in', end: 'Check-out' }}
            />
          ) : (
            // Render the desktop version on larger screens
            <DesktopDateRangePicker
              onChange={(value) => {
                dateData = value;
              }}
              localeText={{ start: 'Check-in', end: 'Check-out' }}
            />
          )}
        </DemoContainer>
      </Box>
    </LocalizationProvider>
  );
}

export { BasicDateRangePicker, dateData };

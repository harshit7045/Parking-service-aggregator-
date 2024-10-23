import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';

let startTime = {};

function StaticTimePickerLandscape() {
  const [orientation, setOrientation] = React.useState(
    window.innerWidth < 768 ? 'portrait' : 'landscape' // Initial orientation based on screen size
  );

  // Handle screen resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticTimePicker
        sx={{ borderRadius: '20px' }}
        onChange={(value) => {
          startTime = value.$d.toTimeString();
          //console.log(value.$d);
        }}
        orientation={orientation} // Dynamically set orientation
      />
    </LocalizationProvider>
  );
}

export { StaticTimePickerLandscape, startTime };

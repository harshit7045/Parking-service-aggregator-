import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';

let endTime = {};

function EndStaticTimePickerLandscape() {
  const [orientation, setOrientation] = React.useState(
    window.innerWidth < 768 ? 'portrait' : 'landscape' // Initial value based on screen size
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

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticTimePicker
        orientation={orientation}
        onChange={(value) => {
          endTime = value.$d.toTimeString();
          console.log(value.$d);
        }}
      />
    </LocalizationProvider>
  );
}

export { EndStaticTimePickerLandscape, endTime };

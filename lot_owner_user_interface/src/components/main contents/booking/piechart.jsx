import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie({ serverMessage }) {
  console.log(serverMessage);

  const data = [
    { id: 0, value: serverMessage.onlineBookingLotsAndOccupied, label: 'online lots and occupied'  },
    { id: 1, value: serverMessage.iotBookingLotsAndOccupied, label: 'iot lots and occupied' },
    { id: 2, value: serverMessage.onlineBookingLotsAndNotOccupied, label: 'online lots and not occupied' },
    { id: 3, value: serverMessage.iotBookingLotsAndNotOccupied, label: 'iot lots and not occupied' },
  ].filter(d => d.value > 0); // Filter out slices with a value of 0

  return (
    <PieChart
      series={[
        {
          data,
        },
      ]}
      sx={{ width: '100%', height: '100%' }}
    />
  );
}

import React from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';

export default function BasicSelect({ model, onModelChange }) {
  const [age, setAge] = React.useState(model);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setAge(newValue);
    onModelChange(newValue);
  };

  return (
    <Box sx={{ minWidth: "20vw", height: "100%" }}>
      <FormControl fullWidth sx={{ height: "100%" }}>
        <InputLabel id="demo-simple-select-label">Select Booking Model</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Booking Model"
          onChange={handleChange}
        >
          <MenuItem value={"hours"}>Hour Wise</MenuItem>
          <MenuItem value={"date"}>Date Wise</MenuItem>
          <MenuItem value={"onthego"}>On the Go</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

function DatePicker({ setFormData }) {
  const [value, setValue] = useState(null)

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      time: value ? value.$d : null,
    }))
  }, [value])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        renderInput={(props) => (
          <TextField sx={{ width: 250, margin: '1rem' }} {...props} />
        )}
        label='Date & Time'
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
        }}
      />
    </LocalizationProvider>
  )
}

export default DatePicker

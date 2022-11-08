import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
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
          <TextField sx={{ width: 300, margin: '1rem' }} {...props} />
        )}
        label='DateTimePicker'
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
        }}
      />
    </LocalizationProvider>
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    //   <TextField
    //     id='datetime-local'
    //     label='Next appointment'
    //     type='datetime-local'
    //     defaultValue='2017-05-24T10:30'
    //     sx={{ width: 300, margin: '1rem' }}
    //     InputLabelProps={{
    //       shrink: true,
    //     }}
    //     onChange={setValue(newValue)}
    //   />
    // </LocalizationProvider>
  )
}

export default DatePicker

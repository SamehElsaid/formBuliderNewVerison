import { Autocomplete, TextField } from '@mui/material'
import React, { useState } from 'react'

function Design() {
  const [top100Films] = useState([
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 }
  ])

  // Set a default value. Here we initialize with the first film,
  // but you can adjust this as needed.
  const [value, setValue] = useState([top100Films[0]])
  console.log(value)

  

  return (
    <div>
      <Autocomplete
        multiple
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        sx={{ width: 325 }}
        options={top100Films}
        filterSelectedOptions
        id="autocomplete-multiple-outlined"
        getOptionLabel={option => option.title || ''}
        renderInput={params => <TextField {...params} placeholder="Favorites" />}
      />
    </div>
  )
}

export default Design

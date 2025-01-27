import { useState, forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import { FaCalendarAlt } from 'react-icons/fa'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

function Design() {
  const [startDate, setStartDate] = useState()

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='relative w-full'>
      <div className='absolute inset-0  w-[20px] h-[100%] flex items-center justify-center z-10'>
        <span className='' id='calendar-icon'>
          <FaCalendarAlt className='' />
        </span>
      </div>
      <input className='ps-[20px]' onClick={onClick} ref={ref} value={value} />
    </div>
  ))

  return (
    <div className=''>
      <DatePickerWrapper>
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          timeInputLabel='Time:'
          dateFormat='MM/dd/yyyy h:mm aa'
          showMonthDropdown
          showYearDropdown
          showTimeInput
          customInput={<ExampleCustomInput className='example-custom-input' />}
        />
      </DatePickerWrapper>
    </div>
  )
}

export default Design

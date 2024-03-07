import React from 'react'
import { DatePicker } from 'antd'
import styled from 'styled-components'
import { useContext } from 'react'
import { SlotStatusContext } from '../context/SlotStatusContext'
import { slotStatuses } from '../context/apiCalls'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { AuthContext } from '../context/AuthContext'
dayjs.extend(customParseFormat);
const Container = styled.div`
    margin: 20px;
    padding: 20px;
    margin-top: 15vh;
`
const DatesPicker = ({ datePickerOpen }) => {
  const { dispatch, setDateString } = useContext(SlotStatusContext)
  const { user } = useContext(AuthContext)
  const onChange = (date, dateString) => {
    setDateString(dateString)
    slotStatuses(dispatch, dateString)
  };
  const disabledDate = (current) => {
    if (user.role === "pcs") {
      // Check if the date is a Sunday.
      const day = current.weekday();
      if (day === 0) {
        return true;
      }

      if (current > dayjs().add(90, 'day')) {
        return true;
      }

      if (current < dayjs().add(2, 'day')) {
        return true;
      }
    }
    // The date is not disabled.
    return false;
  }
  return (
    <Container>
      <DatePicker onChange={onChange} open={datePickerOpen} style={{ width: "288px", fontSize: "28px" }} size="large" disabledDate={disabledDate} />
    </Container>
  )
}

export default DatesPicker
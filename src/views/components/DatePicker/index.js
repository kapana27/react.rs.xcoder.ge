import React,{useState} from 'react';
import PropTypes from  'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const Calendar = (props) => {
  return (
    <DatePicker
      selected={props.date}
      onChange={props.onDateChange}
      dateFormat="dd-MM-Y"
      dropdownMode="select"
      showMonthDropdown
      showYearDropdown
    />
  )
};
Calendar.propTypes = {
  date: PropTypes.any,
  onDateChange: PropTypes.func
};
Calendar.detaultProps = {
  date: new Date()
};


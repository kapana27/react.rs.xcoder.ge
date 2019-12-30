import React,{Component,useState,useEffect} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datePicker.scss'
export default class CustomDateComponent extends Component {
  state = {
    date: null
  };
  getDate() {

    return this.state.date;
  }

  setDate(date) {
    this.setState({date})
  }
 render() {
   return (
     <div className="ag-input-wrapper custom-date-filter ag-custom-component-popup">
       <DatePicker
         selected={this.state.date}
         onChange={(date)=>this.onDateChanged(date)}
         dateFormat="dd-MM-Y"
         dropdownMode="select"
         showMonthDropdown
         showYearDropdown
         isClearable
       />
     </div>
   )
 }
  onDateChanged = (selectedDates) => {
    this.setState({date: selectedDates});
    this.updateAndNotifyAgGrid(selectedDates)
  }
  updateAndNotifyAgGrid(date) {
    this.setState({
        date
      },
      this.props.onDateChanged
    );
  }
};

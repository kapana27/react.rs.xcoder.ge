import React,{useState, useEffect} from 'react';
import _ from 'lodash';
import {Button} from 'primereact/button';

import PropTypes from "prop-types";
import {removeCartItem} from "../../../utils";
export const Cart = (props) => {
  let [data, setData]=useState(props.data);
  let [itemFiles, setItemFiles]=useState(props.itemFiles);

  useEffect(()=>{
      setData(props.data)
  },[props.data])

  useEffect(()=>{
    console.log('useEffect',props.itemFiles)
  },[itemFiles])

  const onFileSize =()=> {
    console.log(12312312)
  }

  return <React.Fragment>
    <table style={style.table}>
      <thead>
      <tr>
        <th>დასახელება</th>
        <th>შტრიხკოდი</th>
        <th>სულ რაოდენობა</th>
        <th>რაოდენობა</th>
        {props.documentBtnVisible && <th/>}
        <th/>
      </tr>
      </thead>
      <tbody>
      {
        _.map(data,(value,index)=>{
          const d = JSON.parse(value);
          return (
            <tr style={style.tr} key={index}>
              <td style={style.td}>{d.name}</td>
              <td style={style.td}>{d.barcode !== 0? d.barcode: ''}</td>
              <td style={style.td}>{d.amount} </td>
              <td style={style.td}><input type="number" value={d.count} onChange={(e)=>props.onChangeAmount({index:index,count:e.target.value})}/> </td>

              {props.documentBtnVisible && <td style={style.td}><Button label="დოკუმენტები (0)" icon="pi pi-file" onClick={()=>props.onGetDocuments(d)} /></td>}
              <td style={style.td}><i className="fa fa-close" onClick={()=>props.onRemoveItem(index)}/> </td>
            </tr>
          )
        })
      }
      </tbody>
    </table>


  </React.Fragment>
};
const style = {
  table: {
    width: '100%'
  },
  tr: {
    border: '1px solid #c1c1c1'
  },
  td:{
    borderRight: '1px solid #c1c1c1',
    padding: '5px 10px'
  }
};
Cart.propTypes = {
  data: PropTypes.any,
  onChangeAmount: PropTypes.func,
  onGetDocuments: PropTypes.func,
  documentBtnVisible: PropTypes.bool,
  itemFiles: PropTypes.object
};
Cart.defaultProps = {
  data:[],
  onChangeAmount: ()=>console.log("change stock"),
  onGetDocuments: ()=>console.log("change stock"),
  documentBtnVisible: false,
  itemFiles: {}
};

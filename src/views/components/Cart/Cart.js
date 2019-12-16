import React,{useState, useEffect} from 'react';
import _ from 'lodash';
import {Button} from 'primereact/button';

import PropTypes from "prop-types";
export const Cart = (props) => {

    let [data, setData]=useState(props.data);

    useEffect(()=>{
      setData(props.data);
    },[props.data])

    return <React.Fragment>
        <table style={style.table}>
          <thead>
            <tr>
              <th>დასახელება</th>
              <th>შტრიხკოდი</th>
              <th>რაოდენობა</th>
              <th>რაოდენობა</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {
            _.map(data,(value,index)=>{
              const d = JSON.parse(value);
              return (
                <tr style={style.tr} key={index}>
                    <td style={style.td}>{d.name}</td>
                    <td style={style.td}>{d.barcode}</td>
                    <td style={style.td}><input type="number" value={d.inStock} onChange={(e)=>props.onChangeStock({index:index,inStock:e.target.value})}/> </td>
                    <td style={style.td}>{d.amount}</td>
                    <td style={style.td}><Button label="დოკუმენტები (0)" icon="pi pi-file" /></td>
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
  onChangeStock: PropTypes.func
};
Cart.defaultProps = {
  data:[],
  onChangeStock: ()=>console.log("change stock")
};

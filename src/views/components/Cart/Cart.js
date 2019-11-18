import React from 'react';
import _ from 'lodash';
import {Button} from 'primereact/button';

import PropTypes from "prop-types";
export const Cart = (props) => {
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
            _.map(props.data,(value,index)=>{
              const data = JSON.parse(value);
              return (
                <tr style={style.tr} key={index}>
                    <td style={style.td}>{data.name}</td>
                    <td style={style.td}>{data.barcode}</td>
                    <td style={style.td}><input type="text" value={data.inStock} onChange={(e)=>console.log(e)}/> </td>
                    <td style={style.td}>{data.amount}</td>
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
  data: PropTypes.any
};
Cart.defaultProps = {
  data:[]
};

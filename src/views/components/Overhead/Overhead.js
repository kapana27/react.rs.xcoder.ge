import React from 'react';
import _ from 'lodash';
import {Button} from 'primereact/button';
import {InputText} from "primereact/inputtext";
import {State} from "../../../utils";
import PropTypes from "prop-types";
export const Overhead = (props) => {
  return <React.Fragment>
    <h3>{props.title} <InputText value={props.newCode} onChange = {props.onChange} placeholder={props.newCode} type="text"/></h3>
    <table style={{width:'100%'}}>
      <thead>
      <tr>
        <th>თარიღი</th>
        <th>დასახელება</th>
        <th>მარკა</th>
        <th>მოდელი</th>
        <th>ფასი</th>
        <th>რაოდენობა</th>
        <th>შტრიხკოდი</th>
      </tr>
      </thead>
      <tbody>
      {
        _.map(props.carts['tab'+props.tab],(value,index)=>{
          const data = JSON.parse(value);
          return (
            <tr key={index}>
              <td>{data.trDate}</td>
              <td>{data.name}</td>
              <td>{data.maker ? data.maker.name:""}</td>
              <td>{data.model ? data.model.name:""}</td>
              <td>{data.price}</td>
              <td>{data.count}</td>
              <td>{data.barcode !== 0? data.barcode:''}</td>
            </tr>
          )
        })
      }
      </tbody>
    </table>
  </React.Fragment>
};


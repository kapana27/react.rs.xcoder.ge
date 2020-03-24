import React from 'react';
import _ from 'lodash';
import {Button} from 'primereact/button';
import {InputText} from "primereact/inputtext";
import {State} from "../../../utils";
import PropTypes from "prop-types";
import * as moment from "moment";
export const PrintGridData = (props) => {

  let tab = '';
  if(props.tab === 11){
    tab = 'ცენტრალური საწყობი, სექცია A';
  }else if(props.tab === 12){
    tab = 'ცენტრალური საწყობი, სექცია B';
  }else if(props.tab === 21){
    tab = 'ქონების მართვა გასანაწილებელი';
  }else if(props.tab === 22){
    tab = 'ქონების მართვა განაწილებული';
  }

  let localData = {};
  localData = {
    'შემოსავლების სამსახური': '',
    'ქონების მართვის პროგრამა': '',
    [tab]:'',
    'თარიღი:': moment().format("DD-MM-YYYY")
  };


  return (
    <React.Fragment>
      {_.map(localData,(item, key) =>
        <div><b>{key}</b>&nbsp;&nbsp;{item}</div>
      )}

      <div className={props.method} style={{maxHeight:'400px',overflowY:'auto',marginTop:'20px',fontSize:'10px'}}>
        <table style={{width:'100%'}}>
          <thead>
            <tr>
              <th>№</th>
              <th>თარიღი</th>
              <th>დასახელება</th>
              <th>მარკა</th>
              <th>მოდელი</th>
              <th>შტრიხკოდი</th>
              <th>რაოდენობა</th>
              <th>ფასი</th>
              <th>სულ ფასი</th>
              <th>განზ. ერთ.</th>
              <th>ჯგუფი</th>
            </tr>
          </thead>
          <tbody>
          {
            _.map(props.newData,(value,index)=>{
              const dat = value;
                return (
                  <tr key={index}>
                    <td>{dat.recNo}</td>
                    <td>{dat.trDate}</td>
                    <td>{dat.name}</td>
                    <td>{dat.maker? dat.maker.name:''}</td>
                    <td>{dat.model? dat.model.name:''}</td>
                    <td>{dat.fullBarcode}</td>
                    <td>{dat.amount}</td>
                    <td>{dat.price}</td>
                    <td>{dat.price * dat.amount}</td>
                    <td>{dat.measureUnit.name}</td>
                    <td>{dat.itemGroup.name}</td>
                  </tr>
                )
            })
          }
          </tbody>
        </table>
      </div>
    </React.Fragment>
  )
};


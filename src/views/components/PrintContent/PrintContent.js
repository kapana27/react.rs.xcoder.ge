import React from 'react';
import _ from 'lodash';
import {Button} from 'primereact/button';
import {InputText} from "primereact/inputtext";
import {State} from "../../../utils";
import PropTypes from "prop-types";
import * as moment from "moment";
export const PrintContent = (props) => {

  console.log('props', props);

  let localData = {};
  if(props.newData.printType === "WI"){
    localData = {
      'თარიღი': props.newData.trDate,
      'მიმწოდებელი': props.newData.printSupplier,
      'სასაქონლო ზედნადები': props.newData.inspectionNumber?props.newData.inspectionNumber:'',
      'მიღება ჩაბარების აქტი':props.newData.invoice?props.newData.invoice:'',
      'კომენტარი':props.newData.note?props.newData.note:''
    }
  }else if(props.newData.printType === "WP"){
    localData = {
      'თარიღი': props.newData.trDate,
      'ქონების მართვა': props.newData.printProperty,
      'მომთხოვნი პიროვნება': props.newData.printRequest?props.newData.printRequest:'',
      'ტრანსპ. პასუხისმგ. პირი':props.newData.printCarrier?props.newData.printCarrier:'',
      'კომენტარი':props.newData.note?props.newData.note:''
    }
  }else if(props.newData.printType === "WS"){
    localData = {
      'თარიღი': props.newData.trDate,
      'ქონების მართვა': props.newData.printProperty,
      'მომთხოვნი პიროვნება': props.newData.printRequest?props.newData.printRequest:'',
      'ტრანსპ. პასუხისმგ. პირი':props.newData.printCarrier?props.newData.printCarrier:'',
      'თანამშრომელი:':props.newData.printReceiver?props.newData.printReceiver:'',
      'შენობა:':props.newData.printLocation?props.newData.printLocation:'',
      'კომენტარი':props.newData.note?props.newData.note:''
    }
  }else if(props.newData.printType === "PS"){
    localData = {
      'თარიღი': props.newData.trDate,
      'საწყობის მართვა': props.newData.printProperty,
      'ტრანსპ. პასუხისმგ. პირი':props.newData.printCarrier?props.newData.printCarrier:'',
      'სექცია:':props.newData.printLocation?props.newData.printLocation:'',
      'კომენტარი':props.newData.note?props.newData.note:''
    }
  }else if(props.newData.printType === "PP"){
    localData = {
      'თარიღი': props.newData.trDate,
      'ქონების მართვა': props.newData.printProperty,
      'მომთხოვნი პიროვნება': props.newData.printRequest?props.newData.printRequest:'',
      'ტრანსპ. პასუხისმგ. პირი':props.newData.printCarrier?props.newData.printCarrier:'',
      'კომენტარი':props.newData.note?props.newData.note:''
    }
  }else if(props.newData.printType === "PW"){
    localData = {
      'თარიღი': props.newData.trDate,
      'საწყობის მართვა': props.newData.printProperty,
      'ტრანსპ. პასუხისმგ. პირი':props.newData.printCarrier?props.newData.printCarrier:'',
      'სექცია:':props.newData.printLocation?props.newData.printLocation:'',
      'კომენტარი':props.newData.note?props.newData.note:''
    }
  }else if(props.newData.printType === "SP"){
    localData = {
      'თარიღი': props.newData.trDate,
      'ქონების მართვა': props.newData.printProperty,
      'ტრანსპ. პასუხისმგ. პირი':props.newData.printCarrier?props.newData.printCarrier:'',
      'კომენტარი':props.newData.note?props.newData.note:''
    }
  }

  return (
    <React.Fragment>
      {_.map(localData,(item, key) =>
        <div><b>{key}:</b>&nbsp;&nbsp;{item}</div>
      )}

      <h3 style={{marginTop:'20px'}}>{props.newData.printName}</h3>

      <table style={{width:'100%'}}>
        <thead>
          {
            props.newData.printType === "WI" ||
            props.newData.printType === "WP" ||
            props.newData.printType === "WS"?
              <React.Fragment>
                <tr>
                  <th colSpan="8" style={{textAlign:'center'}}>საწყობი</th>
                  <th colSpan="2" style={{textAlign:'center'}}>ბუღალტერია</th>
                </tr>
                <tr>
                  <th>დასახელება</th>
                  <th>მარკა</th>
                  <th>მოდელი</th>
                  {
                    props.newData.printType === "WP" || props.newData.printType === "WS"?
                      <th>შტრიხკოდი</th>:''
                  }
                  <th>რაოდენობა</th>
                  <th>ერთ. ფასი</th>
                  <th>სულ ფასი</th>
                  <th>ერთ. ფასი</th>
                  <th>სულ ფასი</th>
                </tr>
              </React.Fragment>
              :
              <tr>
                <th>დასახელება</th>
                <th>მარკა</th>
                <th>მოდელი</th>
                <th>რაოდენობა</th>
                <th>ერთ. ფასი</th>
                <th>სულ ფასი</th>
              </tr>
          }
        </thead>
        <tbody>
        {
          _.map(props.newData.addons,(value,index)=>{
            const dat = value.item;
            if(props.newData.printType === "WI" || props.newData.printType === "WP" || props.newData.printType === "WS"){
              return (
                <tr key={index}>
                  <td>{dat.name}</td>
                  <td>{dat.maker? dat.maker.name:''}</td>
                  <td>{dat.model? dat.model.name:''}</td>
                  {
                    props.newData.printType === "WP" || props.newData.printType === "WS"?
                      <th>{dat.fullBarcode}</th>:''
                  }
                  <td>{value.addonAmount}</td>
                  <td>{dat.price}</td>
                  <td>{dat.price * value.addonAmount}</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              )
            }else {
              return (
                <tr key={index}>
                  <td>{dat.name}</td>
                  <td>{dat.maker? dat.maker.name:''}</td>
                  <td>{dat.model? dat.model.name:''}</td>
                  <td>{value.addonAmount}</td>
                  <td>{dat.price}</td>
                  <td>{dat.price * value.addonAmount}</td>
                </tr>
              )
            }
          })
        }
        </tbody>
      </table>
    </React.Fragment>
  )
};


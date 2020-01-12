import React, {Component} from 'react';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import PropTypes from 'prop-types';


import "./search.css"
import {InputTextarea} from "primereact/inputtextarea";
import {InputText} from "primereact/inputtext";
import {Dropdown} from 'primereact/dropdown';
import {State} from "../../../utils";
import {Calendar} from "../DatePicker";

export const Search = (props) => {
  console.log(props);
  return (
    <React.Fragment >
      <div className="search">
        <div className="p-grid">
          <div className="p-col-3">
            <label>დასახელება:</label>
            <InputText type="text" value={props.data.name} onChange={(e)=>props.onChange(e.target.value,'name')} />
          </div><div className="p-col-3">
            <label>დასახელება:</label>
            <InputText type="text" value={props.data.name} onChange={(e)=>props.onChange(e.target.value,'name')} />
          </div>
          <div className="p-col-3">
            <label>მარკა:</label>
            <InputText type="text"  value={props.data.maker} onChange={(e)=>props.onChange(e.target.value,'maker')} />
          </div>
          <div className="p-col-3">
            <label>მოდელი:</label>
            <InputText type="text"  value={props.data.model} onChange={(e)=>props.onChange(e.target.value,'model')} />
          </div>
          <div className="p-col-3" style={{paddingRight:'20px'}}>
            <label>განზ. ერთეული:</label>
            <Dropdown
              options={props.measureUnits}
              placeholder="განზ. ერთეული"
              field="name"
              optionLabel="name"
              style={{width:'100%'}}
              value={props.data.measureUnit}
              onChange={(e)=>props.onChange(e.target.value, 'measureUnit')}
            />
          </div>
          <div className="p-col-3">
            <label>ჯგუფი:</label>
            <InputText type="text" value={props.data.itemGroup} onChange={(e)=>props.onChange(e.target.value,'itemGroup')}/>
          </div>

          <div className="p-col-3">
            <label>ტიპი:</label>
            <InputText type="text" value={props.data.itemType} onChange={(e)=>props.onChange(e.target.value,'itemType')}/>
          </div>
          <div className="p-col-3">
            <label>ქარხნული ნომერი:</label>
            <InputText type="text" value={props.data.factoryNumber} onChange={(e)=>props.onChange(e.target.value,'factoryNumber')}/>
          </div>
          <div className="p-col-3">
            <label>მიმწოდებელი:</label>
            <InputText type="text" value={props.data.supplier} onChange={(e)=>props.onChange(e.target.value,'supplier')}/>
          </div>
          <div className="p-col-3" style={{maxWidth:'280px',paddingRight:'20px'}}>
            <label>ფასი: დან-მდე</label>
            <div className="flex-box">
              <InputText type="text"  value={props.data.priceFrom} onChange={(e)=>props.onChange(e.target.value,'priceFrom')}/>
              <InputText type="text" value={props.data.priceTo}  onChange={(e)=>props.onChange(e.target.value,'priceTo')}/>
            </div>
          </div>
          <div className="p-col-3" style={{maxWidth:'331px',paddingRight:'20px'}}>
            <label>თარიღი: დან-მდე</label>
            <div className="flex-box">
              <Calendar date={props.data.dateFrom} onDateChange={date =>props.onChange(date,'dateFrom') }/>
              <Calendar date={props.data.dateTo} onDateChange={date => props.onChange(date,'dateTo')}/>
            </div>
          </div>
          <div className="p-col-3">
            <label>შტრიხკოდი: დან-მდე</label>
            <div className="flex-box">
              <Dropdown
                placeholder="შტრიხკოდი"
                optionLabel="name"
                style={{width:'76px', minWidth:'76px'}}
                onChange={(e)=>props.onChange(e.target.value, 'barCodeType')}
                value={props.data.barCodeType}
                options={props.barcodeTypes}
              />
              <InputText type="text" value={props.data.barcodeFrom} onChange={(e)=>props.onChange(e.target.value,'barcodeFrom')}/>
              <InputText type="text"  value={props.data.barcodeTo} onChange={(e)=>props.onChange(e.target.value,'barcodeTo')}/>
            </div>
          </div>

          <div  style={{minWidth:'350px',maxWidth:'100%', paddingRight:'20px', paddingTop:'12px',flex:'1'}}>
            <div style={{float:'right'}}>
              <Button className="p-button-warning" label="ძებნა" icon="pi pi-search" onClick={props.onFilter} />
              <Button className="p-button-danger" label="გასუფთავება" icon="pi pi-times" style={{marginLeft:'10px'}} />
              <Button className="p-button-secondary" label="დახურვა" style={{marginLeft:'20px', float:'right'}} onClick = {props.onClick}/>
            </div>
          </div>

        </div>
      </div>
    </React.Fragment>
  )
};

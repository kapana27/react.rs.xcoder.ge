import React, {Component} from 'react';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import PropTypes from 'prop-types';


import "./search.css"
import {InputTextarea} from "primereact/inputtextarea";
import {InputText} from "primereact/inputtext";
import {Dropdown} from 'primereact/dropdown';

export const Search = (props) => {

  return (
    <React.Fragment >
      <div className="search">
        <div className="p-grid">
          <div className="p-col-3">
            <label>დასახელება:</label>
            <InputText type="text" />
          </div>
          <div className="p-col-3">
            <label>მარკა:</label>
            <InputText type="text" />
          </div>
          <div className="p-col-3">
            <label>მოდელი:</label>
            <InputText type="text" />
          </div>
          <div className="p-col-3">
            <label>განზ. ერთეული:</label>
            <Dropdown optionLabel="name"  style={{width:'100%'}} />
          </div>
          <div className="p-col-3">
            <label>ჯგუფი:</label>
            <InputText type="text" />
          </div>
          <div className="p-col-3">
            <label>ერთეული:</label>
            <InputText type="text" />
          </div>
          <div className="p-col-3">
            <label>ტიპი:</label>
            <InputText type="text" />
          </div>
          <div className="p-col-3">
            <label>ქარხნული ნომერი:</label>
            <InputText type="text" />
          </div>
          <div className="p-col-3">
            <label>მწარმოებელი:</label>
            <InputText type="text" />
          </div>
          <div className="p-col-3" style={{maxWidth:'320px'}}>
            <label>თარიღი: დან-მდე:</label>
            <div className="flex-box">
              <InputText type="text"/>
              <InputText type="text"/>
            </div>
          </div>
          <div className="p-col-3" style={{maxWidth:'280px'}}>
            <label>ფასი: დან-მდე</label>
            <div className="flex-box">
              <InputText type="text" />
              <InputText type="text" />
            </div>
          </div>
          <div className="p-col-3">
            <label>შტრიხკოდი: დან-მდე</label>
            <div className="flex-box">
              <Dropdown optionLabel="name"  style={{width:'76px', minWidth:'76px'}} />
              <InputText type="text" />
              <InputText type="text" />
            </div>
          </div>

          <div  style={{minWidth:'350px',maxWidth:'100%', paddingRight:'20px', paddingTop:'21px',flex:'1'}}>
            <div style={{float:'right'}}>
              <Button className="p-button-warning" label="ძებნა" icon="pi pi-search" />
              <Button className="p-button-danger" label="გასუფთავება" icon="pi pi-times" style={{marginLeft:'10px'}} />
              <Button className="p-button-secondary" label="დახურვა" style={{marginLeft:'20px', float:'right'}} onClick = {props.onClick}/>
            </div>
          </div>

        </div>
      </div>
    </React.Fragment>
  )
};

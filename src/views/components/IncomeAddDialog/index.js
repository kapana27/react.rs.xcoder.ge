import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import {InputText} from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import './IncomeAddDialog.css';


export const IncomeAddDialog = (props) => {
  return (
    <React.Fragment >

      <div className="incomeModal p-grid">
        <div className="fullwidth barcode p-col-2">
          <label>შტრიხკოდი</label>
          <Dropdown optionLabel="name" />
          <InputText type="text" placeholder="შტრ. კოდი" style={{textIndent:'0px',width:'78px',fontSize:'12px'}} />
        </div>
        <div className="fullwidth p-col-2">
          <label>ქარხნული ნომერი:</label>
          <InputText type="text" />
        </div>
        <div className="fullwidth p-col-2">
          <label>განზომილების ერთეული</label>
          <Dropdown optionLabel="name" />
        </div>
        <div className="fullwidth p-col-2">
          <label>საქონლის ჯგუფი</label>
          <InputText type="text" />
        </div>
        <div className="fullwidth p-col-2">
          <label>ინვენტარის ტიპი</label>
          <Dropdown optionLabel="name" />
        </div>
        <div className="fullwidth p-col-2">
          <label>ინვენტარის სტატუსი</label>
          <Dropdown optionLabel="name" />
        </div>
      </div>

    </React.Fragment>
  )
};

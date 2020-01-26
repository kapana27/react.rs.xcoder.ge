import React, { Component } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import _ from 'lodash';

import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import 'primeflex/primeflex.css';
import './directory.css';
import {State} from "../../utils";
import {Confirm, Table} from "../components";
import http from "../../api/http";

 class Directory extends Component{
   constructor(props) {
     super(props);
   }
  state = {
    tabs: [
      {label: 'Home', icon: 'pi pi-fw pi-home'},
      {label: 'Calendar', icon: 'pi pi-fw pi-calendar'},
      {label: 'Edit', icon: 'pi pi-fw pi-pencil'},
      {label: 'Documentation', icon: 'pi pi-fw pi-file'},
      {label: 'Settings', icon: 'pi pi-fw pi-cog'}
    ],
    activeItem:null,
     division:{
       parent:{
         id: -1,
         name: ''
       }
     },
    section:{
       parent: {
         id:-1,
         name: ''
       }
    }
  };



  render() {
    return (
      <div >

        <div className="actionButton">
          <div className="buttonBox">
            <Button label="მისაღები" className={this.state.tab === 0?'':'p-button-secondary'} onClick={()=>this.tabClick(0)} />
            <Button label="მიღებული"   className={this.state.tab === 1?'':'p-button-secondary'} onClick={()=>this.tabClick(1)} />
            <Button label="უარყოფილი"   className={this.state.tab === 2?'':'p-button-secondary'} onClick={()=>this.tabClick(2)} />
            <Button label="გაუქმების ოპერაციები"   className={this.state.tab === 34?'':'p-button-secondary'} onClick={()=>this.tabClick(34)} />
          </div>
        </div>


        <div className={"directory"}>


          <div className="row">
            <div className="col-md-4">
              <Table
                URL={"/api/secured/Organizational/Structure/Department/Select?1=1"}
                onSelect={(selected)=>{ (!_.isEmpty(selected))? this.setState(State('division.parent', selected,this.state),()=>this.setState(State('section.parent.id',-1,this.state))):this.setState(State('division.parent.id', -1,this.state)) } }
                Thead={
                  <thead>
                  <tr>
                    <th >ID</th>
                    <th >დასახელება</th>
                  </tr>
                  </thead>
                }
                Fields={[
                  {
                    field:'data.id'
                  },
                  {
                    field:'data.name'
                  }
                ]}
              />
            </div>
            <div className="col-md-4">
              <Table
                URL={"/api/secured/Organizational/Structure/Division/Select?parentId="+this.state.division.parent['id']}
                onSelect={(selected)=>{ (!_.isEmpty(selected))? this.setState(State('section.parent', selected,this.state)):this.setState(State('section.parent.id', -1,this.state)) } }

                Thead={
                  <thead>
                  <tr>
                    <th >ID</th>
                    <th >დასახელება</th>
                  </tr>
                  </thead>
                }
                Fields={[
                  {
                    field:'data.id'
                  },
                  {
                    field:'data.name'
                  }
                ]}
              />
            </div>
            <div className="col-md-4">
              <Table
                URL={"/api/secured/Organizational/Structure/Sector/Select?parentId="+this.state.section.parent['id']}
                Thead={
                  <thead>
                  <tr>
                    <th >ID</th>
                    <th >დასახელება</th>
                  </tr>
                  </thead>
                }
                Fields={[
                  {
                    field:'data.id'
                  },
                  {
                    field:'data.name'
                  }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Directory;

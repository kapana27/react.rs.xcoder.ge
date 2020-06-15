import React, {Component} from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import {Table} from "../components";
import {State} from "../../utils";
import _ from  'lodash';
import './Directory.css';
import {TabMenu} from 'primereact/tabmenu';
import {Button} from "primereact/button";
import http2 from '../../api/http2';
import {MeasurementUnit} from "./Component/MeasurementUnit";
import {Group} from "./Component/Group";
import {Position} from "./Component/Position";
import {Employeees} from "./Component/Emptoyees";
import {ErrorModal} from "../components/ErrorModal";
import {Dialog} from "primereact/dialog";
import {InputNumber} from 'primereact/inputnumber';

import TableComponent from './TableComponents/StandartTableComponents';
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
const suppliers= [{label:"შპს",value:1},{label:"ინდმეწარმე",value:2},{label:"ფიზიკური პირი",value:3},{label:"სააქციო საზოგადოება",value:4}];
 class Directory extends Component{
  constructor(props) {
     super(props);

     this.state = {
        dialog:{
          department:{
             new:{
               modal:false,
               data: '',
               update:false,
               render: () => {
                 return (<TableComponent.Insert show={this.state.dialog.department.new.modal} onYesClick={()=>{
                   http2.post("/api/secured/Organizational/Structure/Insert?lvl=1&parentId=0&name="+this.state.dialog.department.new.data)
                     .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.department.new.update', true,this.state,this),()=>
                              this.setState(State("dialog.department.new.modal",false,this.state),()=>
                                this.setState(State("dialog.department.new.data","",this.state)
                              ))
                          );
                        }else {
                         alert("დაფიქსირდა შეცდომა");
                        }
                     })
                     .catch()
                 }} onNoClick={()=>this.setState(State('dialog.department.new.modal',false,this.state))}>
                   <div>
                     <label >დეპარტამენტის დასახელება</label>
                     <InputText value={this.state.dialog.department.new.data} onChange={(e) => this.setState(State('dialog.department.new.data', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                   </div>
                 </TableComponent.Insert>);
               }
             },
            edit:{
              modal:false,
              data:{id:-1,name:""},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.department.edit.modal} onYesClick={()=>{
                  http2.post("/api/secured/Organizational/Structure/Update?id="+this.state.dialog.department.edit.data.id+"&name="+this.state.dialog.department.edit.data.name)
                    .then(response=>{
                      if(response.status){
                        this.setState(State('dialog.department.new.update', true,this.state,this),()=>
                          this.setState(State("dialog.department.edit.modal",false,this.state),()=>
                            this.setState(State("dialog.department.edit.data",{id:"",name:""},this.state))) );
                      }else {
                        alert("დაფიქსირდა შეცდომა");
                      }
                    })
                    .catch()
                }} onNoClick={()=>this.setState(State('dialog.department.new.modal',false,this.state))}>
                  <div>
                    <label >დეპარტამენტის დასახელება</label>
                    <InputText value={this.state.dialog.department.edit.data.name} onChange={(e) => this.setState(State('dialog.department.edit.data.name', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                  </div>
                </TableComponent.Insert>);
              }
            },
            delete:{
              modal:false
            }
          },
          division:{
            new:{
              modal:false,
              data: '',
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.division.new.modal} onYesClick={()=>{
                  if(this.state.division.parent.id >-1){
                    http2.post("/api/secured/Organizational/Structure/Insert?lvl=2&parentId="+this.state.division.parent.id+"&name="+this.state.dialog.division.new.data)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.division.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.division.new.modal",false,this.state),()=>
                              this.setState(State("dialog.division.new.data","",this.state)
                              ))
                          );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()
                  }

                }} onNoClick={()=>this.setState(State('dialog.division.new.modal',false,this.state))}>
                  <div>
                    <label >მიუთითეთ სამმართველო/ს.გ.პ/ს.ცს დასახელება</label>
                    <InputText value={this.state.dialog.division.new.data} onChange={(e) => this.setState(State('dialog.division.new.data', e.target.value,this.state))} placeholder={"მიუთითეთ სამმართველო/ს.გ.პ/ს.ცს დასახელება\n"} style={{ width:'100%'}}/>
                  </div>
                </TableComponent.Insert>);
              }
            },
            edit:{
              modal:false,
              data:{id:-1,name:""},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.division.edit.modal} onYesClick={()=>{
                  http2.post("/api/secured/Organizational/Structure/Update?id="+this.state.dialog.division.edit.data.id+"&name="+this.state.dialog.division.edit.data.name)
                    .then(response=>{
                      if(response.status){
                        this.setState(State('dialog.division.new.update', true,this.state,this),()=>
                          this.setState(State("dialog.division.edit.modal",false,this.state),()=>
                            this.setState(State("dialog.division.edit.data",{id:"",name:""},this.state))) );
                      }else {
                        alert("დაფიქსირდა შეცდომა");
                      }
                    })
                    .catch()
                }} onNoClick={()=>this.setState(State('dialog.division.edit.modal',false,this.state))}>
                  <div>
                    <label >მიუთითეთ სამმართველო/ს.გ.პ/ს.ცს დასახელება</label>
                    <InputText value={this.state.dialog.division.edit.data.name} onChange={(e) => this.setState(State('dialog.division.edit.data.name', e.target.value,this.state))} placeholder={"მიუთითეთ სამმართველო/ს.გ.პ/ს.ცს დასახელება"} style={{ width:'100%'}}/>
                  </div>
                </TableComponent.Insert>);
              }
            },
            delete:{
              modal:false
            }
          },
          section:{
            new:{
              modal:false,
              data: '',
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.section.new.modal} onYesClick={()=>{
                  if(this.state.section.parent.id >-1){
                    http2.post("/api/secured/Organizational/Structure/Insert?lvl=3&parentId="+this.state.section.parent.id+"&name="+this.state.dialog.section.new.data)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.section.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.section.new.modal",false,this.state),()=>
                              this.setState(State("dialog.section.new.data","",this.state)
                              ))
                          );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()
                  }

                }} onNoClick={()=>this.setState(State('dialog.section.new.modal',false,this.state))}>
                  <div>
                    <label >მიუთითეთ განყოფილება/სექტორის დასახელება</label>
                    <InputText value={this.state.dialog.section.new.data} onChange={(e) => this.setState(State('dialog.section.new.data', e.target.value,this.state))} placeholder={"მიუთითეთ განყოფილება/სექტორის დასახელება"} style={{ width:'100%'}}/>
                  </div>
                </TableComponent.Insert>);
              }
            },
            edit:{
              modal:false,
              data:{id:-1,name:""},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.section.edit.modal} onYesClick={()=>{
                  http2.post("/api/secured/Organizational/Structure/Update?id="+this.state.dialog.section.edit.data.id+"&name="+this.state.dialog.section.edit.data.name)
                    .then(response=>{
                      if(response.status){
                        this.setState(State('dialog.section.new.update', true,this.state,this),()=>
                          this.setState(State("dialog.section.edit.modal",false,this.state),()=>
                            this.setState(State("dialog.section.edit.data",{id:"",name:""},this.state))) );
                      }else {
                        alert("დაფიქსირდა შეცდომა");
                      }
                    })
                    .catch()
                }} onNoClick={()=>this.setState(State('dialog.section.edit.modal',false,this.state))}>
                  <div>
                    <label >მიუთითეთ განყოფილება/სექტორის დასახელება </label>
                    <InputText value={this.state.dialog.section.edit.data.name} onChange={(e) => this.setState(State('dialog.section.edit.data.name', e.target.value,this.state))} placeholder={"მიუთითეთ განყოფილება/სექტორის დასახელება\n"} style={{ width:'100%'}}/>
                  </div>
                </TableComponent.Insert>);
              }
            },
            delete:{
              modal:false
            }
          },
          unit:{
            region:{
              new:{
                modal:false,
                data: '',
                update:false,
                render: () => {
                  return (<TableComponent.Insert show={this.state.dialog.unit.region.new.modal} onYesClick={()=>{
                    http2.post("/api/secured/StructuralUnit/Insert?lvl=1&parentId=0&name="+this.state.dialog.unit.region.new.data)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.unit.region.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.unit.region.new.modal",false,this.state),()=>
                              this.setState(State("dialog.unit.region.new.data","",this.state)
                              ))
                          );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()
                  }} onNoClick={()=>this.setState(State('dialog.unit.region.new.modal',false,this.state))}>
                    <div>
                      <label >რეგიონის დასახელება</label>
                      <InputText value={this.state.dialog.unit.region.new.data} onChange={(e) => this.setState(State('dialog.unit.region.new.data', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                    </div>
                  </TableComponent.Insert>);
                }
              },
              edit:{
                modal:false,
                data:{id:-1,name:""},
                update:false,
                render: () => {
                  return (<TableComponent.Insert show={this.state.dialog.unit.region.edit.modal} onYesClick={()=>{
                    http2.post("/api/secured/StructuralUnit/Update?id="+this.state.dialog.unit.region.edit.data.id+"&name="+this.state.dialog.unit.region.edit.data.name)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.unit.region.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.unit.region.edit.modal",false,this.state),()=>
                              this.setState(State("dialog.unit.region.edit.data",{id:"",name:""},this.state))) );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()
                  }} onNoClick={()=>this.setState(State('dialog.unit.region.new.modal',false,this.state))}>
                    <div>
                      <label >რეგიონის დასახელება</label>
                      <InputText value={this.state.dialog.unit.region.edit.data.name} onChange={(e) => this.setState(State('dialog.unit.region.edit.data.name', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                    </div>
                  </TableComponent.Insert>);
                }
              },
            },
            city:{
              new:{
                modal:false,
                data: '',
                update:false,
                render: () => {
                  return (<TableComponent.Insert show={this.state.dialog.unit.city.new.modal} onYesClick={()=>{
                    http2.post("/api/secured/StructuralUnit/Insert?lvl=2&parentId="+this.state.unit.region.id+"&name="+this.state.dialog.unit.city.new.data)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.unit.city.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.unit.city.new.modal",false,this.state),()=>
                              this.setState(State("dialog.unit.city.new.data","",this.state)
                              ))
                          );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()
                  }} onNoClick={()=>this.setState(State('dialog.unit.city.new.modal',false,this.state))}>
                    <div>
                      <label >ქალაქის დასახელება</label>
                      <InputText value={this.state.dialog.unit.city.new.data} onChange={(e) => this.setState(State('dialog.unit.city.new.data', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                    </div>
                  </TableComponent.Insert>);
                }
              },
              edit:{
                modal:false,
                data:{id:-1,name:""},
                update:false,
                render: () => {
                  return (<TableComponent.Insert show={this.state.dialog.unit.city.edit.modal} onYesClick={()=>{
                    http2.post("/api/secured/StructuralUnit/Update?id="+this.state.dialog.unit.city.edit.data.id+"&name="+this.state.dialog.unit.city.edit.data.name)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.unit.city.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.unit.city.edit.modal",false,this.state),()=>
                              this.setState(State("dialog.unit.city.edit.data",{id:"",name:""},this.state))) );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()
                  }} onNoClick={()=>this.setState(State('dialog.unit.city.new.modal',false,this.state))}>
                    <div>
                      <label >ქალაქის დასახელება</label>
                      <InputText value={this.state.dialog.unit.city.edit.data.name} onChange={(e) => this.setState(State('dialog.unit.city.edit.data.name', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                    </div>
                  </TableComponent.Insert>);
                }
              },
            },
            building:{
              new:{
                modal:false,
                data: '',
                update:false,
                render: () => {
                  return (<TableComponent.Insert show={this.state.dialog.unit.building.new.modal} onYesClick={()=>{
                    http2.post("/api/secured/StructuralUnit/Insert?lvl=3&parentId="+this.state.unit.city.id+"&name="+this.state.dialog.unit.building.new.data)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.unit.building.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.unit.building.new.modal",false,this.state),()=>
                              this.setState(State("dialog.unit.building.new.data","",this.state)
                              ))
                          );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()
                  }} onNoClick={()=>this.setState(State('dialog.unit.building.new.modal',false,this.state))}>
                    <div>
                      <label >შენობის დასახელება</label>
                      <InputText value={this.state.dialog.unit.building.new.data} onChange={(e) => this.setState(State('dialog.unit.building.new.data', e.target.value,this.state))} placeholder={"შენობის დასახელება"} style={{ width:'100%'}}/>
                    </div>
                  </TableComponent.Insert>);
                }
              },
              edit:{
                modal:false,
                data:{id:-1,name:""},
                update:false,
                render: () => {
                  return (<TableComponent.Insert show={this.state.dialog.unit.building.edit.modal} onYesClick={()=>{
                    http2.post("/api/secured/StructuralUnit/Update?id="+this.state.dialog.unit.building.edit.data.id+"&name="+this.state.dialog.unit.building.edit.data.name)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.unit.building.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.unit.building.edit.modal",false,this.state),()=>
                              this.setState(State("dialog.unit.building.edit.data",{id:"",name:""},this.state))) );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()
                  }} onNoClick={()=>this.setState(State('dialog.unit.building.new.modal',false,this.state))}>
                    <div>
                      <label >შენობის დასახელება</label>
                      <InputText value={this.state.dialog.unit.building.edit.data.name} onChange={(e) => this.setState(State('dialog.unit.building.edit.data.name', e.target.value,this.state))} placeholder={"შენობის დასახლება"} style={{ width:'100%'}}/>
                    </div>
                  </TableComponent.Insert>);
                }
              },
            },
            section:{
              new:{
                modal:false,
                data: '',
                update:false,
                render: () => {
                  return (<TableComponent.Insert show={this.state.dialog.unit.section.new.modal} onYesClick={()=>{
                    http2.post("/api/secured/StructuralUnit/Insert?lvl=4&parentId="+this.state.unit.building.id+"&name="+this.state.dialog.unit.section.new.data)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.unit.section.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.unit.section.new.modal",false,this.state),()=>
                              this.setState(State("dialog.unit.section.new.data","",this.state)
                              ))
                          );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()
                  }} onNoClick={()=>this.setState(State('dialog.unit.section.new.modal',false,this.state))}>
                    <div>
                      <label >სექციის დასახელება</label>
                      <InputText value={this.state.dialog.unit.section.new.data} onChange={(e) => this.setState(State('dialog.unit.section.new.data', e.target.value,this.state))} placeholder={"სექციის დასახელება"} style={{ width:'100%'}}/>
                    </div>
                  </TableComponent.Insert>);
                }
              },
              edit:{
                modal:false,
                data:{id:-1,name:""},
                update:false,
                render: () => {
                  return (<TableComponent.Insert show={this.state.dialog.unit.section.edit.modal} onYesClick={()=>{
                    http2.post("/api/secured/StructuralUnit/Update?id="+this.state.dialog.unit.section.edit.data.id+"&name="+this.state.dialog.unit.section.edit.data.name)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.unit.section.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.unit.section.edit.modal",false,this.state),()=>
                              this.setState(State("dialog.unit.section.edit.data",{id:"",name:""},this.state))) );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()
                  }} onNoClick={()=>this.setState(State('dialog.unit.section.new.modal',false,this.state))}>
                    <div>
                      <label >სექციის დასახელება</label>
                      <InputText value={this.state.dialog.unit.section.edit.data.name} onChange={(e) => this.setState(State('dialog.unit.section.edit.data.name', e.target.value,this.state))} placeholder={"სექციის დასახლება"} style={{ width:'100%'}}/>
                    </div>
                  </TableComponent.Insert>);
                }
              },
            }
          },
          measureUnit:{
            new:{
              modal:false,
              data: {id:-1,name:"",value:0},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.measureUnit.new.modal} onYesClick={()=>{
                    var parentId= (this.state.measureUnit.id===-1)?0: this.state.measureUnit.id ;
                    http2.post("/api/secured/MeasureUnit/Insert?parent="+(parentId)+"&name="+this.state.dialog.measureUnit.new.data.name+"&measure_value="+this.state.dialog.measureUnit.new.data.value)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.measureUnit.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.measureUnit.new.modal",false,this.state),()=>
                              this.setState(State("dialog.measureUnit.new.data",{id:-1,name:"",value:0},this.state)
                              ))
                          );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()


                }} onNoClick={()=>this.setState(State('dialog.measureUnit.new.modal',false,this.state))}>
                  <div>
                    <label >დასახელება</label>
                    <InputText value={this.state.dialog.measureUnit.new.data.name} onChange={(e) => this.setState(State('dialog.measureUnit.new.data.name', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                  </div>
                  {
                    (this.state.measureUnit.id>-1)? (
                      <div>
                        <label >ერთეული</label>
                        <InputNumber value={this.state.dialog.measureUnit.new.data.value} onChange={(e) => this.setState(State('dialog.measureUnit.new.data.value', e.target.value,this.state))} placeholder={"ერთეული"} style={{ width:'100%'}}/>
                      </div>
                    ):null

                  }

                </TableComponent.Insert>);
              }
            },
            edit:{
              modal:false,
              data:{id:-1,name:""},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.measureUnit.edit.modal} onYesClick={()=>{
                  var value=(!this.state.dialog.measureUnit.edit.data.value)?0:this.state.dialog.measureUnit.edit.data.value;
                  http2.post("/api/secured/MeasureUnit/Update?id="+this.state.dialog.measureUnit.edit.data.id+"&name="+this.state.dialog.measureUnit.edit.data.name+"&measure_value="+value)
                    .then(response=>{
                      if(response.status){
                        this.setState(State('dialog.measureUnit.new.update', true,this.state,this),()=>
                          this.setState(State("dialog.measureUnit.edit.modal",false,this.state),()=>
                            this.setState(State("dialog.measureUnit.edit.data",{id:-1,name:"",value:0},this.state))) );
                      }else {
                        alert("დაფიქსირდა შეცდომა");
                      }
                    })
                    .catch()
                }} onNoClick={()=>this.setState(State('dialog.measureUnit.edit.modal',false,this.state))}>
                  <div>
                    <label >დასახელება</label>
                    <InputText value={this.state.dialog.measureUnit.edit.data.name} onChange={(e) => this.setState(State('dialog.measureUnit.edit.data.name', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                  </div>

                  {
                    (this.state.measureUnit.id>-1)?
                      (
                        <div>
                          <label >ერთეული</label>
                          <InputNumber  value={this.state.dialog.measureUnit.edit.data.value} onChange={(e) => this.setState(State('dialog.measureUnit.edit.data.value', e.target.value,this.state))} placeholder={"ერთეული"} style={{ width:'100%'}}/>
                        </div>
                      ):null

                  }


                </TableComponent.Insert>);
              }
            },
            delete:{
              modal:false
            }
          },
          type:{
            new:{
              modal:false,
              data: {id:-1,name:"",value:0},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.type.new.modal} onYesClick={()=>{
                  var parentId= (this.state.type.id===-1)?0: this.state.type.id ;
                  http2.post("/api/secured/ItemType/Insert?parent=0&type=structUnit1&name="+this.state.dialog.type.new.data.name)
                    .then(response=>{
                      if(response.status){
                        this.setState(State('dialog.type.new.update', true,this.state,this),()=>
                          this.setState(State("dialog.type.new.modal",false,this.state),()=>
                            this.setState(State("dialog.type.new.data",{id:-1,name:"",value:0},this.state)
                            ))
                        );
                      }else {
                        alert("დაფიქსირდა შეცდომა");
                      }
                    })
                    .catch()


                }} onNoClick={()=>this.setState(State('dialog.type.new.modal',false,this.state))}>
                  <div>
                    <label >ინვენტარის ტიპი</label>
                    <InputText value={this.state.dialog.type.new.data.name} onChange={(e) => this.setState(State('dialog.type.new.data.name', e.target.value,this.state))} placeholder={"ინვენტარის ტიპი"} style={{ width:'100%'}}/>
                  </div>


                </TableComponent.Insert>);
              }
            },
            edit:{
              modal:false,
              data:{id:-1,name:""},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.type.edit.modal} onYesClick={()=>{
                  var value=(!this.state.dialog.type.edit.data.value)?0:this.state.dialog.type.edit.data.value;
                  http2.post("/api/secured/ItemType/Update?parent=0&type=structUnit1&id="+this.state.dialog.type.edit.data.id+"&name="+this.state.dialog.type.edit.data.name)
                    .then(response=>{
                      if(response.status){
                        this.setState(State('dialog.type.new.update', true,this.state,this),()=>
                          this.setState(State("dialog.type.edit.modal",false,this.state),()=>
                            this.setState(State("dialog.type.edit.data",{id:-1,name:""},this.state))) );
                      }else {
                        alert("დაფიქსირდა შეცდომა");
                      }
                    })
                    .catch()
                }} onNoClick={()=>this.setState(State('dialog.type.edit.modal',false,this.state))}>
                  <div>
                    <label >ინვენტარის ტიპი</label>
                    <InputText value={this.state.dialog.type.edit.data.name} onChange={(e) => this.setState(State('dialog.type.edit.data.name', e.target.value,this.state))} placeholder={"ინვენტარის ტიპი"} style={{ width:'100%'}}/>
                  </div>
                </TableComponent.Insert>);
              }
            },
            delete:{
              modal:false
            }
          },
          status:{
            new:{
              modal:false,
              data: {id:-1,name:"",value:0},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.status.new.modal} onYesClick={()=>{
                  var parentId= (this.state.status.id===-1)?0: this.state.status.id ;
                  http2.post("/api/secured/ItemStatus/Insert?parent=0&type=structUnit1&&name="+this.state.dialog.status.new.data.name)
                    .then(response=>{
                      if(response.status){
                        this.setState(State('dialog.status.new.update', true,this.state,this),()=>
                          this.setState(State("dialog.status.new.modal",false,this.state),()=>
                            this.setState(State("dialog.status.new.data",{id:-1,name:"",value:0},this.state)
                            ))
                        );
                      }else {
                        alert("დაფიქსირდა შეცდომა");
                      }
                    })
                    .catch()


                }} onNoClick={()=>this.setState(State('dialog.status.new.modal',false,this.state))}>
                  <div>
                    <label >ინვენტარის სტატუსი</label>
                    <InputText value={this.state.dialog.status.new.data.name} onChange={(e) => this.setState(State('dialog.status.new.data.name', e.target.value,this.state))} placeholder={"ინვენტარის სტატუსი"} style={{ width:'100%'}}/>
                  </div>


                </TableComponent.Insert>);
              }
            },
            edit:{
              modal:false,
              data:{id:-1,name:""},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.status.edit.modal} onYesClick={()=>{
                  http2.post("/api/secured/ItemStatus/Update?parent=0&type=structUnit1&id="+this.state.dialog.status.edit.data.id+"&name="+this.state.dialog.status.edit.data.name)
                    .then(response=>{
                      if(response.status){
                        this.setState(State('dialog.status.new.update', true,this.state,this),()=>
                          this.setState(State("dialog.status.edit.modal",false,this.state),()=>
                            this.setState(State("dialog.status.edit.data",{id:-1,name:""},this.state))) );
                      }else {
                        alert("დაფიქსირდა შეცდომა");
                      }
                    })
                    .catch()
                }} onNoClick={()=>this.setState(State('dialog.status.edit.modal',false,this.state))}>
                  <div>
                    <label >ინვენტარის სტატუსი</label>
                    <InputText value={this.state.dialog.status.edit.data.name} onChange={(e) => this.setState(State('dialog.status.edit.data.name', e.target.value,this.state))} placeholder={"ინვენტარის სტატუსი"} style={{ width:'100%'}}/>
                  </div>
                </TableComponent.Insert>);
              }
            },
            delete:{
              modal:false
            }
          },
          section2:{
            new:{
              modal:false,
              data: {id:-1,name:"",value:0},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.section2.new.modal} onYesClick={()=>{
                  http2.post("/api/secured/stock/Insert?parent=0&type=structUnit1&name="+this.state.dialog.section2.new.data.name)
                    .then(response=>{
                      if(response.status){
                        this.setState(State('dialog.section2.new.update', true,this.state,this),()=>
                          this.setState(State("dialog.section2.new.modal",false,this.state),()=>
                            this.setState(State("dialog.section2.new.data",{id:-1,name:"",value:0},this.state)
                            ))
                        );
                      }else {
                        alert("დაფიქსირდა შეცდომა");
                      }
                    })
                    .catch()


                }} onNoClick={()=>this.setState(State('dialog.section2.new.modal',false,this.state))}>
                  <div>
                    <label >სექცია </label>
                    <InputText value={this.state.dialog.section2.new.data.name} onChange={(e) => this.setState(State('dialog.section2.new.data.name', e.target.value,this.state))} placeholder={"სექცია"} style={{ width:'100%'}}/>
                  </div>


                </TableComponent.Insert>);
              }
            },
            edit:{
              modal:false,
              data:{id:-1,name:""},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.section2.edit.modal} onYesClick={()=>{
                  http2.post("/api/secured/stock/Update?parent=0&type=structUnit1&id="+this.state.dialog.section2.edit.data.id+"&name="+this.state.dialog.section2.edit.data.name)
                    .then(response=>{
                      if(response.status){
                        this.setState(State('dialog.section2.new.update', true,this.state,this),()=>
                          this.setState(State("dialog.section2.edit.modal",false,this.state),()=>
                            this.setState(State("dialog.section2.edit.data",{id:-1,name:""},this.state))) );
                      }else {
                        alert("დაფიქსირდა შეცდომა");
                      }
                    })
                    .catch()
                }} onNoClick={()=>this.setState(State('dialog.section2.edit.modal',false,this.state))}>
                  <div>
                    <label >სექცია</label>
                    <InputText value={this.state.dialog.section2.edit.data.name} onChange={(e) => this.setState(State('dialog.section2.edit.data.name', e.target.value,this.state))} placeholder={"სექცია"} style={{ width:'100%'}}/>
                  </div>
                </TableComponent.Insert>);
              }
            },
          },
          supplier:{
            new:{
              modal:false,
              data: {id:-1,name:"",number:"",type:""},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.supplier.new.modal} onYesClick={()=>{
                  http2.post("/api/secured/Supplier/Insert?name="+this.state.dialog.supplier.new.data.name+"&number="+this.state.dialog.supplier.new.data.number+"&type="+this.state.dialog.supplier.new.data.type)
                    .then(response=>{
                      if(response.status){
                        this.setState(State('dialog.supplier.new.update', true,this.state,this),()=>
                          this.setState(State("dialog.supplier.new.modal",false,this.state),()=>
                            this.setState(State("dialog.supplier.new.data",{id:-1,name:"",number:"",type:""},this.state)
                            ))
                        );
                      }else {
                        alert("დაფიქსირდა შეცდომა");
                      }
                    })
                    .catch()


                }} onNoClick={()=>this.setState(State('dialog.supplier.new.modal',false,this.state))}>
                  <div>
                    <label >მომწოდებლის ტიპი </label><br/>
                    <Dropdown  style={{width:'100%'}} value={this.state.dialog.supplier.new.data.type} options={suppliers} onChange={(e) => this.setState(State('dialog.supplier.new.data.type', e.value,this.state))} placeholder="აირჩიეთ მომწოდებლის ტიპი"/></div>
                  <div>
                    <label >საიდენტიფიკაციო </label>
                    <InputText value={this.state.dialog.supplier.new.data.number} onChange={(e) => this.setState(State('dialog.supplier.new.data.number', e.target.value,this.state))} placeholder={"საიდენტიფიკაციო"} style={{ width:'100%'}}/>
                  </div>
                  <div>
                    <label >დასახელება </label>
                    <InputText value={this.state.dialog.supplier.new.data.name} onChange={(e) => this.setState(State('dialog.supplier.new.data.name', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                  </div>

                </TableComponent.Insert>);
              }
            },
            edit:{
              modal:false,
              data:{id:-1,name:""},
              update:false,
              render: () => {
                return (<TableComponent.Insert show={this.state.dialog.supplier.edit.modal} onYesClick={()=>{
                  http2.post("/api/secured/Supplier/Update?id="+this.state.dialog.supplier.edit.data.id+"&name="+this.state.dialog.supplier.edit.data.name+"&type="+this.state.dialog.supplier.edit.data.type+"&number="+this.state.dialog.supplier.edit.data.number)
                    .then(response=>{
                      if(response.status){
                        this.setState(State('dialog.supplier.new.update', true,this.state,this),()=>
                          this.setState(State("dialog.supplier.edit.modal",false,this.state),()=>
                            this.setState(State("dialog.supplier.edit.data",{id:-1,name:"",number:"",type:""},this.state))) );
                      }else {
                        alert("დაფიქსირდა შეცდომა");
                      }
                    })
                    .catch()
                }} onNoClick={()=>this.setState(State('dialog.supplier.edit.modal',false,this.state))}>
                  <div>
                    <label >მომწოდებლის ტიპი </label><br/>
                    {JSON.stringify(this.state.dialog.supplier.edit.data.type)}
                    <Dropdown  style={{ width:'100%'}} value={this.state.dialog.supplier.edit.data.type} options={suppliers} onChange={(e) => this.setState(State('dialog.supplier.edit.data.type', e.value,this.state))} placeholder="აირჩიეთ მომწოდებლის ტიპი"/></div>
                  <div>
                    <label >საიდენტიფიკაციო </label>
                    <InputText value={this.state.dialog.supplier.edit.data.number} onChange={(e) => this.setState(State('dialog.supplier.edit.data.number', e.target.value,this.state))} placeholder={"საიდენტიფიკაციო"} style={{ width:'100%'}}/>
                  </div>
                  <div>
                    <label >დასახელება </label>
                    <InputText value={this.state.dialog.supplier.edit.data.name} onChange={(e) => this.setState(State('dialog.supplier.edit.data.name', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                  </div>
                </TableComponent.Insert>);
              }
            },
          },
          provider:{
            provider:{
              new:{
                modal:false,
                data: {id:-1,name:""},
                update:false,
                render: () => {
                  return (<TableComponent.Insert show={this.state.dialog.provider.provider.new.modal} onYesClick={()=>{
                    http2.post("/api/secured/List/Maker/Insert?name="+this.state.dialog.provider.provider.new.data.name)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.provider.provider.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.provider.provider.new.modal",false,this.state),()=>
                              this.setState(State("dialog.provider.provider.new.data",{id:-1,name:""},this.state)
                              ))
                          );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()


                  }} onNoClick={()=>this.setState(State('dialog.provider.provider.new.modal',false,this.state))}>
                    <div>
                      <label >მწარმოებელი </label>
                      <InputText value={this.state.dialog.provider.provider.new.data.name} onChange={(e) => this.setState(State('dialog.provider.provider.new.data.name', e.target.value,this.state))} placeholder={"მწარმოებელი"} style={{ width:'100%'}}/>
                    </div>
                  </TableComponent.Insert>);
                }
              },
              edit:{
                modal:false,
                data:{id:-1,name:""},
                update:false,
                render: () => {
                  return (<TableComponent.Insert show={this.state.dialog.provider.provider.edit.modal} onYesClick={()=>{
                    http2.post("/api/secured/List/Maker/Update?id="+this.state.dialog.provider.provider.edit.data.id+"&name="+this.state.dialog.provider.provider.edit.data.name)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.provider.provider.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.provider.provider.edit.modal",false,this.state),()=>
                              this.setState(State("dialog.provider.provider.edit.data",{id:-1,name:"",number:"",type:""},this.state))) );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()
                  }} onNoClick={()=>this.setState(State('dialog.provider.provider.edit.modal',false,this.state))}>
                      <div>
                      <label >დასახელება </label>
                      <InputText value={this.state.dialog.provider.provider.edit.data.name} onChange={(e) => this.setState(State('dialog.provider.provider.edit.data.name', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                    </div>
                  </TableComponent.Insert>);
                }
              },
            },
            details:{
              new:{
                modal:false,
                data: {id:-1,name:"",number:"",type:""},
                update:false,
                render: () => {
                  return (<TableComponent.Insert show={this.state.dialog.provider.details.new.modal} onYesClick={()=>{
                    http2.post("/api/secured/List/Model/Insert?lvl=2&parent="+this.state.provider.id+"&name="+this.state.dialog.provider.details.new.data.name)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.provider.details.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.provider.details.new.modal",false,this.state),()=>
                              this.setState(State("dialog.provider.details.new.data",{id:-1,name:""},this.state)
                              ))
                          );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()


                  }} onNoClick={()=>this.setState(State('dialog.provider.details.new.modal',false,this.state))}>
                    <div>
                      <label >დასახელება </label>
                      <InputText value={this.state.dialog.provider.details.new.data.name} onChange={(e) => this.setState(State('dialog.provider.details.new.data.name', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                    </div>
                  </TableComponent.Insert>);
                }
              },
              edit:{
                modal:false,
                data:{id:-1,name:""},
                update:false,
                render: () => {
                  return (<TableComponent.Insert show={this.state.dialog.provider.details.edit.modal} onYesClick={()=>{
                    http2.post("/api/secured/List/Model/Update?id="+this.state.dialog.provider.details.edit.data.id+"&name="+this.state.dialog.provider.details.edit.data.name)
                      .then(response=>{
                        if(response.status){
                          this.setState(State('dialog.provider.details.new.update', true,this.state,this),()=>
                            this.setState(State("dialog.provider.details.edit.modal",false,this.state),()=>
                              this.setState(State("dialog.provider.details.edit.data",{id:-1,name:""},this.state))) );
                        }else {
                          alert("დაფიქსირდა შეცდომა");
                        }
                      })
                      .catch()
                  }} onNoClick={()=>this.setState(State('dialog.provider.details.edit.modal',false,this.state))}>

                    <div>
                      <label >დასახელება </label>
                      <InputText value={this.state.dialog.provider.details.edit.data.name} onChange={(e) => this.setState(State('dialog.provider.details.edit.data.name', e.target.value,this.state))} placeholder={"დასახელება"} style={{ width:'100%'}}/>
                    </div>
                  </TableComponent.Insert>);
                }
              },
            },
          }
       },
       tabs: [
         {label:'სტრუქტურა',type:'structura'},
         {label:'საზომი ერთეული',type:'unit'},
         {label:'სასაქონლო ჯგუფი',type:'group'},
         {label:'ინვენტარის ტიპი',type:'type'},
         {label:'ინვენტარის სტატუსი',type:'status'},
         {label:'საწყობის სექცია',type:'section'},
         {label:'მწარმოებელი',type:'provider'},
         {label:'მომწოდებელი',type:'provider1'},
       ],
       structureTabs:[
         {label: 'საშტატო ერთეული', type: 'structura_1'},
         {label: 'სტრუქტურული ერთეული', type: 'structura_2'},
         {label: 'თანამდებობა', type: 'structura_3'},
         {label: 'თანამშრომლები', type: 'structura_4'},

       ],
        activeItem:{label:'სტრუქტურა',type:'structura'},
       activeStructuraItem: {label: 'საშტატო ერთეული', type: 'structura_1'},
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
       },
       sector:{
         parent: {
           id:-1,
           name: ''
         }
       },
       unit:{
          region:{
            id:-1,
            name:''
          },
          city:{
           id:-1,
           name:''
         },
          building:{
           id:-1,
           name:''
         },
          section:{
           id:-1,
           name:''
         }
       },
       provider:{
         id:-1,
         name:''
       },
       providerDetails:{
         id:-1,
         name:''
       },
       measureUnit:{id:-1,name:"",value:""},
       type:{id:-1,name:"",value:""},
       status:{id:-1,name:"",value:""},
       section2:{id:-1,name:"",value:""},
       supplier:{id:-1,name:"",number:"",type:""},
     };

   }
  renderDialogs = () => {
    return ( <>
        {
          this.state.dialog.department.new.render()
        }
        {
          this.state.dialog.department.edit.render()
        }
        {
          this.state.dialog.division.new.render()
        }
        {
          this.state.dialog.division.edit.render()
        }
        {
          this.state.dialog.section.new.render()
        }
        {
          this.state.dialog.section.edit.render()
        }
        {/*UNIT*/}
        {
          this.state.dialog.unit.region.new.render()
        }
        {
          this.state.dialog.unit.region.edit.render()
        }
        {
          this.state.dialog.unit.city.new.render()
        }
        {
          this.state.dialog.unit.city.edit.render()
        }
        {
          this.state.dialog.unit.building.new.render()
        }
        {
          this.state.dialog.unit.building.edit.render()
        }
        {
          this.state.dialog.unit.section.new.render()
        }
        {
          this.state.dialog.unit.section.edit.render()
        }
        {
          this.state.dialog.measureUnit.new.render()
        }
        {
          this.state.dialog.measureUnit.edit.render()
        }
        {
          this.state.dialog.type.new.render()
        }
        {
          this.state.dialog.type.edit.render()
        }
        {
          this.state.dialog.status.new.render()
        }
        {
          this.state.dialog.status.edit.render()
        }
        {
          this.state.dialog.section2.new.render()
        }
        {
          this.state.dialog.section2.edit.render()
        }
        {
          this.state.dialog.supplier.new.render()
        }
        {
          this.state.dialog.supplier.edit.render()
        }
        {
          this.state.dialog.provider.provider.new.render()
        }
        {
          this.state.dialog.provider.provider.edit.render()
        }
        {
          this.state.dialog.provider.details.new.render()
        }
        {
          this.state.dialog.provider.details.edit.render()
        }
      </>
    )
   };
  render() {
    return (
      <div>
        {this.renderDialogs()}
        <div className="actionButton ribbon">
          <div className="buttonBox">
            {
              _.map(this.state.tabs, (a,index)=>{
                return <Button key={index} label={a.label} className={this.state.activeItem.type === a.type?"":"p-button-secondary"} onClick={() => this.setState({activeItem: a})} />
              })
            }
          </div>
        </div>
        {/*<TabMenu className="main-item" model={this.state.tabs} activeItem={this.state.activeItem} onTabChange={(e) => this.setState({activeItem: e.value},()=>console.log(this.state))}/>*/}
        {/*  <br/>*/}
        {
          this.state.activeItem['type']==='structura'? <TabMenu model={this.state.structureTabs} activeItem={this.state.activeStructuraItem} onTabChange={(e) => this.setState({activeStructuraItem: e.value})}/>:<></>
        }
        <div className="directory" >
          {

            (this.state.activeItem['type']==='structura')?this.renderStructurItem(): this.renderData()
          }
        </div>
      </div>
    )
  }
  renderStructurItem=()=> {
     try{
       switch(this.state.activeStructuraItem.type){
         case 'structura_1':
           if(this.state.activeItem['type']==='structura'){
             return <div className="row">
               <div className="col-md-4">
                 <Table
                   update={this.state.dialog.department.new.update}
                   name={"futkara1"}
                   URL={"/api/secured/Organizational/Structure/Department/Select?1=1"}
                   onSelect={(selected) => {
                    (!_.isEmpty(selected))? this.setState(State('division.parent', selected, this.state), () => this.setState(State('section.parent.id', -1, this.state)))  :this.setState(State('division.parent', {id:-1,name:''}, this.state))
                   }}
                   Thead={
                     <tr>
                       <th>ID</th>
                       <th>დასახელება</th>
                     </tr>
                   }
                   mainHeader={
                     <tr>
                       <th colSpan={2} style={{textAlign:'right'}}>
                          <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>this.setState(State('dialog.department.new.update',false,this.state),()=>this.setState(State('dialog.department.new.modal',true,this.state)))}/>
                          &nbsp; &nbsp;
                          <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                            if(this.state.division.parent.id !== -1){
                              this.setState(State('dialog.department.new.update',false,this.state),()=>this.setState(State('dialog.department.edit.data',this.state.division.parent,this.state),()=>this.setState(State('dialog.department.edit.modal',true,this.state))));
                            }
                          }}/>
                         &nbsp;
                         &nbsp;
                          <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                            if(this.state.division.parent.id ===-1){
                              return ;
                            }
                            if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                                http2.get("/api/secured/Organizational/Structure/Delete?id="+this.state.division.parent.id)
                                  .then(response=>{
                                    if(response.status){
                                      this.setState(State('dialog.department.new.update',false,this.state),()=>this.setState(State('dialog.department.new.update',true,this.state)));
                                    }
                                  })
                            }
                          }}/>
                       </th>
                     </tr>
                   }
                   Fields={[
                     {
                       field: 'data.id'
                     },
                     {
                       field: 'data.name'
                     }
                   ]}
                 />
               </div>
               <div className="col-md-4">
                 <Table
                   update={this.state.dialog.division.new.update}
                   name={"futkara2"}
                   URL={"/api/secured/Organizational/Structure/Division/Select?parentId=" + this.state.division.parent['id']}
                   onSelect={(selected) => {
                     (!_.isEmpty(selected)) ? this.setState(State('section.parent', selected, this.state)) : this.setState(State('section.parent', {id:-1,name:''}, this.state))
                   }}
                   Thead={
                     <tr>
                       <th>ID</th>
                       <th>დასახელება</th>
                     </tr>
                   }
                   Fields={[
                     {
                       field: 'data.id'
                     },
                     {
                       field: 'data.name'
                     }
                   ]}
                   mainHeader={
                     <tr>
                       <th colSpan={2} style={{textAlign:'right'}}>
                         <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>this.setState(State('dialog.division.new.update',false,this.state),()=>this.setState(State('dialog.division.new.modal',true,this.state)))}/>
                         &nbsp; &nbsp;
                         <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                           if(this.state.section.parent.id !== -1){
                             this.setState(State('dialog.division.new.update',false,this.state),()=>this.setState(State('dialog.division.edit.data',this.state.section.parent,this.state),()=>this.setState(State('dialog.division.edit.modal',true,this.state))));
                           }
                         }}/>
                         &nbsp;
                         &nbsp;
                         <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                           if(this.state.division.parent.id ===-1){
                             return ;
                           }
                           if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                             http2.get("/api/secured/Organizational/Structure/Delete?id="+this.state.section.parent.id)
                               .then(response=>{
                                 if(response.status){
                                   this.setState(State('dialog.division.new.update',false,this.state),()=>this.setState(State('dialog.division.new.update',true,this.state)));
                                 }
                               })
                           }
                         }}/>
                       </th>
                     </tr>
                   }
                 />
               </div>
               <div className="col-md-4">
                 <Table
                   update={this.state.dialog.section.new.update}
                   name={"futkara3"}
                   URL={"/api/secured/Organizational/Structure/Sector/Select?parentId=" + this.state.section.parent['id']}
                   Thead={
                     <tr>
                       <th>ID</th>
                       <th>დასახელება</th>
                     </tr>
                   }
                   onSelect={(selected) => {
                     (!_.isEmpty(selected)) ? this.setState(State('sector.parent', selected, this.state)) : this.setState(State('sector.parent', {id:-1,name:''}, this.state))
                   }}
                   Fields={[
                     {
                       field: 'data.id'
                     },
                     {
                       field: 'data.name'
                     }
                   ]}
                   mainHeader={
                     <tr>
                       <th colSpan={2} style={{textAlign:'right'}}>
                         <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>this.setState(State('dialog.section.new.update',false,this.state),()=>this.setState(State('dialog.section.new.modal',true,this.state)))}/>
                         &nbsp; &nbsp;
                         <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                           if(this.state.sector.parent.id !== -1){
                             this.setState(State('dialog.section.new.update',false,this.state),()=>this.setState(State('dialog.section.edit.data',this.state.sector.parent,this.state),()=>this.setState(State('dialog.section.edit.modal',true,this.state))));
                           }
                         }}/>
                         &nbsp;
                         &nbsp;
                         <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                           if(this.state.division.parent.id ===-1){
                             return ;
                           }
                           if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                             http2.get("/api/secured/Organizational/Structure/Delete?id="+this.state.sector.parent.id)
                               .then(response=>{
                                 if(response.status){
                                   this.setState(State('dialog.section.new.update',false,this.state),()=>this.setState(State('dialog.section.new.update',true,this.state)));
                                 }
                               })
                           }
                         }}/>
                       </th>
                     </tr>
                   }
                 />
               </div>
             </div>;
           }
         case 'structura_2':
           if(this.state.activeItem['type']==='structura'){
             return  <div className="row">
               <div className="col-md-3">
                 <Table
                   URL={"/api/secured/StructuralUnit/Select?parentId=0"}
                   onSelect={(selected)=>{ (!_.isEmpty(selected))? this.setState(State('unit',{
                     region:{
                       id:-1,
                       name:''
                     },
                     city:{
                       id:-1,
                       name:''
                     },
                     building:{
                       id:-1,
                       name:''
                     }
                   },this.state),()=>this.setState(State('unit.region', selected,this.state)))  :this.setState(State('unit.region', {id:-1,name:""},this.state)) } }
                   Thead={
                     <tr>
                       <th >ID</th>
                       <th >დასახელება</th>
                     </tr>
                   }
                   update={this.state.dialog.unit.region.new.update}
                   mainHeader={
                     <tr>
                       <th colSpan={2} style={{textAlign:'right'}}>
                         <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>this.setState(State('dialog.unit.region.new.modal',false,this.state),()=>this.setState(State('dialog.unit.region.new.modal',true,this.state)))}/>
                         &nbsp; &nbsp;
                         <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                           if(this.state.unit.region.id !== -1){
                             this.setState(State('dialog.unit.region.new.update',false,this.state),()=>this.setState(State('dialog.unit.region.edit.data',this.state.unit.region,this.state),()=>this.setState(State('dialog.unit.region.edit.modal',true,this.state))));
                           }
                         }}/>
                         &nbsp;
                         &nbsp;
                         <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                           if(this.state.unit.region.id ===-1){
                             return ;
                           }
                           if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                             http2.get("/api/secured/StructuralUnit/Delete?id="+this.state.unit.city.id)
                               .then(response=>{
                                 if(response.status){
                                   this.setState(State('dialog.unit.city.new.update',false,this.state),()=>this.setState(State('dialog.unit.city.new.update',true,this.state)));
                                 }
                               })
                           }
                         }}/>
                       </th>
                     </tr>
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
               <div className="col-md-3">
                 <Table
                   URL={"/api/secured/StructuralUnit/Select?parentId="+this.state.unit.region['id']}
                   onSelect={(selected)=>{ (!_.isEmpty(selected))? this.setState(State('unit.building',{
                     id:-1,
                     name:''
                   },this.state),()=> this.setState(State('unit.city', selected,this.state))):this.setState(State('unit.city', {id:-1,name:""},this.state)) } }
                   Thead={
                     <tr>
                       <th >ID</th>
                       <th >დასახელება</th>
                     </tr>
                   }
                   Fields={[
                     {
                       field:'data.id'
                     },
                     {
                       field:'data.name'
                     }
                   ]}
                   update={this.state.dialog.unit.city.new.update}
                   mainHeader={
                     <tr>
                       <th colSpan={2} style={{textAlign:'right'}}>
                         <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>{
                           if(this.state.unit.region.id ===-1){
                               return ;
                           }
                           this.setState(State('dialog.unit.city.new.modal',false,this.state),()=>this.setState(State('dialog.unit.city.new.modal',true,this.state)))}}/>
                         &nbsp; &nbsp;
                         <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                           if(this.state.unit.city.id !== -1){
                             this.setState(State('dialog.unit.city.new.update',false,this.state),()=>this.setState(State('dialog.unit.city.edit.data',this.state.unit.city,this.state),()=>this.setState(State('dialog.unit.city.edit.modal',true,this.state))));
                           }
                         }}/>
                         &nbsp;
                         &nbsp;
                         <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                           if(this.state.unit.city.id ===-1){
                             return ;
                           }
                           if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                             http2.get("/api/secured/StructuralUnit/Delete?id="+this.state.unit.city.id)
                               .then(response=>{
                                 if(response.status){
                                   this.setState(State('dialog.unit.city.new.update',false,this.state),()=>this.setState(State('dialog.unit.city.new.update',true,this.state)));
                                 }
                               })
                           }
                         }}/>
                       </th>
                     </tr>
                   }
                 />
               </div>
               <div className="col-md-3">
                 <Table
                   URL={"/api/secured/StructuralUnit/Select?parentId="+this.state.unit.city['id']}
                   onSelect={(selected)=>{ (!_.isEmpty(selected))? this.setState(State('unit.building', selected,this.state)):this.setState(State('unit.building', {id:-1,name:""},this.state)) } }
                   Thead={
                     <tr>
                       <th >ID</th>
                       <th >დასახელება</th>
                     </tr>
                   }
                   Fields={[
                     {
                       field:'data.id'
                     },
                     {
                       field:'data.name'
                     }
                   ]}
                   update={this.state.dialog.unit.building.new.update}
                   mainHeader={
                     <tr>
                       <th colSpan={2} style={{textAlign:'right'}}>
                         <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>{
                           if(this.state.unit.city.id ===-1){
                             return ;
                           }
                           this.setState(State('dialog.unit.building.new.modal',false,this.state),()=>this.setState(State('dialog.unit.building.new.modal',true,this.state)))}}/>
                         &nbsp; &nbsp;
                         <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                           if(this.state.unit.building.id !== -1){
                             this.setState(State('dialog.unit.building.new.update',false,this.state),()=>this.setState(State('dialog.unit.building.edit.data',this.state.unit.building,this.state),()=>this.setState(State('dialog.unit.building.edit.modal',true,this.state))));
                           }
                         }}/>
                         &nbsp;
                         &nbsp;
                         <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                           if(this.state.unit.building.id ===-1){
                             return ;
                           }
                           if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                             http2.get("/api/secured/StructuralUnit/Delete?id="+this.state.unit.building.id)
                               .then(response=>{
                                 if(response.status){
                                   this.setState(State('dialog.unit.building.new.update',false,this.state),()=>this.setState(State('dialog.unit.building.new.update',true,this.state)));
                                 }
                               })
                           }
                         }}/>
                       </th>
                     </tr>
                   }
                 />
               </div>
               <div className="col-md-3">
                 <Table
                   URL={"/api/secured/StructuralUnit/Select?parentId="+this.state.unit.building['id']}
                   onSelect={(selected)=>{ (!_.isEmpty(selected))? this.setState(State('unit.section', selected,this.state)):this.setState(State('unit.section', {id:-1,name:""},this.state)) } }

                   Thead={
                     <tr>
                       <th >ID</th>
                       <th >დასახელება</th>
                     </tr>
                   }
                   Fields={[
                     {
                       field:'data.id'
                     },
                     {
                       field:'data.name'
                     }
                   ]}
                   update={this.state.dialog.unit.section.new.update}
                   mainHeader={
                     <tr>
                       <th colSpan={2} style={{textAlign:'right'}}>
                         <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>{
                           if(this.state.unit.building.id ===-1){
                             return ;
                           }
                           this.setState(State('dialog.unit.section.new.modal',false,this.state),()=>this.setState(State('dialog.unit.section.new.modal',true,this.state)))}}/>
                         &nbsp; &nbsp;
                         <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                           if(this.state.unit.section.id !== -1){
                             this.setState(State('dialog.unit.section.new.update',false,this.state),()=>this.setState(State('dialog.unit.section.edit.data',this.state.unit.section,this.state),()=>this.setState(State('dialog.unit.section.edit.modal',true,this.state))));
                           }
                         }}/>
                         &nbsp;
                         &nbsp;
                         <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                           if(this.state.unit.section.id ===-1){
                             return ;
                           }
                           if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                             http2.get("/api/secured/StructuralUnit/Delete?id="+this.state.unit.section.id)
                               .then(response=>{
                                 if(response.status){
                                   this.setState(State('dialog.unit.section.new.update',false,this.state),()=>this.setState(State('dialog.unit.section.new.update',true,this.state)));
                                 }
                               })
                           }
                         }}/>
                       </th>
                     </tr>
                   }
                 />
               </div>
             </div>;
           }
         case 'structura_3':
           if(this.state.activeItem['type']==='structura'){
             return  <div className="row">
                  <Position/>
               </div>;
           }
         case 'structura_4':
           if(this.state.activeItem['type']==='structura'){
             return  <div className="row">
               <Employeees/>
             </div>;
           }
           default:
           return  null
           break;
       }
     } catch (e) {
     }
   }
   renderData=()=> {
      switch (this.state.activeItem['type']) {
        case 'type':
            return <div className="row">
              <div className="col-md-12">
                <Table
                  URL={"/api/secured/ItemType/Select?1=1"}
                  Thead={
                    <tr>
                      <th >ID</th>
                      <th >დასახელება</th>
                    </tr>
                  }
                  Fields={[
                    {
                      field:'data.id'
                    },
                    {
                      field:'data.name'
                    }
                  ]}
                  onSelect={(selected)=>{ (!_.isEmpty(selected))? this.setState(State('type', selected,this.state)):this.setState(State('type', {id:-1,name:""},this.state)) } }
                  update={this.state.dialog.type.new.update}
                  mainHeader={
                    <tr>
                      <th colSpan={2} style={{textAlign:'right'}}>
                        <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>{
                          this.setState(State('dialog.type.new.modal',false,this.state),()=>this.setState(State('dialog.type.new.modal',true,this.state)))}}/>
                        &nbsp; &nbsp;
                        <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                          if(this.state.type.id !== -1){
                            this.setState(State('dialog.type.new.update',false,this.state),()=>this.setState(State('dialog.type.edit.data',this.state.type,this.state),()=>this.setState(State('dialog.type.edit.modal',true,this.state))));
                          }
                        }}/>
                        &nbsp;
                        &nbsp;
                        <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                          if(this.state.type.id ===-1){
                            return ;
                          }
                          if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                            http2.get("/api/secured/ItemType/Delete?id="+this.state.type.id)
                              .then(response=>{
                                if(response.status){
                                  this.setState(State('dialog.type.new.update',false,this.state),()=>this.setState(State('dialog.type.new.update',true,this.state)));
                                }
                              })
                          }
                        }}/>
                      </th>
                    </tr>
                  }
                  />
              </div>
            </div>
        case 'status':
            return <div className="row">
              <div className="col-md-12">
                <Table
                  URL={"/api/secured/ItemStatus/Select?1=1"}
                  Thead={
                    <tr>
                      <th >ID</th>
                      <th >დასახელება</th>
                    </tr>
                  }
                  Fields={[
                    {
                      field:'data.id'
                    },
                    {
                      field:'data.name'
                    }
                  ]}
                  onSelect={(selected)=>{ (!_.isEmpty(selected))? this.setState(State('status', selected,this.state)):this.setState(State('status', {id:-1,name:""},this.state)) } }
                  update={this.state.dialog.status.new.update}
                  mainHeader={
                    <tr>
                      <th colSpan={2} style={{textAlign:'right'}}>
                        <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>{
                          this.setState(State('dialog.status.new.update',false,this.state));
                          this.setState(State('dialog.status.new.modal',false,this.state),()=>this.setState(State('dialog.status.new.modal',true,this.state)))}}/>
                        &nbsp; &nbsp;
                        <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                          if(this.state.status.id !== -1){
                            this.setState(State('dialog.status.new.update',false,this.state),()=>this.setState(State('dialog.status.edit.data',this.state.status,this.state),()=>this.setState(State('dialog.status.edit.modal',true,this.state))));
                          }
                        }}/>
                        &nbsp;
                        &nbsp;
                        <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                          if(this.state.status.id ===-1){
                            return ;
                          }
                          if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                            http2.get("/api/secured/ItemStatus/Delete?id="+this.state.status.id)
                              .then(response=>{
                                if(response.status){
                                  this.setState(State('dialog.status.new.update',false,this.state),()=>this.setState(State('dialog.status.new.update',true,this.state)));
                                }
                              })
                          }
                        }}/>
                      </th>
                    </tr>
                  }
                  />
              </div>
            </div>
        case 'section':
            return <div className="row">
              <div className="col-md-12">
                <Table
                  URL={"/api/secured/stock/Select?1=1"}
                  Thead={
                    <tr>
                      <th >ID</th>
                      <th >დასახელება</th>
                    </tr>
                  }
                  Fields={[
                    {
                      field:'data.id'
                    },
                    {
                      field:'data.name'
                    }
                  ]}
                  onSelect={(selected)=>{ (!_.isEmpty(selected))? this.setState(State('section2', selected,this.state)):this.setState(State('section2', {id:-1,name:""},this.state)) } }
                  update={this.state.dialog.section2.new.update}
                  mainHeader={
                    <tr>
                      <th colSpan={2} style={{textAlign:'right'}}>
                        <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>{
                          this.setState(State('dialog.section2.new.update',false,this.state));
                          this.setState(State('dialog.section2.new.modal',false,this.state),()=>this.setState(State('dialog.section2.new.modal',true,this.state)))}}/>
                        &nbsp; &nbsp;
                        <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                          if(this.state.section2.id !== -1){
                            this.setState(State('dialog.section2.new.update',false,this.state),()=>this.setState(State('dialog.section2.edit.data',this.state.section2,this.state),()=>this.setState(State('dialog.section2.edit.modal',true,this.state))));
                          }
                        }}/>
                        &nbsp;
                        &nbsp;
                        <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                          if(this.state.section2.id ===-1){
                            return ;
                          }
                          if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                            http2.get("/api/secured/stock/Delete?id="+this.state.section2.id)
                              .then(response=>{
                                if(response.status){
                                  this.setState(State('dialog.section2.new.update',false,this.state),()=>this.setState(State('dialog.section2.new.update',true,this.state)));
                                }
                              })
                          }
                        }}/>
                      </th>
                    </tr>
                  }
                  />
              </div>
            </div>
        case 'provider1':
            return <div className="row">
              <div className="col-md-12">
                <Table
                  URL={"/api/secured/Supplier/Select?1=1"}
                  Thead={
                    <tr>
                      <th >ID</th>
                      <th >ნომერი</th>
                      <th >დასახელება</th>
                    </tr>
                  }
                  Fields={[
                    {
                      field:'id'
                    },{
                      field:'code'
                    },
                    {
                      field:'generatedName'
                    }
                  ]}
                  onSelect={(selected)=>    { (!_.isEmpty(selected))? this.setState(State('supplier', {
                    id:selected.id,
                    number:selected.code,
                    name:selected.name,
                    type:selected.type
                  },this.state)):this.setState(State('supplier', {id:-1,name:"",type:"",number:""},this.state)) } }
                  update={this.state.dialog.supplier.new.update}
                  mainHeader={
                    <tr>
                      <th colSpan={3} style={{textAlign:'right'}}>
                        <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>{
                          this.setState(State('dialog.supplier.new.update',false,this.state));
                          this.setState(State('dialog.supplier.new.modal',false,this.state),()=>this.setState(State('dialog.supplier.new.modal',true,this.state)))}}/>
                        &nbsp; &nbsp;
                        <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                          if(this.state.supplier.id !== -1){
                            this.setState(State('dialog.supplier.new.update',false,this.state),()=>this.setState(State('dialog.supplier.edit.data',this.state.supplier,this.state),()=>this.setState(State('dialog.supplier.edit.modal',true,this.state))));
                          }
                        }}/>
                        &nbsp;
                        &nbsp;
                        <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                          if(this.state.supplier.id ===-1){
                            return ;
                          }
                          if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                            http2.get("/api/secured/Supplier/Delete?id="+this.state.supplier.id)
                              .then(response=>{
                                if(response.status){
                                  this.setState(State('dialog.supplier.new.update',false,this.state),()=>this.setState(State('dialog.supplier.new.update',true,this.state)));
                                }
                              })
                          }
                        }}/>
                      </th>
                    </tr>
                  }
                  />
              </div>
            </div>
        case 'provider':
            return <div className="row">
              <div className="col-md-6">
                <Table
                  URL={"/api/secured/List/Maker/Select?1=1"}
                  onSelect={(selected)=>this.setState(State('provider', selected,this.state))}
                  Thead={
                    <tr>
                      <th >ID</th>
                      <th >დასახელება</th>
                    </tr>
                  }
                  Fields={[
                    {
                      field:'data.id'
                    },
                    {
                      field:'data.name'
                    }
                  ]}
                  update={this.state.dialog.provider.provider.new.update}
                  mainHeader={
                    <tr>
                      <th colSpan={3} style={{textAlign:'right'}}>
                        <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>{
                          this.setState(State('dialog.provider.provider.new.update',false,this.state));
                          this.setState(State('dialog.provider.provider.new.modal',false,this.state),()=>this.setState(State('dialog.provider.provider.new.modal',true,this.state)))}}/>
                        &nbsp; &nbsp;
                        <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                          if(this.state.provider.id !== -1){
                            this.setState(State('dialog.provider.provider.new.update',false,this.state),()=>this.setState(State('dialog.provider.provider.edit.data',this.state.provider,this.state),()=>this.setState(State('dialog.provider.provider.edit.modal',true,this.state))));
                          }
                        }}/>
                        &nbsp;
                        &nbsp;
                        <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                          if(this.state.provider.id ===-1){
                            return ;
                          }
                          if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                            http2.get("/api/secured/List/Maker/Delete?id="+this.state.provider.id)
                              .then(response=>{
                                if(response.status){
                                  this.setState(State('dialog.provider.provider.new.update',false,this.state),()=>this.setState(State('dialog.provider.provider.new.update',true,this.state)));
                                }
                              })
                          }
                        }}/>
                      </th>
                    </tr>
                  }
                  />
              </div>
              <div className="col-md-6">
                <Table
                  name={"asdasd"}
                  URL={"/api/secured/List/Model/Select?parent="+((!this.state.provider.id)? -1:this.state.provider.id)}
                  Thead={
                    <tr>
                      <th >ID</th>
                      <th >დასახელება</th>
                    </tr>
                  }
                  Fields={[
                    {
                      field:'data.id'
                    },
                    {
                      field:'data.name'
                    }
                  ]}
                  onSelect={(selected)=>    { (!_.isEmpty(selected))? this.setState(State('providerDetails', selected,this.state)):this.setState(State('providerDetails', {id:-1,name:""},this.state)) } }
                  update={this.state.dialog.provider.details.new.update}
                  mainHeader={
                    <tr>
                      <th colSpan={3} style={{textAlign:'right'}}>
                        <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=>{

                          if(this.state.provider.id !== -1){
                            this.setState(State('dialog.provider.details.new.update',false,this.state));
                            this.setState(State('dialog.provider.details.new.modal',false,this.state),()=>this.setState(State('dialog.provider.details.new.modal',true,this.state)))
                          }

                        }
                        }/>
                        &nbsp; &nbsp;
                        <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                          if(this.state.providerDetails.id !== -1){
                            this.setState(State('dialog.provider.details.new.update',false,this.state),()=>this.setState(State('dialog.provider.details.edit.data',this.state.providerDetails,this.state),()=>this.setState(State('dialog.provider.details.edit.modal',true,this.state))));
                          }
                        }}/>
                        &nbsp;
                        &nbsp;
                        <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                          if(this.state.providerDetails.id ===-1){
                            return ;
                          }
                          if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                            http2.get("/api/secured/List/Model/Delete?id="+this.state.providerDetails.id)
                              .then(response=>{
                                if(response.status){
                                  this.setState(State('dialog.provider.details.new.update',false,this.state),()=>this.setState(State('dialog.provider.details.new.update',true,this.state)));
                                }
                              })
                          }
                        }}/>
                      </th>
                    </tr>
                  }
                />
              </div>
            </div>;
        case 'unit':
          return <div className="row">
            <div className={"col-md-12"}>
              <Button label="დამატება" icon="pi pi-check" className="p-button-success" onClick={() => {
                this.setState(State('dialog.measureUnit.new.modal', false, this.state), () => this.setState(State('dialog.measureUnit.new.modal', true, this.state)))
              }}/> &nbsp;
              <Button label="რედაქტირება" icon="pi pi-pencil" onClick={() => {
                if (this.state.measureUnit.id > -1) {
                  this.setState(State('dialog.measureUnit.new.update', false, this.state), () => this.setState(State('dialog.measureUnit.edit.data', this.state.measureUnit, this.state), () => this.setState(State('dialog.measureUnit.edit.modal', true, this.state))));
                }
              }}/> &nbsp;
              <Button label="წაშლა" icon="pi pi-times" className="p-button-danger" onClick={() => {
                if (this.state.measureUnit.id === -1) {
                  return;
                }
                if (window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")) {
                  http2.get("/api/secured/MeasureUnit/Delete?id=" + this.state.measureUnit.id)
                    .then(response => {
                      if (response.status) {
                        this.setState(State('dialog.measureUnit.new.update', false, this.state), () => this.setState(State('dialog.measureUnit.new.update', true, this.state)));
                      }
                    })
                }
              }}/> &nbsp;
              <MeasurementUnit
                onSelect={(selected) => {
                  (!_.isEmpty(selected)) ? this.setState(State('measureUnit', {
                    id: selected['id'],
                    name: selected['name'],
                    value: selected['measureValue']
                  }, this.state)) : this.setState(State('measureUnit', {id: -1, name: ""}, this.state))
                }}
              />
            </div>
          </div>;
        case 'group': return <div className="row"> <div className={"col-md-12"}>
          <Group/>
        </div></div>
        default:
          break;

      }
   }
 }
export default Directory;

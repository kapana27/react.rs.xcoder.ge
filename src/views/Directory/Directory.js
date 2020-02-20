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

 class Directory extends Component{
  constructor(props) {
     super(props);
     this.state = {
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
         }
       },
       provider:{
         id:-1,
         name:''
       }
     };

   }
  render() {
    return (
      <div>

        <div className="actionButton ribbon">
          <div className="buttonBox">
            {
              _.map(this.state.tabs, (a)=>{
                return <Button label={a.label} className={this.state.activeItem.type === a.type?"":"p-button-secondary"} onClick={() => this.setState({activeItem: a})} />
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
             return  <div className="row">
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
                   },this.state),()=>this.setState(State('unit.region', selected,this.state)))  :this.setState(State('unit.region.id', -1,this.state)) } }
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
               <div className="col-md-3">
                 <Table
                   URL={"/api/secured/StructuralUnit/Select?parentId="+this.state.unit.region['id']}
                   onSelect={(selected)=>{ (!_.isEmpty(selected))? this.setState(State('unit.building',{
                     id:-1,
                     name:''
                   },this.state),()=> this.setState(State('unit.city', selected,this.state))):this.setState(State('unit.city.id', -1,this.state)) } }
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
               <div className="col-md-3">
                 <Table
                   URL={"/api/secured/StructuralUnit/Select?parentId="+this.state.unit.city['id']}
                   onSelect={(selected)=>{ (!_.isEmpty(selected))? this.setState(State('unit.building', selected,this.state)):this.setState(State('unit.building.id', -1,this.state)) } }

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
               <div className="col-md-3">
                 <Table
                   URL={"/api/secured/StructuralUnit/Select?parentId="+this.state.unit.building['id']}
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
        case 'status':
            return <div className="row">
              <div className="col-md-12">
                <Table
                  URL={"/api/secured/ItemStatus/Select?1=1"}
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
        case 'section':
            return <div className="row">
              <div className="col-md-12">
                <Table
                  URL={"/api/secured/stock/Select?1=1"}
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
          case 'provider1':
            return <div className="row">
              <div className="col-md-12">
                <Table
                  URL={"/api/secured/Supplier/Select?1=1"}
                  Thead={
                    <thead>
                    <tr>
                      <th >ID</th>
                      <th >ნომერი</th>
                      <th >დასახელება</th>
                    </tr>
                    </thead>
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
              <div className="col-md-6">
                <Table
                  URL={"/api/secured/List/Model/Select?parent="+this.state.provider.id}
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
        default:
          break;

      }
   }
 }
export default Directory;

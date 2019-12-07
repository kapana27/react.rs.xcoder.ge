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
import './messages.css';
import {State} from "../../utils";
import {Confirm, Table} from "../components";
import http from "../../api/http";


class Messages extends Component{
  constructor(props){
    super(props);
    this.state = {
      massage: {
      },
      tab: 0,
      paginator: {
        first: 0,
        rows: 0,
        first2: 0,
        rows2: 0
      },
      types:{
        'WI': 'ს.შ',
        'WW': 'ს.შ',
        'WS': 'ს.შ',
        'PS': 'ქ.გ',
        'PP': 'ქ.გ',
        'PW': 'ქ.გ',
        'SW': 'თ.გ',
        'SI': 'თ.შ',
        'PI': 'ქ.შ'
      },
      selected: {},
      confirm: false,
      update:false
    };
    this.onPageChange = this.onPageChange.bind(this);
    this.onPageChange2 = this.onPageChange2.bind(this);
  }

  onSelect = (selected) => {
    this.setState(State('selected', selected, this.state));
  };

  onAccept = () => {
     http.post("/api/secured/Item/Inbox/Approve?id="+this.state.selected.id)
       .then(result => {
         if(result.status === 200){
           this.setState(State('selected', {}, this.state));
           this.setState(State('update',true,this.state))
         }
       })
       .catch(reason => console.log(reason))
  };


  onDecline = () => {
      http.post("/api/secured/Item/Inbox/NotApprove?id="+this.state.selected.id)
        .then(result => {
          if(result.status === 200){
            this.setState(State('confirm', false, this.state));
            this.setState(State('selected', {}, this.state));
            this.setState(State('update',true,this.state))
          }
        })
        .catch(reason => console.log(reason))
  };



  render() {
    return  (
      <React.Fragment>
        {
          this.state.confirm?
            <Confirm
              header="უარყოფა"
              text="დარწმუნებული ხართ რომ გსურთ უარყოფა?"
              onHide={()=>this.setState(State('confirm',false,this.state))}
              click={status=>{
                  if(status === 'no'){
                    this.setState(State('confirm',false,this.state))
                  }else{
                    this.onDecline()
                  }
              }}
            />:''
        }
        <div className="actionButton">
          <div className="buttonBox">
            <Button label="მისაღები" className={this.state.tab === 0?'':'p-button-secondary'} onClick={()=>this.tabClick(0)} />
            <Button label="მიღებული"   className={this.state.tab === 1?'':'p-button-secondary'} onClick={()=>this.tabClick(1)} />
            <Button label="უარყოფილი"   className={this.state.tab === 2?'':'p-button-secondary'} onClick={()=>this.tabClick(2)} />
            <Button label="გაუქმების ოპერაციები"   className={this.state.tab === 34?'':'p-button-secondary'} onClick={()=>this.tabClick(34)} />
          </div>
        </div>
        <div className="messages-container">
            <div className="left-side">
              {
                this.renderLeftSideTable()
              }
            </div>
            <div className="right-side">
              <Table
                URL={"/api/secured/Item/Inbox/Detail/Select?id="+((this.state.selected.id)? this.state.selected.id:0)}
                Thead={
                  <thead>
                  <tr>
                    <th >დასახელება</th>
                    <th >მარკა</th>
                    <th >მოდელი</th>
                    <th >ფასი</th>
                    <th >რაოდენობა</th>
                    <th >შტრიხკოდი</th>
                  </tr>
                  </thead>
                }
                Fields={[
                  {
                    field:'item.name'
                  },
                  {
                    field:'item.maker.name'
                  },
                  {
                    field:'item.model.name'
                  },{
                    field:'item.price'
                  },{
                    field:'item.amount'
                  },{
                    field:'item.fullBarcode'
                  },
                ]}
              />
            </div>
        </div>
      </React.Fragment>
    )
  }
  tabClick(tabID) {
    this.setState(State('selected', {}, this.state));
    this.setState(State('tab',tabID,this.state));
  }
  onPageChange(event) {
    this.setState({
      first: event.paginator.first,
      rows: event.paginator.rows
    });
  }
  onPageChange2(event) {
    this.setState({
      first2: event.paginator.first,
      rows2: event.paginator.rows
    });
  }

  renderLeftSideTable=()=> {
    switch (this.state.tab) {
      case 0:
      case 1:
      case 2:
          return <Table
              URL={"/api/secured/Item/Inbox/Select?approved="+this.state.tab}
              onSelect={this.onSelect}
              selected={this.state.selected}
              update={this.state.update}
              Thead={
                <thead>
                <tr>
                  <th rowSpan="2">№</th>
                  <th colSpan={2}>ელ.ზედდებულის ნომერი</th>
                  {
                    (!_.isEmpty(this.state.selected) && this.state.tab===0)
                      ?
                      <th rowSpan="2">
                        <Button className="p-button-success" icon="pi pi-check"  tooltip="მიღება" tooltipOptions={{position: 'top'}} onClick={this.onAccept}/>&nbsp;
                        <Button className="p-button-danger" icon="pi pi-times"  tooltip="უარყოფა" tooltipOptions={{position: 'top'}} onClick={
                          ()=> this.setState(State('confirm',true,this.state))
                        }/>
                      </th>:
                      <th rowSpan="2">თარიღი</th>
                  }
                </tr>
                <tr>
                  <th>გასავლის ზედდებული</th>
                  <th>შემოსავლის ზედდებული</th>
                </tr>
                </thead>
              }
              Fields={[
                {
                  field:'id'
                },
                {
                  field:'operationType,id',
                  concated:true,
                  typed: true
                },
                {
                  field:'toOperationType,id',
                  concated:true,
                  typed: true
                },
                {
                  field:'trDate'
                },
              ]}
              Types={this.state.types}
            />
      case 34:
        return <Table
          URL={"/api/secured/Item/Inbox/Income?approved=0"}
          onSelect={this.onSelect}
          selected={this.state.selected}
          Thead={
            <thead>
            <tr>
              <th >ზედ. ნომერი</th>
              <th >ოპერაციის ტიპი</th>
              {
                (!_.isEmpty(this.state.selected) && this.state.tab===34)
                  ?
                  <th >
                    <Button className="p-button-danger" icon="pi pi-times"  tooltip="უარყოფა" tooltipOptions={{position: 'top'}} onClick={
                      ()=> this.setState(State('confirm',true,this.state))
                    }/>
                  </th>:
                  <th rowSpan="2">თარიღი</th>
              }
            </tr>
            </thead>
          }
          Fields={[
            {
              field:'id'
            },
            {
              field:'operationType'
            },
            {
              field:'trDate'
            },
          ]}
          Types={this.state.types}
        />
      default:
        return "";
    }
  }
}
export default Messages;


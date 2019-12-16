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
import './OverheadModalTable.css';
import {State} from "../../../utils";
import {AutoComplete, Calendar, Confirm, ErrorModal, Modal, Table} from "../../components";
import http from "../../../api/http";
import * as moment from "moment";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";


export default class OverheadModalTable extends Component{
  constructor(props){
    super(props);

    //console.log(this.props)
    this.state = {
      goodList: [],
      inventor: {
        income: {
          dialog: false,
          showDetails: false,
          date: new Date(),
          supplier: {id: null, name: ''},
          comment: "",
          addon: {Left: '', Right: ''},
          tempAddon: {Left: '', Right: ''},
          invoice: '',
          inspectionNumber: '',
          detail: {
            file: null,
            expand: false,
            dialog: false,
            itemGroup: {name: '', id: null, isStrict: 0, spend: 0, isCar: 0},
            item: {name: '', id: null},
            maker: {name: '', id: null},
            model: {name: '', id: null},
            measureUnit: {name: '', id: null},
            type: {name: '', id: null},
            status: {name: '', id: null},
            count: 1,
            price: 0,
            barCodeType: {name: '', id: null},
            barCode: '',
            factoryNumber: '',
            files: [],
            lastbarCode: {
              value: '',
              name: '',
              length: '',
              id: '',
              barCodeVisualValue: "",
              startPoint: "",
              endPoint: ""
            },
            list: [],
            comment: '',
            car: {
              number: "",
              year: "",
              vin: ""
            },
            numbers: {
              from: "",
              to: ""
            }
          },
          errors: {
            supplier: false,
            item: false,
            maker: false,
            measureUnit: false,
            type: false,
            status: false,
            count: false,
            price: false,
            barCodeType: false,
            model: false,
            itemGroup: false
          },
          data: []
        },
        list: []

      },

      types: {
        vatType: {
          '0': 'ჩვეულებრივი',
          '1': 'ნულოვანი',
          '2': 'დაუბეგრავი'
        },
        units: {
          '1': 'ცალი',
          '3': 'გრამი',
          '4': 'ლიტრი',
          '5': 'ტონა',
          '7': 'სანტიმეტრი',
          '8': 'მეტრი',
          '9': 'კილომეტრი',
          '10': 'კვ.სმ',
          '11': 'კვ.მ',
          '12': 'მ3',
          '13': 'ნილილიტრი',
          '2': 'კგ',
          '99': 'სხვა',
          '14': 'შეკრა'
        }
      }


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




  loadGoodList=(e)=>{
    http.post("/api/secured/Rs/getWaybill?id=" + e.id)
      .then(result => this.setState(State('goodList', result.data.goodsList.goods, this.state), () => {
          this.setState(State('inventor.income.data',_.map(result.data.goodsList.goods,(value,key)=>{
            return {
              file: null,
              expand: false,
              dialog: false,
              itemGroup: {name: '', id: null, isStrict: 0, spend: 0, isCar: 0},
              item: {name: value['wname'], id: null},
              maker: {name: '', id: null},
              model: {name: '', id: null},
              measureUnit: {name: '', id: null},
              type: {name: '', id: null},
              status: {name: '', id: null},
              count: value['quantity'],
              price: value['price'],
              barCodeType: {name: '', id: null},
              barCode: '',
              factoryNumber: '',
              files: [],
              lastbarCode: {
                value: '',
                name: '',
                length: '',
                id: '',
                barCodeVisualValue: "",
                startPoint: "",
                endPoint: ""
              },
              list: [],
              comment: '',
              car: {
                number: "",
                year: "",
                vin: ""
              },
              numbers: {
                from: "",
                to: ""
              }
            }
          }),this.state),()=>this.props.onChangeData(this.state.inventor.income))
      }));
  }

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
        <div className="messages-container">
          <div className="left-side">
            <Table
              onSelect={e=>this.loadGoodList(e)}
              data={this.props.data}
              rows={_.size(this.props.data)}
              Thead={
                <thead>
                <tr>
                  <th >დასახელება</th>
                  <th >გამყიდველი</th>
                  <th >ჯამური თანხა</th>
                  <th >თარიღი</th>
                </tr>
                </thead>
              }
              Fields={[
                {
                  field:'wayBillNumber'
                },
                {
                  field:'sellerName'
                },
                {
                  field:'fullAmount'
                },{
                  field:'createDate',
                  type:'date',
                  format:'YYYY-MM-DD'
                }
              ]}
            />
          </div>
          <div className="right-side">
            <Table
             data={this.state.goodList}
             rows={_.size(this.state.goodList)}
              Thead={
                <thead>
                <tr>
                  <th>დასახელება</th>
                  <th>რაოდენობა</th>
                  <th>ერთეულის ღირებულება</th>
                  <th>ჯამური ღირებულება</th>
                  <th>ტიპი</th>
                  <th>ერთეული</th>
                </tr>
                </thead>
              }
              Fields={[
                {
                  field:'wname'
                },
                {
                  field:'quantity'
                },
                {
                  field:'price'
                },
                {
                  field:'amount'
                },
                {
                  field:'vatType',
                  typed: true,
                  multiple:true,
                  multipleParams:'types.vatType',

                },
                {
                  field:'unitId',
                  typed: true,
                  multiple:true,
                  multipleParams:'types.units',
                }
              ]}
             Types = {this.state.types}
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

}


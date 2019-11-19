import React, { Component } from 'react';
import http from  '../../../api/http';
import {Config} from "../../../config/Config";
import {
  CardCellRenderer,
  Modal,
  Calendar,
  AutoComplete,
  FileUploader,
  Cart,
  TreeTableGroup,
  Search,
} from '../../components'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import {InputText} from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import {TabView,TabPanel} from 'primereact/tabview';
import _ from 'lodash';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import './warehouse.css';
import 'primeflex/primeflex.css';
import {State,putInCart,clearCartItem,removeCartItem,getCartItems} from '../../../utils';
import {Validator} from "../../../utils/validator";

import * as moment from 'moment';
import {from} from "moment/src/lib/moment/from";

export default class Warehouse extends Component {
  constructor(props){
    super(props);
    this.state = {
      grid: {
        components: {
          loadingCellRenderer: function (params) {
            if (params.value !== undefined) {
              return params.value;
            } else {
              return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/loading.gif">';
            }
          },
        },
        columnDefs: [
          {
            headerName: '#',
            field: 'rowId',
            width: 50,
            //cellRenderer: 'loadingCellRenderer',
            sortable: false,
            suppressMenu: false
          },
          {
            headerName: '',
            field: 'cartId',
            width: 50,
            valueGetter: 'cartId',
            cellRenderer: CardCellRenderer,
            sortable: false,
            suppressMenu: false,

          },
          {
            headerName: 'თარიღი',
            field: 'trDate',
            width: 150,
            suppressMenu: false,
            filter: 'agDateColumnFilter'
          },
          {
            headerName: 'დასახელება',
            field: 'name',
            width: 150,
            suppressMenu: false,
            filter: 'agTextColumnFilter',
            cellEditor: 'customInput',
          },
          {
            headerName: 'მარკა',
            field: 'maker.name',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: {defaultOption: 'startsWith'}
          },
          {
            headerName: 'მოდელი',
            field: 'model.name',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: {defaultOption: 'startsWith'}
          },
          {
            headerName: 'ფასი',
            field: 'price',
            width: 90,
            filter: 'agNumberColumnFilter',
            filterParams: {
              filterOptions: ['equals', 'lessThan', 'greaterThan'],
              suppressAndOrCondition: true
            }
          },
          {
            headerName: 'რაოდენობა',
            field: 'amount',
            width: 90,
            filter: 'agNumberColumnFilter',
            filterParams: {
              filterOptions: ['equals', 'lessThan', 'greaterThan'],
              suppressAndOrCondition: true
            }
          },
          {
            headerName: 'განზ, ერთეული',
            field: 'measureUnit.name',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: {defaultOption: 'startsWith'}
          },
          {
            headerName: 'შტრიხკოდი',
            field: 'barCode',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: {defaultOption: 'startsWith'}
          },
          {
            headerName: 'ქარხ.#',
            field: 'factoryNumber',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: {defaultOption: 'startsWith'}
          },
          {
            headerName: 'ჯგუფი',
            field: 'itemGroup.name',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: {defaultOption: 'startsWith'}
          },
          {
            headerName: 'ტიპი',
            field: 'itemType.name',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: {defaultOption: 'startsWith'}
          },
          {
            headerName: 'სტატუსი',
            field: 'itemStatus.name',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: {defaultOption: 'startsWith'}
          },
          {
            headerName: 'მიმწოდებელი',
            field: 'supplier.name',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: {defaultOption: 'startsWith'}
          },
          {
            headerName: 'ზედნადები',
            field: 'invoice',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: {defaultOption: 'startsWith'}
          },
          {
            headerName: 'ზედდებული',
            field: 'invoiceAddon',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: {defaultOption: 'startsWith'}
          },
          {
            headerName: 'ინსპ',
            field: 'inspectionNumber',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: {defaultOption: 'startsWith'}
          }
        ],
        defaultColDef: {
          sortable: true,
          resizable: true
        },
        rowSelection: 'single',
        rowModelType: 'serverSide',
        paginationPageSize: 100,
        cacheOverflowSize: 2,
        maxConcurrentDatasourceRequests: 2,
        infiniteInitialRowCount: 1,
        maxBlocksInCache: 2,
        gridOptions: {
          context: {
            thisComponent: this,
          },
          rowSelection: 'single',
          getSelectedRows: 'getSelectedRows',
        }
      },
      inventor: {
        income: {
          dialog: false,
          showDetails: false,
          date: new Date(),
          supplier: {id:'',name:''},
          comment:"",
          addon: {Left: '', Right: ''},
          invoice: '',
          inspectionNumber:'',
          detail: {
            file: null,
            expand:false,
            dialog: false,
            itemGroup: {name: '', id: null, isStrict:0, spend:0, isCar:0},
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
            factoryNumber:'',
            files:[],
            lastbarCode: {value: '', name: '', length: '', id: '', barCodeVisualValue: "", startPoint: "", endPoint: ""},
            list: [],
            car: {
              number:"",
              year:""
            },
            numbers:{
              from:"",
              to: ""
            }
          },
          errors: {
            supplier:false,
            item: false,
            maker: false,
            measureUnit:false,
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
        outcome: {
          dialog: false
        },
        transfer: {
          date: new Date(),
          dialog: false
        },
        search: {
          show: false,
          dialog: false,
        },
        supplierSuggestions: [],
        barCodes: [],
        measureUnitList: [],
        itemGroup: {
          dialog: false,
          data: {}
        },
        itemTypes: [],
        itemStatus: [],
        stock: [],
        itemSuggestions: [],
        makerSuggestions: [],
        modelSuggestions: []
      },
      tab: 11,
      cart: {
        tab11: [],
        tab12: [],
        dialog: false
      }
    };
    //this.loadConstructor();
  }
  componentDidMount() {
    console.log("did")
  }
  onGridReady(params, filter= false) {
    this.eventData = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const filterData = this.filter;
    const selectedTabId = this.selectedTabId;
    const cartItems = _.map(this.state.cart['tab'+this.state.tab],( (value,index)=>index));
    console.log(cartItems)
    const datasource = {
      getRows(params) {
        const parameters = [];
        for (const f in params['request']['filterModel']) {
          const name = (f.split('.').length > 0) ? f.split('.')[0] : f;
          parameters.push({
            property: name,
            value: (params['request']['filterModel'][f]['filterType'] != undefined && params['request']['filterModel'][f]['filterType'] === 'date' ) ? params['request']['filterModel'][f]['dateFrom'] : params['request']['filterModel'][f]['filter'],
            operator: (params['request']['filterModel'][f]['filterType'] != undefined && params['request']['filterModel'][f]['filterType'] === 'date' ) ? '=' : 'like'
          });
        }
        if (filter) {
          for (const f in filterData) {
            const name = (f.split('.').length > 0) ? f.split('.')[0] : f;
            if (filterData[f] != '' && filterData[f] != undefined && filterData[f] !== null) {
              parameters.push({
                property: name,
                value: filterData[f],
                operator: 'like'
              });
            }
          }
        }

        http.get(Config.management.warehouse.get.items+"?stockId=11&start="+params['request']['startRow']+"&limit="+params['request']['endRow']+"&filter="+encodeURIComponent(JSON.stringify(parameters)))
          .then(response => {
            params.successCallback(response['data'].map((v, k) => {
              console.log(v)

              v['rowId'] = (params['request']['startRow'] + 1 + k );
              if (v['barcode'].toString().length <= v['barCodeType']['length']) {
                v.barcode = v['barCodeType']['value'] + new Array(v['barCodeType']['length'] - (v['barcode'].toString().length - 1)).join('0').slice((v['barCodeType']['length'] - (v['barcode'].toString().length - 1) || 2) * -1) + v['barcode'];
              }
              v['count'] = 1;
              v['cartId'] = v['id'];
              v['barcode'] = (v['spend'] === 1) ? '' : (v['barcode'].toString() === '0') ? '' : v['barcode'];
              v['inCart'] = (cartItems.indexOf(v['id'].toString()) > -1);
              return v;
            }), response['totalCount']);
          })
          .catch(error => {
            params.failCallback();
          });
      }
    };
    params.api.setServerSideDatasource(datasource);
  }
  onInventorIncome() {
  this.resetInventor();
    http.get(Config.management.warehouse.get.insertStart).then(()=>{
      this.loadInventorData();
      this.setState(State('inventor.income.dialog', true, this.state));
    }).catch(()=>{
      this.setState(State('inventor.income.dialog', false, this.state));
    })
  }
  loadInventorData = () => {
    http.get("/api/secured/List/BarCode/Select").then(result => {
      if (result.status === 200) {
        this.setState(State('inventor.barCodes', _.map(result.data,(value,index)=>{  return { id:value.id, name: value.name}  }), this.state));
      }
    });
    http.get("/api/secured/MeasureUnit/List").then(result => {
      if (result.status === 200) {
        this.setState(State('inventor.measureUnitList', result.data, this.state));
      }
    });
    http.get("/api/secured/ItemType/Select").then(result => {
      if (result.status === 200) {
        this.setState(State('inventor.itemTypes', result.data, this.state));
      }
    });
    http.get("/api/secured/ItemStatus/Select").then(result => {
      if (result.status === 200) {
        this.setState(State('inventor.itemStatus', result.data, this.state));
      }
    });
    http.get("/api/secured/ItemGroup/Select?node=root").then(result => {
      let data = {
        root: _.map(result.data, (value, index) => {
          value['key'] = index.toString();
          if (!_.isUndefined(value.children) && _.size(value.children) > 0) {
            value.children = _.map(value.children, (value1, index1) => {
              value1['key'] = (index + "-" + index1);
              return value1;
            });
            return value;
          } else {
            return value;
          }
        })
      };
      this.setState(State("inventor.itemGroup.data", data, this.state));
    });
  };
  onReady = (params) => {
      this.getCartItems().then(()=>{
        this.onGridReady(params)
      })
  };
  render() {
    return (
      <React.Fragment>
        <div className="actionButton">
          <div className="buttonBox" style={{width: '150px'}}>
            <Button label="A" icon="pi pi-home" className={this.state.tab === 11?'':'p-button-secondary'} onClick={()=>this.tabClick(11)}/>
            <Button label="B" icon="pi pi-home" className={this.state.tab === 12?'':'p-button-secondary'} onClick={()=>this.tabClick(12)}/>
          </div>
          <div className="buttonBox">
            <Button label="ინვ.მიღება" icon="pi pi-plus" onClick={() => this.onInventorIncome()}/>
            <Button label="ძედ.მიღება" icon="pi pi-plus"/>
            <Button label="რედაქტირება" icon="pi pi-pencil"/>
          </div>
          <div className="buttonBox">
            <Button label="ინვ.გაცემა" icon="pi pi-arrow-up" className="p-button-danger"
                    onClick={() => this.setState(State('inventor.outcome.dialog', true, this.state))}/>
            <Button label="მოძრაობა A-B" className="ui-button-raised arrow-icon" onClick={() => this.setState(State('inventor.transfer.dialog', true, this.state))}/>
            {
              (!this.state.inventor.search.show)?
                <Button label="ძებნა" icon="pi pi-search"  onClick={()=>this.setState(State('inventor.search.show',true,this.state))}/>:''
            }
            <div className="cart_count">
              <i className="fa fa-cart-plus fa-lg " onClick={()=>this.setState(State('cart.dialog',true,this.state))}/>
              <span>{_.size(this.state.cart['tab'+this.state.tab])}</span>
            </div>
          </div>
        </div>

        {(this.state.inventor.search.show)?<Search onClick={()=>this.setState(State('inventor.search.show',false,this.state))}/>:''}

        <div
          id="myGrid"
          className="ag-theme-balham"
        >
          <AgGridReact
            pivotPanelShow={true}
            floatingFilter={true}
            columnDefs={this.state.grid.columnDefs}
            defaultColDef={this.state.grid.defaultColDef}
            rowModelType={this.state.grid.rowModelType}
            cacheBlockSize={this.state.grid.cacheBlockSize}
            maxBlocksInCache={this.state.grid.maxBlocksInCache}
            rowSelection={this.state.grid.rowSelection}
            paginationPageSize={this.state.grid.paginationPageSize}
            infiniteInitialRowCount={this.state.grid.infiniteInitialRowCount}
            rowDeselection={true}
            animateRows={true}
            debug={false}
            gridOptions={this.state.grid.gridOptions}
            onGridReady={this.onReady}
            onCellClicked={this.onClickedCell}
          />
        </div>
        <Modal
          header="ინვენტარის მიღება დეტალები"
          visible={this.state.inventor.income.detail.dialog}
          onHide={() => this.setState(State('inventor.income.detail.dialog', false, this.state))}
          style={{width: '1300px'}}
          footer={
            (<div>
              {(!_.isUndefined(this.state.inventor.income.detail.lastbarCode) && this.state.inventor.income.detail.lastbarCode.id) ?
                <span style={{
                  position: 'absolute',
                  left: '10px'
                }}>ბოლო შტრიხკოდი - {this.state.inventor.income.detail.lastbarCode.value + this.state.inventor.income.detail.lastbarCode.barCodeVisualValue} </span> :
                <span/>}
              {this.state.inventor.income.detail.expand ?
                <Button label="დამახსოვრება" icon="pi pi-check" onClick={this.onSaveDetail}/> :
                <Button label="ჩაშლა" icon="pi pi-check" onClick={this.onInventorDetailExpand}/>
              }
              <Button label="გაუქმება" icon="pi pi-times" className="p-button-secondary"
                      onClick={() => this.setState(State('inventor.income.detail.dialog', false, this.state))}/>
            </div>)
          }>
          {
            this.state.inventor.income.detail.expand ? (
              <div className="incomeAddedTable" style={{maxHeight: '300px', overflowY: 'scroll'}}>
                <table>
                  <thead>
                  <tr>
                    <th>დასახელება</th>
                    <th>მარკა</th>
                    <th>მოდელი</th>
                    <th>ფასი</th>
                    <th>რაოდენობა</th>
                    <th>განზ.ერთ</th>
                    <th>შტრიხცოდი</th>
                    <th>მანქანისნომერი</th>
                    <th>ჯგუფი</th>
                    <th>ტიპი</th>
                    <th>სტატუსი</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    _.map(this.state.inventor.income.detail.list, (value, index) => {
                      return (
                        <tr key={index}>
                          <td>{this.state.inventor.income.detail.item.name}</td>
                          <td>{this.state.inventor.income.detail.maker.name}</td>
                          <td>{this.state.inventor.income.detail.model.name}</td>
                          <td>{this.state.inventor.income.detail.price}</td>
                          <td>{this.state.inventor.income.detail.count}</td>
                          <td>{this.state.inventor.income.detail.measureUnit.name}</td>
                          <td>{this.state.inventor.income.detail.maker.name}</td>
                          <td>
                            {value.barCodeName}
                            <input type="text" value={value.barCode}
                                   onChange={event => this.setState(State('inventor.income.detail.list.' + index + '.barCode', event.target.value, this.state))}/>
                          </td>
                          <td>{this.state.inventor.income.detail.itemGroup.name}</td>
                          <td>{this.state.inventor.income.detail.type.name}</td>
                          <td>{this.state.inventor.income.detail.status.name}</td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </table>
              </div>) : (<div className="incomeModal p-grid">
              <div className="fullwidth p-col-2">
                <label>დასახელება</label>
                <AutoComplete
                  class={this.state.inventor.income.errors.item ? 'bRed' : ''}
                  placeholder="დასახელება"
                  field="name"
                  suggestions={this.state.inventor.itemSuggestions}
                  onComplete={this.suggestItem}
                  onSelect={(e) => this.setState(State('inventor.income.detail.item', e, this.state), () => this.parseInventorDetailData(this.state.inventor.income.detail.item))}
                  onChange={(e) => this.setState(State('inventor.income.detail.item', e, this.state))}
                  value={this.state.inventor.income.detail.item}
                />
              </div>
              <div className="fullwidth p-col-2">
                <label>მარკა</label>
                <AutoComplete
                  placeholder="მარკა"
                  field="name"
                  class={this.state.inventor.income.errors.maker ? 'bRed' : ''}
                  suggestions={this.state.inventor.makerSuggestions}
                  onComplete={this.suggestMaker}
                  onSelect={(e) => this.setState(State('inventor.income.detail.maker', e, this.state))}
                  onChange={(e) => this.setState(State('inventor.income.detail.maker', e, this.state))}
                  value={this.state.inventor.income.detail.maker}
                />
              </div>
              <div className="fullwidth p-col-2">
                <label>მოდელი</label>
                <AutoComplete
                  placeholder="მოდელი"
                  field="name"
                  class={this.state.inventor.income.errors.model ? 'bRed' : ''}
                  disabled={_.isUndefined(this.state.inventor.income.detail.maker) || (_.isNull(this.state.inventor.income.detail.maker.id) && _.isEmpty(this.state.inventor.income.detail.maker.name))}
                  suggestions={this.state.inventor.modelSuggestions}
                  onComplete={this.suggestModel}
                  onSelect={(e) => this.setState(State('inventor.income.detail.model', e, this.state))}
                  onChange={(e) => this.setState(State('inventor.income.detail.model.name', e, this.state))}
                  value={this.state.inventor.income.detail.model}
                />
              </div>
              <div className="fullwidth p-col-2">
                <label>რაოდენობა</label>
                <InputText type="text" placeholder="დასახელება"
                           className={this.state.inventor.income.errors.count ? 'bRed' : ''}
                           value={this.state.inventor.income.detail.count}
                           onChange={(e) => this.setState(State("inventor.income.detail.count", e.target.value, this.state))}/>
              </div>
              <div className="fullwidth p-col-2">
                <label>ერთეულის ფასი</label>
                <InputText type="text" placeholder="დასახელება" value={this.state.inventor.income.detail.price}
                           onChange={(e) => this.setState(State("inventor.income.detail.price", e.target.value, this.state))}/>
              </div>
              <div className="fullwidth p-col-2">
                <label>სულ ფასი:</label>
                <div
                  style={{lineHeight: '30px'}}>{Math.round(parseInt(this.state.inventor.income.detail.price) * parseInt(this.state.inventor.income.detail.count))}</div>
              </div>
              {
                (this.state.inventor.income.detail.itemGroup.spend === 1 || this.state.inventor.income.detail.itemGroup.isStrict === 1 || this.state.inventor.income.detail.itemGroup.isCar === 1) ? (
                    (this.state.inventor.income.detail.itemGroup.isStrict === 1) ?
                      (
                        <React.Fragment>
                          <div className="fullwidth p-col-2">
                            <label>დან</label>
                            <InputText type="text" placeholder="დან"
                                       value={this.state.inventor.income.detail.numbers.from}
                                       onChange={(e) => this.setState(State("inventor.income.detail.numbers.from", e.target.value, this.state))}/>
                          </div>
                          <div className="fullwidth p-col-2">
                            <label>მდე</label>
                            <InputText type="text" placeholder="მდე" value={this.state.inventor.income.detail.numbers.to}
                                       onChange={(e) => this.setState(State("inventor.income.detail.numbers.to", e.target.value, this.state))}/>
                          </div>
                        </React.Fragment>
                      )
                      :
                      (<div/>)
                  ) :
                  (
                    <div
                      className={`fullwidth barcode p-col-2 ${this.state.inventor.income.errors.barCodeType ? 'bRed' : ''} `}>
                      <label>შტრიხკოდი</label>
                      <Dropdown
                        value={this.state.inventor.income.detail.barCodeType}
                        options={this.state.inventor.barCodes}
                        onChange={(e) => this.setState(State("inventor.income.detail.barCodeType", {
                          id: e.value.id,
                          name: e.value.name
                        }, this.state), () => this.lastbarCode(this.state.inventor.income.detail.barCodeType))}
                        placeholder="ბარკოდი"
                        optionLabel="name"
                      />
                      <InputText type="text" placeholder="შტრ. კოდი"
                                 style={{textIndent: '0px', width: '78px', fontSize: '12px'}}
                                 value={this.state.inventor.income.detail.barCode}
                                 onChange={(e) => this.setState(State("inventor.income.detail.barCode", e.target.value, this.state))}/>
                    </div>
                  )
              }


              <div className="fullwidth p-col-2">
                <label>{(this.state.inventor.income.detail.itemGroup.isCar === 1) ? 'Vin კოდი' : 'ქარხნული ნომერი'}:</label>
                <InputText type="text" value={this.state.inventor.income.detail.factoryNumber}
                           onChange={(e) => this.setState(State("inventor.income.detail.factoryNumber", e.target.value, this.state))}/>
              </div>
              {
                (this.state.inventor.income.detail.itemGroup.isCar === 1) ?
                  (
                    <React.Fragment>
                      <div className="fullwidth p-col-2">
                        <label> სახელმწიფო ნომერი</label>
                        <InputText type="text" value={this.state.inventor.income.detail.car.number}
                                   onChange={(e) => this.setState(State("inventor.income.detail.car.number", e.target.value, this.state))}/>
                      </div>
                      <div className="fullwidth p-col-2">
                        <label>გამოშვების წელი</label>
                        <InputText type="text" value={this.state.inventor.income.detail.car.year}
                                   onChange={(e) => this.setState(State("inventor.income.detail.car.year", e.target.value, this.state))}/>
                      </div>
                    </React.Fragment>
                  ) : <div/>
              }
              <div className="fullwidth p-col-2">
                <label>განზომილების ერთეული</label>
                <Dropdown style={{width: '100%'}} value={this.state.inventor.income.detail.measureUnit}
                          options={this.state.inventor.measureUnitList}
                          onChange={(e) => this.setState(State("inventor.income.detail.measureUnit", {
                            id: e.value.id,
                            name: e.value.name
                          }, this.state))} placeholder="განზომილების ერთეული" optionLabel="name"/>
              </div>
              <div className={`fullwidth p-col-2`}>
                <label>საქონლის ჯგუფი</label>
                <div className="p-inputgroup">
                  <InputText placeholder="საქონლის ჯგუფი"
                             className={this.state.inventor.income.errors.itemGroup ? 'bRed' : ''}
                             value={this.state.inventor.income.detail.itemGroup.name} disabled />
                  <Button icon="pi pi-align-justify" className="p-button-info" style={{left: '-10px'}}
                          onClick={() => this.setState(State('inventor.itemGroup.dialog', true, this.state))}/>
                </div>
              </div>
              <div className="fullwidth p-col-2">
                <label>ინვენტარის ტიპი</label>
                <Dropdown value={this.state.inventor.income.detail.type}
                          className={this.state.inventor.income.errors.type ? 'bRed' : ''}
                          options={this.state.inventor.itemTypes}
                          onChange={(e) => this.setState(State("inventor.income.detail.type", {
                            id: e.value.id,
                            name: e.value.name
                          }, this.state))} placeholder="ინვენტარის ტიპი" optionLabel="name"/>
              </div>
              <div className="fullwidth p-col-2">
                <label>ინვენტარის სტატუსი</label>
                <Dropdown value={this.state.inventor.income.detail.status}
                          className={this.state.inventor.income.errors.status ? 'bRed' : ''}
                          options={this.state.inventor.itemStatus}
                          onChange={(e) => this.setState(State("inventor.income.detail.status", {
                            id: e.value.id,
                            name: e.value.name
                          }, this.state))} placeholder="ინვენტარის სტატუსი" optionLabel="name"/>
              </div>
              <div className="fullwidth p-col-12">
                <FileUploader
                  onSelectFile={(file) => this.setState(State('inventor.income.detail.file', file.files[0], this.state))}/>
              </div>
            </div>)
          }
        </Modal>
        <Modal
          header="ინვენტარის მიღება"
          visible={this.state.inventor.income.dialog}
          onHide={() => this.setState(State('inventor.income.dialog', false, this.state))}
          style={{width: '1200px'}}
          footer={
            <div>
              {
                this.state.inventor.income.showDetails ?
                  <React.Fragment>
                    {
                      (!_.isEmpty(this.state.inventor.income.addon.Right)) ?
                        <span style={{ position: 'absolute', left: '10px'}}>
                              ბოლო კოდი : {this.state.inventor.income.addon.Right}
                        </span>
                        :
                        <span/>

                    }
                    <Button label="ზედდებულის გააქტიურება" icon="pi pi-check"
                            onClick={() => this.onSaveInventor()}/>
                  </React.Fragment>
                  :
                  <Button label="ზედდებულის გენერაცია" icon="pi pi-check" onClick={() => this.generateInventor()}/>
              }
              <Button label="დახურვა" icon="pi pi-times"
                      onClick={() => this.setState(State('inventor.income.dialog', false, this.state))}
                      className="p-button-secondary"/>
            </div>
          }
        >
          {
            this.state.inventor.income.showDetails ?
              <div>
                <div style={{width:'100%', textAlign: 'center'}}>
                  საწყობის შემოსავლის ელ. ზედდებული № {this.state.inventor.income.addon.Left} - {this.state.inventor.income.addon.Right}
                </div>
                <div className="incomeAddedTable" style={{maxHeight: '300px', overflowY: 'scroll'}}>
                  <table>
                    <thead>
                    <tr>
                      <th>თარიღი</th>
                      <th>დასახელება</th>
                      <th>მარკა</th>
                      <th>მოდელი</th>
                      <th>რაოდენობა</th>
                      <th>ფასი</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      _.map(this.state.inventor.income.data, (value) => {
                        return (
                          <tr>
                            <td>{this.state.inventor.income.date.toDateString()}</td>
                            <td>{value.item.name}</td>
                            <td>{value.maker.name}</td>
                            <td>{value.model.name}</td>
                            <td>{value.count}</td>
                            <td>{value.price}</td>
                          </tr>
                        )
                      })
                    }
                    </tbody>
                  </table>
                </div>
              </div>
              :
              <React.Fragment>
                <div className="incomeModal p-grid">
                  <div className="fullwidth p-col-3">
                    <label>მიღების თარიღი</label>
                    <Calendar date={this.state.inventor.income.date}
                              onDateChange={props => this.setState(State('inventor.income.date', props, this.state))}/>
                  </div>
                  <div className="fullwidth p-col-3">
                    <label>მიმწოდებელი</label>
                    <AutoComplete
                      field="name"
                      class={this.state.inventor.income.errors.supplier ? 'bRed' : ''}
                      suggestions={this.state.inventor.supplierSuggestions}
                      onComplete={this.suggestSupplier}
                      onSelect={(e) => this.setState(State('inventor.income.supplier', e, this.state))}
                      onChange={(e) => this.setState(State('inventor.income.supplier.name', e, this.state))}
                      value={this.state.inventor.income.supplier}
                    />
                  </div>
                  <div className="fullwidth p-col-3">
                    <label>სასაქონლო ზედნადები</label>
                    <InputText type="text" value={this.state.inventor.income.invoice}  onChange={e=>this.setState(State('inventor.income.invoice', e.target.value, this.state))}/>
                  </div>
                  <div className="fullwidth p-col-3">
                    <label>ინსპექტირების დასკვნის ნომერი</label>
                    <InputText type="text" value={this.state.inventor.income.inspectionNumber}  onChange={e=>this.setState(State('inventor.income.inspectionNumber', e.target.value, this.state))}/>
                  </div>
                  <div className="fullwidth p-col-12">
                    <label>კომენტარი</label>
                    <InputTextarea rows={1} value={this.state.inventor.income.comment}
                                   onChange={e => this.setState(State('inventor.income.comment', e.target.value, this.state))}/>
                    <Button label="დამატება" icon="pi pi-plus" onClick={() => {
                      this.resetDetail();
                      this.setState(State('inventor.income.detail.dialog', true, this.state))
                    }}/>
                  </div>
                </div>
                <div className="incomeAddedTable" style={{maxHeight: '200px', overflowY: 'scroll'}}>
                  <table>
                    <thead>
                    <tr>
                      <th>დასახელება</th>
                      <th>მარკა</th>
                      <th>მოდელი</th>
                      <th>რაოდენობა</th>
                      <th>განზომილების ერთეული</th>
                      <th>საქონლის ჯგუფი</th>
                      <th>ქარხნული ნომერი</th>
                      <th>ინვენტარის ტიპი</th>
                      <th>ინვენტარის სტატუსი</th>
                      <th>ფასი</th>
                      <th>სულ ფასი</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      _.map(this.state.inventor.income.data, (value, index) => {
                        return (
                          <tr key={index}>
                            <td>{value.item.name}</td>
                            <td>{value.maker.name}</td>
                            <td>{value.model.name}</td>
                            <td>{value.count}</td>
                            <td>{value.measureUnit.name}</td>
                            <td>{value.itemGroup.name}</td>
                            <td>{value.factoryNumber}</td>
                            <td>{value.type.name}</td>
                            <td>{value.status.name}</td>
                            <td>{value.price}</td>
                            <td>{Math.round(parseInt(value.price) * parseInt(value.count))}</td>
                          </tr>
                        )
                      })
                    }
                    </tbody>
                  </table>
                </div>
              </React.Fragment>
          }
        </Modal>
        <Modal header="ინვენტარის გაცემა" visible={this.state.inventor.outcome.dialog}
               onHide={() => this.setState(State('inventor.outcome.dialog', false, this.state))}
               style={{width: '900px'}}>
          <TabView renderActiveOnly={false}>
            <TabPanel header="შენობა">
              <div className="incomeModal p-grid">
                <div className="fullwidth p-col-8">
                  <div className="p-grid">
                    <div className="fullwidth p-col-6">
                      <label>თარიღი</label>
                      <InputText type="text" placeholder="თარიღი"/>
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>ქონების მართვა</label>
                      <InputText type="text" placeholder="ქონების მართვა"/>
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>მომთხოვნი პიროვნება</label>
                      <InputText type="text" placeholder="მომთხოვნი პიროვნება"/>
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>ტრანსპორტირების პასხ. პირი</label>
                      <InputText type="text" placeholder="ტრანსპორტირების პასხ. პირი"/>
                    </div>
                  </div>
                </div>
                <div className="fullwidth p-col-4">
                  <label>კომენტარი</label>
                  <InputTextarea rows={4} placeholder="შენიშვნა" style={{width: '100%', minHeight: '100px'}}/>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="პიროვნება">
              <div className="incomeModal p-grid">
                <div className="fullwidth p-col-4">
                  <label>თარიღი</label>
                  <InputText type="text" placeholder="თარიღი"/>
                </div>
                <div className="fullwidth p-col-4">
                  <label>პიროვნება</label>
                  <InputText type="text" placeholder="პიროვნება"/>
                </div>
                <div className="fullwidth p-col-4">
                  <label>ქონების მართვა</label>
                  <InputText type="text" placeholder="ქონების მართვა"/>
                </div>
                <div className="fullwidth p-col-4">
                  <label>სექცია</label>
                  <Dropdown optionLabel="name" placeholder="სექცია" style={{width: '100%'}}/>
                </div>
                <div className="fullwidth p-col-4">
                  <label>ტრანსპორტირების პასხ. პირი</label>
                  <InputText type="text" placeholder="ტრანსპორტირების პასხ. პირი"/>
                </div>
                <div className="fullwidth p-col-4">
                  <label>მომთხოვნი პიროვნება</label>
                  <InputText type="text" placeholder="მომთხოვნი პიროვნება"/>
                </div>
                <div className="fullwidth p-col-12">
                  <label>კომენტარი</label>
                  <InputTextarea rows={1} placeholder="შენიშვნა" style={{width: '100%'}}/>
                </div>
              </div>
            </TabPanel>
          </TabView>
          <Cart data={this.state.cart['tab' + this.state.tab]}/>
        </Modal>
        <Modal header="ინვენტარის მოძრაობა სექციებს შორის" visible={this.state.inventor.transfer.dialog}
               onHide={() => this.setState(State('inventor.transfer.dialog', false, this.state))}
               style={{width: '1200px'}}>
          <div className="incomeModal p-grid">
            <div className="fullwidth p-col-8">
              <div className="p-grid">
                <div className="fullwidth p-col-6">
                  <label>თარიღი</label>
                  <InputText type="text" placeholder="თარიღი"/>
                </div>
                <div className="fullwidth p-col-6">
                  <label>სექცია</label>
                  <Dropdown optionLabel="name" placeholder="სექცია" style={{width: '100%'}}/>
                </div>
                <div className="fullwidth p-col-6">
                  <label>ქონების მართვა</label>
                  <Dropdown optionLabel="name" placeholder="სექცია" style={{width: '100%'}}/>
                </div>
                <div className="fullwidth p-col-6">
                  <label>ტრანსპორტირების პასხ. პირი</label>
                  <InputText type="text" placeholder="ტრანსპორტირების პასხ. პირი"/>
                </div>
              </div>
            </div>
            <div className="fullwidth p-col-4">
              <label>კომენტარი</label>
              <InputTextarea rows={4} placeholder="შენიშვნა" style={{width: '100%', minHeight: '100px'}}/>
            </div>
          </div>
          <hr/>
          <Cart data={this.state.cart['tab' + this.state.tab]}/>
        </Modal>
        <Modal header="კალათა" visible={this.state.cart.dialog}
               onHide={() => this.setState(State('cart.dialog', false, this.state))} style={{width: '800px'}}>
          <Cart data={this.state.cart['tab' + this.state.tab]}/>
        </Modal>
        <Modal className="itemGroup" header="საქონლის ჯგუფი" visible={this.state.inventor.itemGroup.dialog}
               onHide={() => this.setState(State('inventor.itemGroup.dialog', false, this.state))}
               style={{width: '800px', maxHeight: '500px'}}>
          {
            (this.state.inventor.itemGroup.dialog) ?
              <TreeTableGroup column={[{field: 'name', title: 'Name'}]} data={this.state.inventor.itemGroup.data}
                              onSelectItemGroup={(e) => this.setState(State("inventor.income.detail.itemGroup", e, this.state), () => this.setState(State("inventor.itemGroup.dialog", false, this.state), () => console.log(this.state.inventor.income)))}/> : ''
          }
        </Modal>
      </React.Fragment>
    );
  }

  tabClick(tabID) {
    this.setState(State('tab',tabID,this.state));
    this.onReady(this.eventData);
  }

  suggestSupplier = (event) => {
    this.setState(State('inventor.supplierSuggestions', [], this.state));
    http.get("/api/secured/Supplier/Filter?query=" + event).then(result => {
      if (result.status === 200) {
        this.setState(State('inventor.supplierSuggestions', result.data, this.state));
      }
    })
  };
  suggestItem = (event) => {
    this.setState(State('inventor.itemSuggestions', [], this.state));
    http.get("/api/secured/Item/Filter/ByName?str=" + event).then(result => {
      if (result.status === 200) {
        this.setState(State('inventor.itemSuggestions', result.data, this.state));
      }
    })
  };
  suggestMaker = (event) => {
    this.setState(State('inventor.makerSuggestions', [], this.state));
    http.get("/api/secured/List/Maker/Filter?query=" + event).then(result => {
      if (result.status === 200) {
        this.setState(State('inventor.makerSuggestions', result.data, this.state));
      }
    })
  };
  suggestModel = (event) => {
    this.setState(State('inventor.modelSuggestions', [], this.state));
    http.get("/api/secured/List/Model/Filter?query="+event+"&parent=" + this.state.inventor.income.detail.maker.id ).then(result => {
      if (result.status === 200) {
        this.setState(State('inventor.modelSuggestions', result.data, this.state));
      }
    })
  };
  itemTemplate=(event)=>{
    const {generatedName}=event;
    return (
      <div className="p-clearfix">
        <div style={{ fontSize: '16px', float: 'right', margin: '10px 10px 0 0' }}>{generatedName}</div>
      </div>
    );
  }
  getStockData = () => {
    http.get("/api/secured/stock/Select")
      .then(result => {
        if(result.status === 200){
          this.setState(State('inventor.stock', result.data, this.state));
        }
      })
      .catch()
  };
  onClickedCell = (params) => {
    if(params.colDef.field==="cartId"){
        if(!params.data.inCart){
          putInCart({"globalKey":this.state.tab, "key": params.data.id,"value":JSON.stringify(params.data)})
            .then(result => {
              params.data.inCart=true;
              this.gridApi.refreshCells({ force: true });
              this.getCartItems()
            })
            .then()

        }else {
          removeCartItem({"globalKey":this.state.tab, "key": params.data.id,"value":JSON.stringify(params.data)})
            .then(result => {
              params.data.inCart=false;
              this.gridApi.refreshCells({ force: true });
              this.getCartItems()

            })
            .then()

        }
    }
  };
  loadConstructor = async () => {
    await this.getCartItems();
    this.getStockData();
  };
  getCartItems= async ()=>{
    await getCartItems({'globalKey':this.state.tab})
      .then(result => {
        (_.isUndefined(result)) ? this.setState(State('cart.tab' + this.state.tab, [], this.state)) : this.setState(State('cart.tab' + this.state.tab, result, this.state));
      })
      .catch()
  }
  onInventorDetailExpand = async () => {
    this.setState(State('inventor.income.errors', {
      item: false,
      maker: false,
      measureUnit: false,
      type: false,
      status: false,
      count: false,
      price: false,
      barCodeType: false,
    }, this.state));
    const validate = await Validator(['itemGroup','item', 'maker', 'type', 'status', 'count'], this.state.inventor.income.detail);
    if(_.size(validate)>0){
      _.forEach(validate, val => {
        this.setState(State('inventor.income.errors.' + val, true, this.state));
      });
      return;
    }
    this.getFreeCodes();
    this.getAddon('type=Stock/Income&subType=last');
  };
  getAddon = (params) => {
      http.get("/api/secured/Item/Addon?"+params)
        .then(result => {
          this.setState(State('inventor.income.addon', result.data, this.state),()=>console.log(this.state));
        })
        .catch()
  };
  getFreeCodes = () => {
    this.setState(State('inventor.income.detail.expand', true, this.state));
    let formData = new FormData();
    if(!_.isNull(this.state.inventor.income.detail.file)){
      formData.append('file', this.state.inventor.income.detail.file);
    }
    http.post("/api/secured/List/BarCode/Get/FreeCodes?barCodeType=" + this.state.inventor.income.detail.barCodeType.id + "&count=" + this.state.inventor.income.detail.count,formData)
      .then(result => {
        this.setState(State("inventor.income.detail.list", _.map(result.data, value => {
          return {
            "barCodeName": value.value,
            "barCode": value.barCodeVisualValue,
            "serialNumber": this.state.inventor.income.detail.factoryNumber,
            "amount": 1
          }
        }), this.state));


      })
      .catch()
  };
  lastbarCode=(type)=> {
    console.log(type)
    type['id'] = _.isUndefined(type.id)? '': type.id;
    http.get("/api/secured/List/BarCode/Get/LastCode?barCodeType="+type.id)
      .then(result => {
        this.setState(State('inventor.income.detail.lastbarCode', result.data, this.state));
      })
      .catch()
  }
  onSaveDetail=()=>{
    let data= this.state.inventor.income.data;
    this.setState(State('inventor.itemSuggestions', [], this.state));
    this.setState(State('inventor.makerSuggestions', [], this.state));
    this.setState(State('inventor.modelSuggestions', [], this.state));
    let formData= new FormData();
    formData.append('data', JSON.stringify({
      name: this.state.inventor.income.detail.item.name,
      list: this.state.inventor.income.detail.list,
      selectedMaker: this.state.inventor.income.detail.maker,
      selectedModel: this.state.inventor.income.detail.model,
      amount: this.state.inventor.income.detail.count,
      price: this.state.inventor.income.detail.price,
      barCodeType: this.state.inventor.income.detail.barCodeType.id,
      barCode: this.state.inventor.income.detail.barCode,
      factoryNumber: this.state.inventor.income.detail.factoryNumber,
      measureUnit: this.state.inventor.income.detail.measureUnit.id,
      itemGroup: this.state.inventor.income.detail.itemGroup.id,
      selectedItemType: this.state.inventor.income.detail.type,
      status: this.state.inventor.income.detail.status.id
    }));
    http.post('/api/secured/Item/PreInsert/Add',formData).then(result => {
      if(result.status===200){
        data.push(this.state.inventor.income.detail);

        this.setState(State("inventor.income.data", data, this.state),
          () =>{
            this.setState(State('inventor.income.detail.dialog', false, this.state),
              () => this.resetDetail())
          });
      }
    })


  }
  parseInventorDetailData=(data)=>{
    this.setState(State('inventor.income.detail.maker', data.maker , this.state));
    this.setState(State('inventor.income.detail.barCodeType', {id:data['barCodeType']['id'], name:data['barCodeType']['name']} , this.state));
    this.setState(State('inventor.income.detail.measureUnit', { id:data.measureUnit['id'] ,name:data.measureUnit['name']} , this.state));
    this.setState(State('inventor.income.detail.itemGroup', data.itemGroup, this.state));
    this.setState(State('inventor.income.detail.type', data.itemType, this.state));
    this.setState(State('inventor.income.detail.status', data.itemStatus, this.state));
    this.setState(State('inventor.income.detail.price', data.price, this.state));
    this.setState(State('inventor.income.detail.count', data.inStock, this.state));
    this.setState(State('inventor.income.detail.factoryNumber', data.factoryNumber, this.state));
    console.log(this.state)
    this.lastbarCode(this.state.inventor.income.detail.barCodeType);

  }
  resetInventor=()=>{
    this.setState(State('inventor',
      {
        income: {
          dialog: false,
          showDetails: false,
          date: new Date(),
          supplier: {id:'',name:''},
          comment:"",
          addon: {Left: '', Right: ''},
          invoice: '',
          inspectionNumber:'',
          detail: {
            file: null,
            expand:false,
            dialog: false,
            itemGroup: {name: '', id: null, isStrict:0, spend:0, isCar:0},
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
            factoryNumber:'',
            files:[],
            lastbarCode: {value: '', name: '', length: '', id: '', barCodeVisualValue: "", startPoint: "", endPoint: ""},
            list: [],
            car: {
              number:"",
              year:""
            },
            numbers:{
              from:"",
              to: ""
            }
          },
          errors: {
            supplier:false,
            item: false,
            maker: false,
            measureUnit:false,
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
        outcome: {
          dialog: false
        },
        transfer: {
          date: new Date(),
          dialog: false
        },
        search: {
          dialog: false
        },
        supplierSuggestions: [],
        barCodes: [],
        measureUnitList: [],
        itemGroup: {
          dialog: false,
          data: {}
        },
        itemTypes: [],
        itemStatus: [],
        stock: [],
        itemSuggestions: [],
        makerSuggestions: [],
        modelSuggestions: []
      }
      , this.state)
    );
    this.setState(State('inventor.income.errors',
      {
        supplier:false,
        item: false,
        maker: false,
        measureUnit:false,
        type: false,
        status: false,
        count: false,
        price: false,
        barCodeType: false,
        model: false,
        itemGroup: false

      }
      ,this.state)
    )
  }
  generateInventor = async () => {
    const validate = Validator(['supplier'], this.state.inventor.income);
    if (_.size(validate) > 0) {
      _.forEach(validate, val => {
        this.setState(State('inventor.income.errors.' + val, true, this.state), () => console.log(this.state.inventor.income.errors));
      });
      return;
    }
    if (_.size(this.state.inventor.income.data) > 0) {
      this.setState(State('inventor.income.showDetails', true, this.state));
    }
  };
  resetDetail=()=> {
    this.setState(State('inventor.income.detail',{
      file: null,
      expand:false,
      dialog: false,
      itemGroup: {name: '', id: null, isStrict:0, spend:0, isCar:0},
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
      factoryNumber:'',
      files:[],
      lastbarCode: {value: '', name: '', length: '', id: '', barCodeVisualValue: "", startPoint: "", endPoint: ""},
      list: [],
      car: {
        number:"",
        year:""
      },
      numbers:{
        from:"",
        to: ""
      }
    }, this.state))
  }

  onSaveInventor=()=> {

    let formData =  new FormData();
    formData.append('entryDate',moment(this.state.inventor.income.date).format('DD-MM-YYYY'));
    formData.append('supplier',(this.state.inventor.income.supplier.id !=='')?  this.state.inventor.income.supplier.id: this.state.inventor.income.supplier.name);
    formData.append('comment', this.state.inventor.income.comment);
    formData.append('inspectionNumber', this.state.inventor.income.inspectionNumber);
    formData.append('invoice', this.state.inventor.income.invoice);
    formData.append('invoiceAddon', this.state.inventor.income.addon.Right);
    formData.append('data', JSON.stringify(_.map(this.state.inventor.income.data, value => {
      return {
        name: value.item.name,
        list: value.list,
        selectedMaker: value.maker,
        selectedModel: value.model,
        amount: value.count,
        price: value.price,
        barCodeType: value.barCodeType.id,
        barCode: value.barCode,
        factoryNumber: value.factoryNumber,
        measureUnit: value.measureUnit.id,
        itemGroup: value.itemGroup.id,
        selectedItemType: value.type,
        status: value.status.id
      }
    })));

    http.post('/api/secured/Item/Insert',formData)
      .then(result => {
        if(result.status ===200) {
          alert("შეინახა წარმატებით");
          this.setState(State('inventor.income.dialog', false, this.state))
        }else{
          alert('დაფიქსირდა შეცდომა')
        }
      })
      .catch(reason => {
        alert('დაფიქსირდა შეცდომა: '+reason.text)
      })
  }
}

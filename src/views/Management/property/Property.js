import React, { Component } from 'react';
import http from  '../../../api/http';
import {Config} from "../../../config/Config";
import {CardCellRenderer, Modal, Calendar, AutoComplete, FileUploader, Cart, Search, Overhead} from '../../components'
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
import 'primeflex/primeflex.css';
import './property.css';
import {State,putInCart,clearCartItem,removeCartItem,getCartItems} from '../../../utils';
import * as moment from "moment";
export default class Property extends Component {
  constructor(props){
    super(props);
    this.state = {
      grid:{
        components: {
          loadingCellRenderer: function(params) {
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
            filterParams: { defaultOption: 'startsWith' }
          },
          {
            headerName: 'მოდელი',
            field: 'model.name',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: { defaultOption: 'startsWith' }
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
            filterParams: { defaultOption: 'startsWith' }
          },
          {
            headerName: 'შტრიხკოდი',
            field: 'barcode',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: { defaultOption: 'startsWith' }
          },
          {
            headerName: 'ქარხ.#',
            field: 'factoryNumber',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: { defaultOption: 'startsWith' }
          },
          {
            headerName: 'ჯგუფი',
            field: 'itemGroup.name',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: { defaultOption: 'startsWith' }
          },
          {
            headerName: 'ტიპი',
            field: 'itemType.name',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: { defaultOption: 'startsWith' }
          },
          {
            headerName: 'სტატუსი',
            field: 'itemStatus.name',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: { defaultOption: 'startsWith' }
          },
          {
            headerName: 'მიმწოდებელი',
            field: 'supplier.name',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: { defaultOption: 'startsWith' }
          },
          {
            headerName: 'ზედნადები',
            field: 'invoice',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: { defaultOption: 'startsWith' }
          },
          {
            headerName: 'ზედდებული',
            field: 'invoiceAddon',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: { defaultOption: 'startsWith' }
          },
          {
            headerName: 'ინსპ',
            field: 'inspectionNumber',
            width: 150,
            suppressMenu: true,
            filter: 'agTextColumnFilter',
            filterParams: { defaultOption: 'startsWith' }
          }
        ],
        defaultColDef: {
          sortable: true,
          resizable: true
        },
        rowClassRules: {
          'ag-red': function(params) {
            try {
              return params['data']['tmpAmount'] > 0;
            } catch (e) {}
          },
          'ag-gray': function(params) {
            try {
              return params['data']['tmpAmount'] === 0 && (params['data']['initialAmount'] !== params['data']['amount']);
            } catch (e) {}
          }
        },
        rowSelection: 'single',
        rowModelType:'serverSide',
        paginationPageSize:100,
        cacheOverflowSize:2,
        maxConcurrentDatasourceRequests: 2,
        infiniteInitialRowCount: 1,
        maxBlocksInCache: 2,

        gridOptions: {
          context: {
            thisComponent : this,
          },
          rowSelection: 'single',
          getSelectedRows: 'getSelectedRows',
        }
      },
      property:{
        // განპიროვნება
        disposition: {
          expand: false,
          dialog: false,
          date: new Date(),
          person: "",
          room: "",
          comment: "",
          buttonGen: false,
          files:[],
        },
        // ინვენტარის საწყობში დაბრუნება
        outcome: {
          expand: false,
          dialog: false,
          date: new Date(),
          section: "",
          transPerson: "",
          stockMan: "",
          comment: "",
          files:[],
        },
        // ინვენტარის მოძრაობა შენობებს შორის
        movAB: {
          expand: false,
          dialog: false,
          date: new Date(),
          comment: "",
          transPerson: "",
          propertyManagement: "",
          requestMan: "",
          files:[],
        },
        // ინვენტარის საწყობში დაბრუნება
        inverse: {
          dialog: false,
          date: new Date(),
          section: "",
          transPerson: "",
          stockMan: "",
          comment: "",
        },
        // პიროვნებების მასივი
        personality:[],
        roomList:[],
        sectionList:[
          {id:'11', name:'საწყობი A'},
          {id:'12', name:'საწყობი B'}
        ],
        stockManList: [],
        propertyManagementList: [],
        transPersonList: [],
        lastCode: "",
        newCode: "",
      },
      tab: 11,
      cart:{
        tab11:[],
        tab12:[],
        dialog:false
      }
    }

  }
  componentDidMount() {
  }
  onReady = (params) => {
    this.getCartItems().then(()=>{
      this.onGridReady(params)
    })
  };
  onGridReady(params, filter= false) {
    this.eventData = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const filterData = this.filter;
    const selectedTabId = this.selectedTabId;
    const cartItems = _.map(this.state.cart['tab'+this.state.tab],( (value,index)=>index));
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
        this.setState(State('inventor.barCodes', result.data, this.state));
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
  };
  render() {
    return (
      <React.Fragment >

        <div className="actionButton">
          <div className="buttonBox" style={{width: '150px'}}>
            <Button label="გასანაწილებელი" />
            <Button label="განაწილებული" />
          </div>
          <div className="buttonBox"></div>
          <div className="buttonBox">
            <div data-tab="1">
              <Button label="განპიროვნება" className="p-button-danger" onClick={()=>this.onDisposition()} />
              <Button label="ინვ. შებრუნება"  className="ui-button-raised" onClick={()=>this.onOutcome()} />
              <Button label="ინვ. მოძრაობა შენობებს შორის"  className="ui-button-raised" onClick={()=>this.onMoveAB()} />
            </div>
            <div data-tab="2">
              <Button label="ინვ. საწყობში დაბრუნება"  className="ui-button-raised" onClick={()=>this.setState(State('property.inverse.dialog',true,this.state))} />
            </div>

            <Button label="ძებნა" icon="pi pi-search"  onClick={()=>this.setState(State('inventor.search.dialog',true,this.state))}/>
            <i className="fa fa-cart-plus fa-lg " onClick={()=>this.setState(State('cart.dialog',true,this.state))} style={{fontSize: '32px', marginRight: '12', color: '#007ad9', cursor:'pointer'}}/><sup>{_.size(this.state.cart['tab'+this.state.tab])}</sup>
          </div>
        </div>

        <Search/>

        <div id="myGrid" className="ag-theme-balham" >
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
            rowClassRules={this.state.grid.rowClassRules}
            onCellClicked={this.onClickedCell}
          />
        </div>

        <Modal
          header="განპიროვნება"
          visible={this.state.property.disposition.dialog}
          onHide={()=>this.setState(State('property.disposition.dialog',false,this.state))} style={{width:'900px'}}
          footer = {
           <div className="dialog_footer">
             <div className="left_side">
               <Button label="კალათის გასუფთავება" className="p-button-danger" onClick={()=>this.removeCartItem()}/>
               <Button label="დოკუმენტები" className="ui-button-raised"/>
             </div>
             {
               (!this.state.property.disposition.expand)?
                 <Button label="ზედდებულის გენერაცია" className="ui-button-raised" onClick={()=>this.dispositionGenerateOverhead()} />
                 :
                 <React.Fragment>
                   <span className="last_code">ბოლო კოდი - {this.state.property.lastCode} </span>
                   <Button label="ზედდებულის გააქტიურება" className="ui-button-raised"  onClick={()=>this.dispositionActiveOverhead()}/>
                 </React.Fragment>
             }
             <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.resetModalParam('disposition')}/>
           </div>
          }>
          {
            (this.state.property.disposition.expand)?
              <div className="expand_mode">
                <Overhead title="ქონების მართვის გასავლის ელ. ზედდებული ქ.გ - " carts={this.state.cart} tab={this.state.tab}  newCode={this.state.property.newCode} onChange={e=>this.setState(State('property.newCode',e.target.value,this.state))}/>
              </div>
              :
              <div className="incomeModal p-grid">
                <div className="fullwidth p-col-8">
                  <div className="p-grid">
                    <div className="fullwidth p-col-6">
                      <label>თარიღი</label>
                      <Calendar date={this.state.property.disposition.date} onDateChange={props=>this.setState(State('property.disposition.date',props,this.state)) } />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>პიროვნება</label>
                      <AutoComplete
                        field="fullname"
                        suggestions={this.state.property.personality}
                        onComplete={this.dispositionPerson}
                        onSelect={(e)=>this.setState(State('property.disposition.person',e,this.state),()=>this.dispositionPersonRoom(this.state.property.disposition.person.id))}
                        onChange={(e) => this.setState(State('property.disposition.person',e,this.state))}
                        value={this.state.property.disposition.person}
                      />
                    </div>
                    <div className="fullwidth p-col-12">
                      <label>აირჩიეთ ოთახი</label>
                      <Dropdown value={this.state.property.disposition.room} options={this.state.property.roomList} onChange={(e) => this.setState(State( "property.disposition.room",{ id: e.value.id, name: e.value.name},this.state))} optionLabel="name" placeholder="აირჩიეთ ოთახი" style={{width:'100%'}} />
                    </div>
                  </div>
                </div>
                <div className="fullwidth p-col-4">
                  <label>კომენტარი</label>
                  <InputTextarea value={this.state.property.disposition.comment} onChange = {(e)=>this.setState(State('property.disposition.comment',e.target.value,this.state))} rows={4} placeholder="შენიშვნა" style={{width:'100%', minHeight:'100px'}} />
                </div>

                <Cart data={this.state.cart['tab'+this.state.tab]}/>

              </div>
          }
        </Modal>

        <Modal
          header="ინვენტარის საწყობში დაბრუნება" visible={this.state.property.outcome.dialog} onHide={()=>this.setState(State('property.outcome.dialog',false,this.state))} style={{width:'900px'}}
          footer = {
            <div className="dialog_footer">
              <div className="left_side">
                <Button label="კალათის გასუფთავება" className="p-button-danger" onClick={()=>this.removeCartItem()}/>
                <Button label="დოკუმენტები" className="ui-button-raised"/>
              </div>
              {
                (!this.state.property.outcome.expand)?
                  <Button label="ზედდებულის გენერაცია" className="ui-button-raised" onClick={()=>this.outcomeGenerateOverhead()} />
                  :
                  <React.Fragment>
                    <span className="last_code">ბოლო კოდი - {this.state.property.lastCode} </span>
                    <Button label="ზედდებულის გააქტიურება" className="ui-button-raised"  onClick={()=>this.outcomeActiveOverhead()}/>
                  </React.Fragment>
              }
              <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.resetModalParam('outcome')}/>
            </div>
          }>
          {
            (this.state.property.outcome.expand)?
              <div className="expand_mode">
                <Overhead title="ქონების მართვის გასავლის ელ. ზედდებული ქ.გ - " carts={this.state.cart} tab={this.state.tab}  newCode={this.state.property.newCode} onChange={e=>this.setState(State('property.newCode',e.target.value,this.state))}/>
              </div>
              :
              <div className="incomeModal p-grid">
                <div className="fullwidth p-col-8">
                  <div className="p-grid">
                    <div className="fullwidth p-col-6">
                      <label>თარიღი</label>
                      <Calendar date={this.state.property.outcome.date} onDateChange={props=>this.setState(State('property.outcome.date',props,this.state)) } />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>სექცია</label>
                      <Dropdown value={this.state.property.outcome.section} options={this.state.property.sectionList} onChange={(e) => this.setState(State( "property.outcome.section",{ id: e.value.id, name: e.value.name},this.state), this.warehouseManagement(e.value.id))} optionLabel="name" placeholder="სექცია" style={{width:'100%'}} />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>საწყობის მართვა</label>
                      <Dropdown value={this.state.property.outcome.stockMan} options={this.state.property.stockManList} onChange={(e) => this.setState(State( "property.outcome.stockMan",{ id: e.value.id, name: e.value.name},this.state))} optionLabel="name" placeholder="საწყობის მართვა" style={{width:'100%'}} />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>ტრანსპორტ. პასხ. პირი:</label>
                      <AutoComplete
                        field="name"
                        suggestions={this.state.property.transPersonList}
                        onComplete={(e) => this.transPersonList()}
                        onSelect={(e)=>this.setState(State('property.outcome.transPerson',e,this.state),()=>this.dispositionPersonRoom(this.state.property.outcome.transPerson.id))}
                        onChange={(e) => this.setState(State('property.outcome.transPerson',e,this.state))}
                        value={this.state.property.outcome.transPerson}
                      />
                    </div>
                  </div>
                </div>
                <div className="fullwidth p-col-4">
                  <label>კომენტარი</label>
                  <InputTextarea value={this.state.property.outcome.comment} onChange = {(e)=>this.setState(State('property.outcome.comment',e.target.value,this.state))} rows={4} placeholder="შენიშვნა" style={{width:'100%', minHeight:'100px'}} />
                </div>
                <Cart data={this.state.cart['tab'+this.state.tab]}/>
              </div>

          }
        </Modal>

        <Modal
          header="ინვენტარის მოძრაობა შენობებს შორის" visible={this.state.property.movAB.dialog} onHide={()=>this.setState(State('property.movAB.dialog',false,this.state))} style={{width:'900px'}}
          footer = {
            <div className="dialog_footer">
              <div className="left_side">
                <Button label="კალათის გასუფთავება" className="p-button-danger" onClick={()=>this.removeCartItem()}/>
                <Button label="დოკუმენტები" className="ui-button-raised"/>
              </div>
              {
                (!this.state.property.movAB.expand)?
                  <Button label="ზედდებულის გენერაცია" className="ui-button-raised" onClick={()=>this.outcomeGenerateOverhead()} />
                  :
                  <React.Fragment>
                    <span className="last_code">ბოლო კოდი - {this.state.property.lastCode} </span>
                    <Button label="ზედდებულის გააქტიურება" className="ui-button-raised"  onClick={()=>this.outcomeActiveOverhead()}/>
                  </React.Fragment>
              }
              <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.setState(State('property.movAB.dialog',false,this.state))}/>
            </div>
          }>
          {
            (this.state.property.movAB.expand)?
              <div className="expand_mode">
                <Overhead title="ქონების მართვის გასავლის ელ. ზედდებული ქ.გ - " carts={this.state.cart} tab={this.state.tab}  newCode={this.state.property.newCode} onChange={e=>this.setState(State('property.newCode',e.target.value,this.state))}/>
              </div>
              :
              <div className="incomeModal p-grid">
                <div className="fullwidth p-col-8">
                  <div className="p-grid">
                    <div className="fullwidth p-col-6">
                      <label>თარიღი</label>
                      <Calendar date={this.state.property.movAB.date} onDateChange={props=>this.setState(State('property.movAB.date',props,this.state)) } />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>ქონების მართვა</label>
                      <Dropdown value={this.state.property.movAB.propertyManagement}  onMouseDown={(e)=>this.propertyManagement()} options={this.state.property.propertyManagementList} onChange={(e) => this.setState(State("property.movAB.propertyManagement",{ id: e.value.id, name: e.value.name},this.state))} optionLabel="name" placeholder="" style={{width:'100%'}} />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>მომთხოვნი პიროვნება</label>
                      <InputText value={this.state.property.movAB.requestMan} onChange = {(e)=>this.setState(State('property.movAB.requestMan',e.target.value,this.state))} type="text" placeholder="ტრანსპორტ. პასხ. პირი" />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>ტრანსპორტ. პასხ. პირი:</label>
                      <InputText value={this.state.property.movAB.transPerson} onChange = {(e)=>this.setState(State('property.movAB.transPerson',e.target.value,this.state))} type="text" placeholder="ტრანსპორტ. პასხ. პირი" />
                    </div>
                  </div>
                </div>
                <div className="fullwidth p-col-4">
                  <label>კომენტარი</label>
                  <InputTextarea value={this.state.property.movAB.comment} onChange = {(e)=>this.setState(State('property.movAB.comment',e.target.value,this.state))} rows={4} placeholder="შენიშვნა" style={{width:'100%', minHeight:'100px'}} />
                </div>
                <Cart data={this.state.cart['tab'+this.state.tab]}/>
              </div>
          }
        </Modal>

        <Modal
          header="ინვენტარის საწყობში დაბრუნება" visible={this.state.property.inverse.dialog} onHide={()=>this.onInverse()} style={{width:'900px'}}
          footer = {
            <div className="dialog_footer">
              <div className="left_side">
                <Button label="კალათის გასუფთავება" className="p-button-danger" onClick={()=>this.removeCartItem()}/>
                <Button label="დოკუმენტები" className="ui-button-raised"/>
              </div>
              {
                (!this.state.property.inverse.expand)?
                  <Button label="ზედდებულის გენერაცია" className="ui-button-raised" onClick={()=>this.outcomeGenerateOverhead()} />
                  :
                  <React.Fragment>
                    <span className="last_code">ბოლო კოდი - {this.state.property.lastCode} </span>
                    <Button label="ზედდებულის გააქტიურება" className="ui-button-raised"  onClick={()=>this.outcomeActiveOverhead()}/>
                  </React.Fragment>
              }
              <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.setState(State('property.inverse.dialog',false,this.state))}/>
            </div>
          }>
          {
            (this.state.property.inverse.expand)?
              <div className="expand_mode">
                <Overhead title="ქონების მართვის გასავლის ელ. ზედდებული ქ.გ - " carts={this.state.cart} tab={this.state.tab}  newCode={this.state.property.newCode} onChange={e=>this.setState(State('property.newCode',e.target.value,this.state))}/>
              </div>
              :
              <div className="incomeModal p-grid">
                <div className="fullwidth p-col-8">
                  <div className="p-grid">
                    <div className="fullwidth p-col-6">
                      <label>თარიღი</label>
                      <Calendar date={this.state.property.inverse.date} onDateChange={props=>this.setState(State('property.inverse.date',props,this.state)) } />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>სექცია</label>
                      <Dropdown value={this.state.property.inverse.section} options={this.state.property.sectionList} onChange={(e) => this.setState(State( "property.inverse.section",{ id: e.value.id, name: e.value.name},this.state), this.inverseWarehouseManagement(e.value.id))} optionLabel="name" placeholder="სექცია" style={{width:'100%'}} />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>საწყობის მართვა</label>
                      <Dropdown value={this.state.property.inverse.stockMan} options={this.state.property.stockManList} onChange={(e) => this.setState(State( "property.inverse.stockMan",{ id: e.value.id, name: e.value.name},this.state))} optionLabel="name" placeholder="საწყობის მართვა" style={{width:'100%'}} />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>ტრანსპორტ. პასხ. პირი:</label>
                      <InputText value={this.state.property.inverse.transPerson} onChange = {(e)=>this.setState(State('property.inverse.transPerson',e.target.value,this.state))} type="text" placeholder="ტრანსპორტ. პასხ. პირი" />
                    </div>
                  </div>
                </div>
                <div className="fullwidth p-col-4">
                  <label>კომენტარი</label>
                  <InputTextarea value={this.state.property.inverse.comment} onChange={(e)=>this.setState(State('property.inverse.comment',e.target.value,this.state))} rows={4} placeholder="შენიშვნა" style={{width:'100%', minHeight:'100px'}} />
                </div>
                <Cart data={this.state.cart['tab'+this.state.tab]}/>
              </div>
          }
        </Modal>

        <Modal header="კალათა" visible={this.state.cart.dialog} onHide={()=>this.setState(State('cart.dialog',false,this.state))} style={{width:'800px'}} >
          <Cart data={this.state.cart['tab'+this.state.tab]}/>
        </Modal>

      </React.Fragment>
    );
  }


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

  getCartItems= async ()=>{
    await getCartItems({'globalKey':this.state.tab})
      .then(result => {
        (_.isUndefined(result)) ? this.setState(State('cart.tab' + this.state.tab, [], this.state)) : this.setState(State('cart.tab' + this.state.tab, result, this.state));
      })
      .catch()
  };

  suggestSupplier = (event) => {
    this.setState(State('inventor.supplierSuggestions', [], this.state));
    http.get("/api/secured/Supplier/Filter?query=" + event).then(result => {
      if (result.status === 200) {
        this.setState(State('inventor.supplierSuggestions', result.data, this.state), () => console.log(this.state.inventor));
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
  };

  resetModalParam(modal){
    this.setState(State('property.personality',[],this.state));
    this.setState(State('property.roomList',[],this.state));

    this.setState(State('property.'+modal+'.person','',this.state));
    this.setState(State('property.'+modal+'.date',new Date(),this.state));
    this.setState(State('property.'+modal+'.dialog',false,this.state));
    this.setState(State('property.'+modal+'.expand',false,this.state));
    this.setState(State('property.'+modal+'.comment','',this.state));

    if(modal === 'outcome'){
      this.setState(State('property.'+modal+'.transPerson','',this.state));
      this.setState(State('property.'+modal+'.stockMan','',this.state));
      this.setState(State('property.'+modal+'.section','',this.state));
    }
  }

  removeCartItem(modal) {
    let formData = new FormData();
    formData.append('globalKey', this.state.tab);

    http.post("/api/secured/internal/session/clear",formData).then(result => {
      if (result.status === 200) {
        this.setState(State('cart.tab11',[],this.state));
      }
    });
  }

  transPersonList(){
    http.get("/api/secured/Staff/Filter/ByName/V2?name="+this.state.property.outcome.transPerson).then(result => {
      if (result.status === 200) {
        this.setState(State('property.transPersonList',_.map(result.data,(value)=>{
          return {id:value.id, name:value.fullname}
        }), this.state));
      }
    });
  }

  // <editor-fold defaultstate="collapsed" desc="განპიროვნება მოდალი">
  dispositionActiveOverhead() {
    let formData = new FormData();

    formData.append('note', this.state.property.disposition.comment);
    formData.append('addon', this.state.property.newCode);
    formData.append('trDate',moment(this.state.property.disposition.date).format('DD-MM-YYYY'));
    formData.append('roomId', this.state.property.disposition.room.id);
    formData.append('receiverPerson', this.state.property.disposition.person.id);
    formData.append('files', this.state.property.disposition.files);

    formData.append('list', JSON.stringify(_.map(this.state.cart["tab"+this.state.tab], value => {
      let val =  JSON.parse(value);
      return {
        itemId: val.id,
        amount: val.amount,
        list:""
      }
    })));

    http.post("/api/secured/Item/Person/Transfer",formData).then(result => {
      if (result.status === 200) {
        this.removeCartItem();
        this.resetModalParam('disposition');
        this.onReady(this.eventData);
      }
    });
  }

  dispositionGenerateOverhead() {
    this.setState(State('property.disposition.expand',true,this.state));
    http.get("/api/secured/Item/Addon?type=Person/Transfer&subType=new").then(result => {
      if (result.status === 200) {
        this.setState(State('property.newCode',result.data.Right,this.state));
      }
    });
  };

  onDisposition() {
    this.setState(State('property.disposition.dialog',true,this.state));
    this.setState(State('property.disposition.expand',false,this.state));

    http.get("/api/secured/Item/Addon?type=Person/Transfer&subType=last").then(result => {
      if (result.status === 200) {
        this.setState(State('property.lastCode',result.data.Right,this.state));
      }
    });
  };

  dispositionPersonRoom = (id) => {
    http.get("/api/secured/Item/Building/Rooms?receiverPerson=" + id).then(result => {
      if (result.status === 200) {
        this.setState(State('property.roomList',_.map(result.data,(value)=>{
          return {id:value.id,name:value.name}
        }), this.state));
      }
    });
  };

  dispositionPerson=(event)=>{
    this.setState(State('property.personality', [], this.state));
    http.get("/api/secured/Staff/Filter/ByName/V2?name=" + event).then(result => {
      if (result.status === 200) {
        this.setState(State('property.personality', result.data, this.state));
      }
    })
  };
  // </editor-fold>

  // <editor-fold defaultstate="collapsed" desc="ინვენტარის საწყობში დაბრუნება მოდალი">
  outcomeActiveOverhead() {
    let formData = new FormData();

    formData.append('note', this.state.property.outcome.comment);
    formData.append('addon', this.state.property.newCode);
    formData.append('trDate',moment(this.state.property.outcome.date).format('DD-MM-YYYY'));

    formData.append('carrierPerson', this.state.property.outcome.transPerson.id);
    formData.append('toWhomStock', this.state.property.outcome.stockMan.id);
    formData.append('toStock', this.state.property.outcome.section.id);

    formData.append('files', this.state.property.outcome.files);
    formData.append('list', JSON.stringify(_.map(this.state.cart["tab"+this.state.tab], value => {
      let val =  JSON.parse(value);
      return {
        itemId: val.id,
        amount: val.amount,
        list:""
      }
    })));

    http.post("/api/secured/Item/Stock/Return",formData).then(result => {
      if (result.status === 200) {
        this.removeCartItem();
        this.resetModalParam('outcome');
        this.onReady(this.eventData);
      }
    });
  }

  outcomeGenerateOverhead() {
    this.setState(State('property.outcome.expand',true,this.state));
    http.get("/api/secured/Item/Addon?type=Person/Transfer&subType=new").then(result => {
      if (result.status === 200) {
        this.setState(State('property.newCode',result.data.Right,this.state));
      }
    });
  };

  onOutcome = (event) => {
    this.setState(State('property.outcome.dialog',true,this.state));
    this.setState(State('property.outcome.expand',false,this.state));

    http.get("/api/secured/Item/Addon?type=Person/Transfer&subType=last").then(result => {
      if (result.status === 200) {
        this.setState(State('property.lastCode',result.data.Right,this.state));
      }
    });
  };

  warehouseManagement = (id) => {
    http.get("/api/secured/Staff/Filter/ByStock?stockId=" + id).then(result => {
      if (result.status === 200) {
        this.setState(State('property.stockManList',_.map(result.data,(value)=> {
          return {id:value.id, name:value.fullname}
        }), this.state));
      }
    });
  };
  // </editor-fold>

  // <editor-fold defaultstate="collapsed" desc="ინვენტარის მოძრაობა შენობებს შორის მოდალი">
  onMoveAB = (event) => {
    this.setState(State('property.movAB.dialog',true,this.state));
    http.get("/api/secured/Staff/Filter/ByName/V2?name=" + event).then(result => {
      if (result.status === 200) {
        this.setState(State('property.personality', result.data, this.state));
      }
    })
  };

  propertyManagement = () => {
    http.get("/api/secured/Staff/Filter/ByProperty?name=").then(result => {
      if (result.status === 200) {
        this.setState(State('property.propertyManagementList', _.map(result.data,(value) =>{
          return {id:value.id, name:value.fullname}
        }), this.state));
      }
    })
  };
  // </editor-fold>

  // <editor-fold defaultstate="collapsed" desc="ინვენტარის საწყობში დაბრუნება მოდალი">
  onInverse = (event) => {
    this.setState(State('property.inverse.dialog',false,this.state));
    http.get("/api/secured/Staff/Filter/ByName/V2?name=" + event).then(result => {
      if (result.status === 200) {
        this.setState(State('property.personality', result.data, this.state));
      }
    })
  };
  inverseWarehouseManagement = (id) => {
    http.get("/api/secured/Staff/Filter/ByStock?stockId=" + id).then(result => {
      if (result.status === 200) {
        this.setState(State('property.stockManList',_.map(result.data,(value)=> {
          return {id:value.id, name:value.fullname}
        }), this.state));
      }
    });
  };
  // </editor-fold>
}

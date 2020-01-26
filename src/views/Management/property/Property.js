import React, { Component } from 'react';
import http, {PREFIX} from '../../../api/http';
import {Config} from "../../../config/Config";
import {CardCellRenderer, Modal, Calendar, AutoComplete, FileUploader, Cart, Search, Overhead, ErrorModal, PrintModal} from '../../components'
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
import {State, putInCart, clearCartItem, removeCartItem, getCartItems, PrintElem} from '../../../utils';
import * as moment from "moment";
import CustomDateComponent from "../../components/CustomDateComponent/CustomDateComponent";
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
        columnDefs: {
          21:[
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
              field: 'fullBarcode',
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
          22:[
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
              headerName: 'თანამშრომელი',
              field: 'staff.fullname',
              sortable: false,
              suppressMenu: false,
              filter: 'agTextColumnFilter',
              filterParams: {
                filterOptions: ['equals'],
                suppressAndOrCondition: true
              }
            },
            {
              headerName: 'ქალაქი',
              field: 'section.city.name',
              sortable: false,
              suppressMenu: false,
              filter: 'agTextColumnFilter',
              filterParams: {
                filterOptions: ['equals'],
                suppressAndOrCondition: true
              }
            },
            {
              headerName: 'შენობა',
              field: 'section.building.name',
              sortable: false,
              suppressMenu: false,
            },
            {
              headerName: 'დეპარტამენტი',
              field: 'section.department.name',
              sortable: false,
              suppressMenu: false
            },
            {
              headerName: 'სამმართველო',
              field: 'section.division.name',
              sortable: false,
              suppressMenu: false
            },
            {
              headerName: 'სექცია',
              field: 'section.section.name',
              sortable: false,
              suppressMenu: false
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
              field: 'fullBarcode',
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
          ]

        },

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
        frameworkComponents: { agDateInput: CustomDateComponent },

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
          requestPerson: "",
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
          files:[],
        },
        search: {
          show: false,
          data: {
            name:"",
            maker:"",
            model:"",
            price:"",
            amount:"",
            measureUnit:"",
            barcode:"",
            factoryNumber:"",
            itemGroup:"",
            itemType:"",
            itemStatus:"",
            supplier:"",
            invoice:"",
            invoiceAddon:"",
            inspectionNumber:"",
            dateFrom:'',
            dateTo:''
          }
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
        // მომთხოვნი პიროვნება
        requestPersonList: [],
        lastCode: "",
        newCode: "",
      },
      tab: 21,
      cart:{
        tab21:[],
        tab22:[],
        dialog:false
      },
      errorDialog: {
        modal: false,
        text: ''
      },
      print: {
        dialog:false,
        modal:false,
        text:'',
        title:'',
        // cart data before clearCarts
        cart: {
          tab21:[],
          tab22:[],
        },
        // print data key->value
        data: {},
        //overhead info -> title,lastCode
        overhead: {
          title:'',
          lastCode:''
        }
      }
    };
    this.loadInventorData();
  }



  removeItemFromCart=(tab,key)=>{
    removeCartItem({"globalKey":tab, "key": key,"value":"key"})
      .then(result => {
        this.getCartItems().then(()=>{
          this.onGridReady(this.eventData)
        })
      })
      .then()
  }
  getContextMenuItems=(params)=>{
    return  [
      'copy', 'copyWithHeaders', 'paste', 'separator',
      {
        name: 'ექსელში ექსპორტი .xlsx',
        action: function () {
          window.open( PREFIX+'/api/secured/Item/'+((params.context.thisComponent.state.tab===21)?'Section/Out/Export':'Section/In/Export')+'?filter=' +encodeURIComponent(localStorage.getItem('filter'))+"&list="+_.map(params.context.thisComponent.state.cart['tab' + params.context.thisComponent.state.tab],(value,index)=>index).join(","), '_blank');

        }
      },
      'separator',
      {
        name: 'განპიროვნება',
        action: function () {

          params.context.thisComponent.tmpData = params['node']['data'];
          params.context.thisComponent.onDisposition();
        }
      },
      {
        name: 'ინვ.შებრუნება',
        action: function () {
          /*if (!params['node']['data']['inCart']) {
            params.context.thisComponent.cart({data: params['node']['data'], contextMenu: true});
          }*/
          params.context.thisComponent.onOutcome();
        }
      },
      {
        name: 'ინვენტარის მოძრაობა შენობებს შორის',
        action: function () {
          /*if (!params['node']['data']['inCart']) {
            params.context.thisComponent.cart({data: params['node']['data'], contextMenu: true});
          }*/
          params.context.thisComponent.onMoveAB();
        }
      },
      'separator',
      {
        name: 'მონიშნულის გაუქმება',
        action: function () {
          console.log(params.context.thisComponent)
        }
      },
      'separator',

      {
        name: 'კალათაში ჩაყრილი ნივთები',
        action: function () {
          params.context.thisComponent.cartDialog();
        }
      },
      {
        name: 'კალათის გასუფთავება',
        action: function () {
          params.context.thisComponent.removeCartItem();
        }
      }
    ]
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
    const filterData = this.state.property.search.data;
    const selectedTabId = this.selectedTabId;
    const cartItems = _.map(this.state.cart['tab'+this.state.tab],( (value,index)=>index));
    const tab = this.state.tab;
    const error =  this.error;
    if(filter){
      this.gridApi.setFilterModel(null);
    }
    const datasource = {
      getRows(params) {
        const parameters = [];
        for (const f in params['request']['filterModel']) {
          const name = (f.split('.').length > 0) ? f.split('.')[0] : f;

          parameters.push({
            property: (name==='trDate'|| name==='trDate_1')? 'tr_date': name.replace('_1',''),
            value: (params['request']['filterModel'][f]['filterType'] != undefined && params['request']['filterModel'][f]['filterType'] === 'date' ) ? moment(params['request']['filterModel'][f]['dateFrom']).format("DD/MM/YYYY") : params['request']['filterModel'][f]['filter'],
            operator: (params['request']['filterModel'][f]['filterType'] != undefined && params['request']['filterModel'][f]['filterType'] === 'date' ) ? 'eq' : 'like'
          });
        }
        if (filter) {
          for (const f in filterData) {
            const name = (f.split('.').length > 0) ? f.split('.')[0] : f;
            if (filterData[f] != '' && filterData[f] != undefined && filterData[f] !== null) {
              if(['dateFrom','dateTo'].indexOf(f)>-1){
                parameters.push({
                  property: 'tr_date',
                  value: moment(filterData[f]).format("DD/MM/YYYY"),
                  operator: f=='dateFrom'?'gt':'lt'
                });
              }else if( ['priceFrom','priceTo'].indexOf(f)>-1){
                parameters.push({
                  property: 'price',
                  value: (_.isObject(filterData[f]))? filterData[f]['id']:filterData[f],
                  operator: f=='priceFrom'?'gt':'lt'
                });
              }else if(['barcodeFrom','barcodeTo'].indexOf(f)>-1){
                parameters.push({
                  property: 'barcode',
                  value: (_.isObject(filterData[f]))? filterData[f]['id']:filterData[f],
                  operator: f=='barcodeFrom'?'gt':'lt'
                });
              }
              else if(['barCodeType'].indexOf(f)>-1){
                parameters.push({
                  property: 'barcode_type',
                  value: (_.isObject(filterData[f]))? filterData[f]['id']:filterData[f],
                  operator: 'eq'
                });
              }
              else{
                parameters.push({
                  property: name,
                  value: (_.isObject(filterData[f]))? filterData[f]['id']:filterData[f],
                  operator: 'like'
                });
              }
            }
          }
        }
        localStorage.setItem("filter",JSON.stringify(parameters))
        http.get(Config.management.property.get[tab]+"?stockId="+tab+"&start="+params['request']['startRow']+"&limit="+params['request']['endRow']+"&filter="+encodeURIComponent(JSON.stringify(parameters)))
          .then(response => {
            if (response.status === 200) {
              params.successCallback(response['data'].map((v, k) => {
                v['rowId'] = (params['request']['startRow'] + 1 + k );
                if(v.barCodeType){
                  if (v['barcode'].toString().length <= v['barCodeType']['length']) {
                    v.barcode = v['barCodeType']['value'] + new Array(v['barCodeType']['length'] - (v['barcode'].toString().length - 1)).join('0').slice((v['barCodeType']['length'] - (v['barcode'].toString().length - 1) || 2) * -1) + v['barcode'];
                  }
                  v['barcode'] = (v['spend'] === 1) ? '' : (v['barcode'].toString() === '0') ? '' : v['barcode'];
                }

                v['count'] = 1;
                v['cartId'] = v['id'];
                v['inCart'] = (cartItems.indexOf(v['id'].toString()) > -1);
                console.log(2)
                return v;
              }), response['totalCount']);
              if(response.error){
                error(response.error)
              }
            }else{
              error(response.error)
            }
          })
          .catch(error => {
            params.failCallback();
          });
      }
    };
    params.api.setServerSideDatasource(datasource);
  }
  onInventorIncome() {
    http.get(Config.management.warehouse.get.insertStart)
      .then(result => {
        if (result.status === 200) {
          this.loadInventorData();
          this.setState(State('inventor.income.dialog', true, this.state));
        }else{
          this.error(result.error)
        }
      }).catch(()=>{
        this.setState(State('inventor.income.dialog', false, this.state));
      })
  }
  loadInventorData = () => {
    http.get("/api/secured/List/BarCode/Select")
      .then(result => {
        if (result.status === 200) {
          this.setState(State('property.barCodes', result.data, this.state));
        }else{
          this.error(result.error)
        }
      })
      .catch(result =>  this.error(result.error));
    http.get("/api/secured/MeasureUnit/List").then(result => {
      if (result.status === 200) {
        this.setState(State('property.measureUnitList', result.data, this.state));
      }else{
        this.error(result.error)
      }
    }).catch(result =>  this.error(result.error));
  };

  error = (error='დაფიქსირდა შეცდომა') => {
    this.setState(State('errorDialog',{modal:true, text: error},this.state));
  };

  clearPrintData = (action) => {
    if(action === 'print'){
      this.setState(State('print.modal',false,this.state));
      this.setState(State('print.dialog',true,this.state));
    }else{
      this.setState(State('print',{
        dialog:false,
        modal:false,
        text:'',
        title:'',
        cart: {
          tab21:[],
          tab22:[],
        },
        data: {},
        overhead: {
          title:'',
          lastCode:''
        }
      },this.state));
    }
  };
  openPrintMode=()=>{
    PrintElem(this.dispositionRef);
    this.clearPrintData('cancel');
  };

  render() {
    let tabClass = 'p-button-secondary';

    return (
      <React.Fragment >

        {this.state.print.modal? <ErrorModal text={this.state.errorDialog.text} onClick={()=>this.setState(State('errorDialog',{modal: false, text: ''},this.state))}/> : ''}
        {this.state.print.modal? <PrintModal text={this.state.print.text} onClick={(action)=> this.clearPrintData(action)}/> : ''}

        <div className="actionButton">
          <div className="buttonBox" style={{width: '150px'}}>
            <Button label="გასანაწილებელი" className={this.state.tab === 21?'':'p-button-secondary'} onClick={()=>this.tabClick(21)} />
            <Button label="განაწილებული"   className={this.state.tab === 22?'':'p-button-secondary'} onClick={()=>this.tabClick(22)} />
          </div>
          <div className="buttonBox"></div>
          <div className="buttonBox">
            {
              (this.state.tab === 21)?
                <React.Fragment >
                  <Button label="განპიროვნება" className="p-button-danger" onClick={()=>this.onDisposition()} />
                  <Button label="ინვ. შებრუნება"  className="ui-button-raised" onClick={()=>this.onOutcome()} />
                  <Button label="ინვ. მოძრაობა შენობებს შორის"  className="ui-button-raised" onClick={()=>this.onMoveAB()} />
                </React.Fragment>
                :
                <Button label="ინვ. საწყობში დაბრუნება"  className="ui-button-raised" onClick={()=>this.onInverse()} />
            }
            {
              (!this.state.property.search.show)?
              <Button label="ძებნა" icon="pi pi-search" style={{minWidth:'115px'}}  onClick={()=>this.setState(State('property.search.show',true,this.state))}/>:''
            }
            <div className="cart_count">
              <i className="fa fa-cart-plus fa-lg " onClick={()=>this.cartDialog()}/>
              <span>{_.size(this.state.cart['tab'+this.state.tab])}</span>
            </div>
          </div>
        </div>

        {(this.state.property.search.show)?

          <Search
            measureUnits={this.state.property.measureUnitList}
            barcodeTypes={this.state.property.barCodes}
            data={this.state.property.search.data}
            onChange={(value,field)=>{
              this.setState(State('property.search.data.' + field, value,this.state));
            }}
            onFilter={()=>this.onGridReady(this.eventData,true)}
            onClick={()=>this.setState(State('property.search.show',false,this.state))}
            onClear={()=>this.setState(State('property.search.data',{
              name:"",
              maker:"",
              model:"",
              price:"",
              amount:"",
              measureUnit:"",
              barcode:"",
              factoryNumber:"",
              itemGroup:"",
              itemType:"",
              itemStatus:"",
              supplier:"",
              invoice:"",
              invoiceAddon:"",
              inspectionNumber:"",
              dateFrom:'',
              dateTo:''
            },this.state))}
          />:''}

        <div id="myGrid" className="ag-theme-balham" >
          <AgGridReact
            pivotPanelShow={true}
            floatingFilter={true}
            columnDefs={this.state.grid.columnDefs[this.state.tab]}
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
            getContextMenuItems={this.getContextMenuItems}
            frameworkComponents={this.state.grid.frameworkComponents}

          />
        </div>

        <Modal
          header="საბეჭდი ვერსია"
          visible={this.state.print.dialog}
          onHide={()=>this.resetModalParam('print')} style={{width:'900px'}}
          footer = {
            <div className="dialog_footer">
              <div className="left_side"></div>
              <Button label="ბეჭდვა" className="p-button-secondary" onClick={()=>this.openPrintMode()}/>
              <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.resetModalParam('print')}/>
            </div>
          }>

          <div ref={(ref)=>this.dispositionRef=ref}>
              {_.map(this.state.print.data,(item, key) =>
                <div><b>{key}:</b>&nbsp;{item}</div>
              )}

            <div className="expand_mode">
              <Overhead title={this.state.print.overhead.title} carts={this.state.print.cart} tab={this.state.tab}  newCode={this.state.print.overhead.lastCode}/>
            </div>

          </div>
        </Modal>

        <Modal
          header="განპიროვნება"
          visible={this.state.property.disposition.dialog}
          onHide={()=>this.resetModalParam('disposition')} style={{width:'900px'}}
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

                <Cart
                  onRemoveItem={(index)=>this.removeItemFromCart(this.state.tab,index)}
                  data={this.state.cart['tab'+this.state.tab]}
                  onChangeAmount={e=>{
                    let data=JSON.parse(this.state.cart['tab' + this.state.tab][e.index]);
                    if(e.count>data.amount){
                      e.count=data.amount;
                    }else if(e.count < 1){
                      e.count = 1;
                    }
                    data.count = e.count;
                    this.setState(State('cart.tab' + this.state.tab+"."+e.index,JSON.stringify(data),this.state))
                  }}
                />

              </div>
          }
        </Modal>

        <Modal
          header="ინვენტარის საწყობში შებრუნება" visible={this.state.property.outcome.dialog} onHide={()=>this.resetModalParam('outcome')} style={{width:'900px'}}
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
                        field="fullName"
                        suggestions={this.state.property.transPersonList}
                        onComplete={(e) => this.transPersonList(e)}
                        onSelect={(e)=>this.setState(State('property.outcome.transPerson',e,this.state))}
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
                <Cart
                  onRemoveItem={(index)=>this.removeItemFromCart(this.state.tab,index)}
                  data={this.state.cart['tab'+this.state.tab]}
                  onChangeAmount={e=>{
                    let data=JSON.parse(this.state.cart['tab' + this.state.tab][e.index]);
                    if(e.count>data.amount){
                      e.count=data.amount;
                    }else if(e.count < 1){
                      e.count = 1;
                    }
                    data.count = e.count;
                    this.setState(State('cart.tab' + this.state.tab+"."+e.index,JSON.stringify(data),this.state))
                  }}
                />
              </div>

          }
        </Modal>

        <Modal
          header="ინვენტარის მოძრაობა შენობებს შორის" visible={this.state.property.movAB.dialog} onHide={()=>this.resetModalParam('movAB')} style={{width:'900px'}}
          footer = {
            <div className="dialog_footer">
              <div className="left_side">
                <Button label="კალათის გასუფთავება" className="p-button-danger" onClick={()=>this.removeCartItem()}/>
                <Button label="დოკუმენტები" className="ui-button-raised"/>
              </div>
              {
                (!this.state.property.movAB.expand)?
                  <Button label="ზედდებულის გენერაცია" className="ui-button-raised" onClick={()=>this.movABGenerateOverhead()} />
                  :
                  <React.Fragment>
                    <span className="last_code">ბოლო კოდი - {this.state.property.lastCode} </span>
                    <Button label="ზედდებულის გააქტიურება" className="ui-button-raised"  onClick={()=>this.movABActiveOverhead()}/>
                  </React.Fragment>
              }
              <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.resetModalParam('movAB')} />
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
                      <AutoComplete
                        field="fullName"
                        suggestions={this.state.property.requestPersonList}
                        onComplete={(e) => this.requestPersonList(e)}
                        onSelect = {(e)=>this.setState(State('property.movAB.requestPerson',e,this.state))}
                        onChange = {(e)=>this.setState(State('property.movAB.requestPerson',e,this.state))}
                        value={this.state.property.movAB.requestPerson}
                      />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>ტრანსპორტ. პასხ. პირი:</label>
                      <AutoComplete
                        field="fullName"
                        suggestions={this.state.property.transPersonList}
                        onComplete={(e) => this.transPersonList(e)}
                        onSelect={(e)=>this.setState(State('property.movAB.transPerson',e,this.state))}
                        onChange={(e) => this.setState(State('property.movAB.transPerson',e,this.state))}
                        value={this.state.property.movAB.transPerson}
                      />
                    </div>
                  </div>
                </div>
                <div className="fullwidth p-col-4">
                  <label>კომენტარი</label>
                  <InputTextarea value={this.state.property.movAB.comment} onChange = {(e)=>this.setState(State('property.movAB.comment',e.target.value,this.state))} rows={4} placeholder="შენიშვნა" style={{width:'100%', minHeight:'100px'}} />
                </div>
                <Cart
                  onRemoveItem={(index)=>this.removeItemFromCart(this.state.tab,index)}
                  data={this.state.cart['tab'+this.state.tab]}
                  onChangeAmount={e=>{
                    let data=JSON.parse(this.state.cart['tab' + this.state.tab][e.index]);
                    if(e.count>data.amount){
                      e.count=data.amount;
                    }else if(e.count < 1){
                      e.count = 1;
                    }
                    data.count = e.count;
                    this.setState(State('cart.tab' + this.state.tab+"."+e.index,JSON.stringify(data),this.state))
                  }}
                />
              </div>
          }
        </Modal>

        <Modal
          header="ინვენტარის საწყობში დაბრუნება" visible={this.state.property.inverse.dialog} onHide={()=>this.resetModalParam('inverse')} style={{width:'900px'}}
          footer = {
            <div className="dialog_footer">
              <div className="left_side">
                <Button label="კალათის გასუფთავება" className="p-button-danger" onClick={()=>this.removeCartItem()}/>
                <Button label="დოკუმენტები" className="ui-button-raised"/>
              </div>
              {
                (!this.state.property.inverse.expand)?
                  <Button label="ზედდებულის გენერაცია" className="ui-button-raised" onClick={()=>this.inverseGenerateOverhead()} />
                  :
                  <React.Fragment>
                    <span className="last_code">ბოლო კოდი - {this.state.property.lastCode} </span>
                    <Button label="ზედდებულის გააქტიურება" className="ui-button-raised"  onClick={()=>this.inverseActiveOverhead()}/>
                  </React.Fragment>
              }
              <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.resetModalParam('inverse')}/>
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
                      <AutoComplete
                        field="fullName"
                        suggestions={this.state.property.transPersonList}
                        onComplete={(e) => this.transPersonList(e)}
                        onSelect={(e)=>this.setState(State('property.inverse.transPerson',e,this.state))}
                        onChange={(e) => this.setState(State('property.inverse.transPerson',e,this.state))}
                        value={this.state.property.inverse.transPerson}
                      />
                    </div>
                  </div>
                </div>
                <div className="fullwidth p-col-4">
                  <label>კომენტარი</label>
                  <InputTextarea value={this.state.property.inverse.comment} onChange={(e)=>this.setState(State('property.inverse.comment',e.target.value,this.state))} rows={4} placeholder="შენიშვნა" style={{width:'100%', minHeight:'100px'}} />
                </div>
                <Cart
                  onRemoveItem={(index)=>this.removeItemFromCart(this.state.tab,index)}
                  data={this.state.cart['tab'+this.state.tab]}
                  onChangeAmount={e=>{
                    let data=JSON.parse(this.state.cart['tab' + this.state.tab][e.index]);
                    if(e.count>data.amount){
                      e.count=data.amount;
                    }else if(e.count < 1){
                      e.count = 1;
                    }
                    data.count = e.count;
                    this.setState(State('cart.tab' + this.state.tab+"."+e.index,JSON.stringify(data),this.state))
                  }}
                />
              </div>
          }
        </Modal>

        <Modal header="კალათა"
               footer = {
                 <div className="dialog_footer">
                   <div className="left_side">
                     <Button label="კალათის გასუფთავება" className="p-button-danger" onClick={()=>this.removeCartItem()}/>
                   </div>
                   <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.setState(State('cart.dialog', false, this.state))}/>
                 </div>
               }
               onClick={()=>this.removeCartItem()}
               visible={this.state.cart.dialog}
               onHide={() => this.setState(State('cart.dialog', false, this.state))}
               style={{width: '800px'}}
        >
          <Cart
            onRemoveItem={(index)=>this.removeItemFromCart(this.state.tab,index)}
            data={this.state.cart['tab' + this.state.tab]}
            onChangeAmount={e=>{
              let data=JSON.parse(this.state.cart['tab' + this.state.tab][e.index]);
              if(e.count>data.amount){
                e.count=data.amount;
              }else if(e.count < 1){
                e.count = 1;
              }
              data.count = e.count;
              this.setState(State('cart.tab' + this.state.tab+"."+e.index,JSON.stringify(data),this.state))
            }}
          />
        </Modal>

      </React.Fragment>
    );
  }

  tabClick(tabID) {
    this.setState(State('tab',tabID,this.state));
    this.onReady(this.eventData);
  }

  getCode(type) {
    http.get("/api/secured/Item/Addon?type=Person/Transfer&subType="+type).then(result => {
      if (result.status === 200) {
        if(type === 'last'){
          this.setState(State('property.lastCode',result.data.Right,this.state));
        }else if(type === 'new'){
          this.setState(State('property.newCode',result.data.Right,this.state));
        }
      }
    });
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

  getCartItems = async ()=>{
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
    if(modal !== 'print'){
      this.setState(State('property.'+modal+'.dialog',false,this.state));
      this.setState(State('property.'+modal+'.expand',false,this.state));
      this.setState(State('property.'+modal+'.date',new Date(),this.state));
      this.setState(State('property.'+modal+'.comment','',this.state));
      this.setState(State('property.'+modal+'.files',[],this.state));
    }


    this.setState(State('property.personality',[],this.state));
    this.setState(State('property.roomList',[],this.state));
    this.setState(State('property.stockManList',[],this.state));
    this.setState(State('property.propertyManagementList',[],this.state));
    this.setState(State('property.transPersonList',[],this.state));
    this.setState(State('property.requestPersonList',[],this.state));




    if(modal === 'disposition') {
      this.setState(State('property.'+modal+'.person','',this.state));
    }
    if(modal === 'outcome'){
      this.setState(State('property.'+modal+'.transPerson','',this.state));
      this.setState(State('property.'+modal+'.stockMan','',this.state));
      this.setState(State('property.'+modal+'.section','',this.state));
    }
    if(modal === 'movAB') {
      this.setState(State('property.'+modal+'.transPerson','',this.state));
      this.setState(State('property.'+modal+'.propertyManagement','',this.state));
      this.setState(State('property.'+modal+'.requestPerson','',this.state));
    }
    if(modal === 'inverse') {
      this.setState(State('property.'+modal+'.transPerson','',this.state));
      this.setState(State('property.'+modal+'.section','',this.state));
      this.setState(State('property.'+modal+'.stockMan','',this.state));
    }
    if(modal === 'print') {
      this.clearPrintData('cancel');
    }
  }

  removeCartItem(modal) {
    let formData = new FormData();
    formData.append('globalKey', this.state.tab);
    http.post("/api/secured/internal/session/clear",formData)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('cart.tab'+[this.state.tab],[],this.state));
          this.onReady(this.eventData);
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  }

  transPersonList(e){
    http.get("/api/secured/Staff/Filter/ByName/V2?name="+e)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('property.transPersonList',_.map(result.data,(value)=>{
            return {id:value.id, name:value.fullname, fullName: value.fullname}
          }), this.state));
        }
        else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  }

  // მომთხოვნი პიროვნება
  requestPersonList(e) {
    http.get("/api/secured/Staff/Filter/ByName/V2?name="+e)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('property.requestPersonList', _.map(result.data,(value) =>{
            return {id:value.id, name:value.fullname, fullName: value.fullname}
          }), this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  }

  // <editor-fold defaultstate="collapsed" desc="განპიროვნება მოდალი">
  dispositionActiveOverhead() {
    let formData = new FormData();

    formData.append('note', this.state.property.disposition.comment);
    formData.append('addon', this.state.property.newCode);
    formData.append('trDate',moment(this.state.property.disposition.date).format('DD-MM-YYYY'));
    formData.append('roomId', _.isUndefined(this.state.property.disposition.room.id)? '':this.state.property.disposition.room.id);
    formData.append('receiverPerson', this.state.property.disposition.person.id);
    formData.append('files', this.state.property.disposition.files);

    formData.append('list', JSON.stringify(_.map(this.state.cart["tab"+this.state.tab], value => {
      let val =  JSON.parse(value);
      return {
        itemId: val.id,
        amount: val.count,
        list:""
      }
    })));

    // prepear print data
    this.setState(State('print.cart.tab'+this.state.tab,this.state.cart['tab'+this.state.tab],this.state));
    this.setState(State('print.title','განპიროვნება',this.state));
    this.setState(State('print.overhead',{
      title:'ქონების მართვის გასავლის ელ. ზედდებული ქ.გ - ',
      lastCode: this.state.property.newCode
    },this.state));
    this.setState(State('print.data',{
      'თარიღი': moment(this.state.property.disposition.date).format("DD-MM-YYYY"),
      'პიროვნება': this.state.property.disposition.person.fullname,
      'ოთახი':this.state.property.disposition.room.id,
      'კომენტარი': this.state.property.disposition.comment
    },this.state));



    http.post("/api/secured/Item/Person/Transfer",formData)
      .then(result => {
        if (result.status === 200) {
          this.removeCartItem();
          this.resetModalParam('disposition');
          this.onReady(this.eventData);
          this.setState(State('print.text','ოპერაცია წარმატებით შესრულდა! გნებავთ ზედდებულის ბეჭდვა?',this.state));
          this.setState(State('print.modal',true,this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  }

  dispositionGenerateOverhead() {
    this.setState(State('property.disposition.expand',true,this.state));
    this.getCode('new');
  };

  onDisposition() {
    this.setState(State('property.disposition.dialog',true,this.state));
    this.setState(State('property.disposition.expand',false,this.state));

    this.getCode('last');
  };

  dispositionPersonRoom = (id) => {
    http.get("/api/secured/Item/Building/Rooms?receiverPerson=" + id)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('property.roomList',_.map(result.data,(value)=>{
            return {id:value.id,name:value.name}
          }), this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  };

  dispositionPerson=(event)=>{
    this.setState(State('property.personality', [], this.state));
    http.get("/api/secured/Staff/Filter/ByName/V2?name=" + event)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('property.personality', result.data, this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
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
        amount: val.count,
        list:""
      }
    })));

    // prepear print data
    this.setState(State('print.cart.tab'+this.state.tab,this.state.cart['tab'+this.state.tab],this.state));
    this.setState(State('print.title','ინვენტარის საწყობში შებრუნება',this.state));
    this.setState(State('print.overhead',{
      title:'ქონების მართვის გასავლის ელ. ზედდებული ქ.გ - ',
      lastCode: this.state.property.newCode
    },this.state));
    this.setState(State('print.data',{
      'თარიღი': moment(this.state.property.outcome.date).format('DD-MM-YYYY'),
      'სექცია': this.state.property.outcome.section.name,
      'საწყობის მართვა':this.state.property.outcome.stockMan.name,
      'ტრანსპორტ. პასხ. პირი':this.state.property.outcome.transPerson.fullName,
      'კომენტარი': this.state.property.outcome.comment
    },this.state));

    http.post("/api/secured/Item/Stock/Return",formData)
      .then(result => {
        if (result.status === 200) {
          this.removeCartItem();
          this.resetModalParam('outcome');
          this.onReady(this.eventData);
          this.setState(State('print.text','ოპერაცია წარმატებით შესრულდა! გნებავთ ზედდებულის ბეჭდვა?',this.state));
          this.setState(State('print.modal',true,this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  }

  outcomeGenerateOverhead() {
    this.setState(State('property.outcome.expand',true,this.state));
    this.getCode('new');
  };

  onOutcome = (event) => {
    this.setState(State('property.outcome.dialog',true,this.state));
    this.setState(State('property.outcome.expand',false,this.state));

    this.getCode('last');
  };

  warehouseManagement = (id) => {
    http.get("/api/secured/Staff/Filter/ByStock?stockId=" + id)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('property.stockManList',_.map(result.data,(value)=> {
            return {id:value.id, name:value.fullname}
          }), this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  };
  // </editor-fold>

  // <editor-fold defaultstate="collapsed" desc="ინვენტარის მოძრაობა შენობებს შორის მოდალი">
  movABActiveOverhead() {
    let formData = new FormData();

    formData.append('note', this.state.property.movAB.comment);
    formData.append('addon', this.state.property.newCode);
    formData.append('trDate',moment(this.state.property.movAB.date).format('DD-MM-YYYY'));

    formData.append('carrierPerson', this.state.property.movAB.transPerson.id); // ტრანსპორტ. პასხ. პირი:
    formData.append('toWhomSection', this.state.property.movAB.propertyManagement.id); // ქონების მართვა
    formData.append('requestPerson', this.state.property.movAB.requestPerson.id); // მომთხოვნი პიროვნება

    formData.append('files', this.state.property.movAB.files);
    formData.append('list', JSON.stringify(_.map(this.state.cart["tab"+this.state.tab], value => {
      let val =  JSON.parse(value);
      return {
        itemId: val.id,
        amount: val.count,
        list:""
      }
    })));

    // prepear print data
    this.setState(State('print.cart.tab'+this.state.tab,this.state.cart['tab'+this.state.tab],this.state));
    this.setState(State('print.title','განპიროვნება',this.state));
    this.setState(State('print.overhead',{
      title:'ქონების მართვის გასავლის ელ. ზედდებული ქ.გ - ',
      lastCode: this.state.property.newCode
    },this.state));
    this.setState(State('print.data',{
      'თარიღი': moment(this.state.property.movAB.date).format('DD-MM-YYYY'),
      'ქონების მართვა': this.state.property.movAB.propertyManagement.name,
      'მომთხოვნი პიროვნება':this.state.property.movAB.requestPerson.fullName,
      'ტრანსპორტ. პასხ. პირი':this.state.property.movAB.transPerson.fullName,
      'კომენტარი': this.state.property.movAB.comment
    },this.state));

    http.post("/api/secured/Item/Section/Transfer",formData)
      .then(result => {
        if (result.status === 200) {
          this.removeCartItem();
          this.resetModalParam('movAB');
          this.onReady(this.eventData);
          this.setState(State('print.text','ოპერაცია წარმატებით შესრულდა! გნებავთ ზედდებულის ბეჭდვა?',this.state));
          this.setState(State('print.modal',true,this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  }

  movABGenerateOverhead() {
    this.setState(State('property.movAB.expand',true,this.state));
    this.getCode('new');
  };
  onMoveAB = (event) => {
    this.resetModalParam('movAB');
    this.getCode('last');
    this.setState(State('property.movAB.dialog',true,this.state));
  };

  propertyManagement = () => {
    http.get("/api/secured/Staff/Filter/ByProperty?name=")
      .then(result => {
        if (result.status === 200) {
          this.setState(State('property.propertyManagementList', _.map(result.data,(value) =>{
            return {id:value.id, name:value.fullname}
          }), this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  };
  // </editor-fold>

  // <editor-fold defaultstate="collapsed" desc="ინვენტარის საწყობში დაბრუნება მოდალი">
  inverseActiveOverhead() {
    let formData = new FormData();

    formData.append('note', this.state.property.inverse.comment);
    formData.append('addon', this.state.property.newCode);
    formData.append('trDate',moment(this.state.property.inverse.date).format('DD-MM-YYYY'));

    formData.append('carrierPerson', this.state.property.inverse.transPerson.id);
    formData.append('toWhomStock', this.state.property.inverse.stockMan.id);

    formData.append('files', this.state.property.inverse.files);
    formData.append('list', JSON.stringify(_.map(this.state.cart["tab"+this.state.tab], value => {
      let val =  JSON.parse(value);
      return {
        itemId: val.id,
        amount: val.amount,
        list:""
      }
    })));

    // prepear print data
    this.setState(State('print.cart.tab'+this.state.tab,this.state.cart['tab'+this.state.tab],this.state));
    this.setState(State('print.title','ინვენტარის საწყობში დაბრუნება',this.state));
    this.setState(State('print.overhead',{
      title:'ქონების მართვის გასავლის ელ. ზედდებული ქ.გ - ',
      lastCode: this.state.property.newCode
    },this.state));
    this.setState(State('print.data',{
      'თარიღი': moment(this.state.property.inverse.date).format('DD-MM-YYYY'),
      'სექცია': this.state.property.inverse.section.name,
      'საწყობის მართვა':this.state.property.inverse.stockMan.name,
      'ტრანსპორტ. პასხ. პირი':this.state.property.inverse.transPerson.fullName,
      'კომენტარი': this.state.property.inverse.comment
    },this.state));

    http.post("/api/secured/Item/Stock/Return",formData)
      .then(result => {
        if (result.status === 200) {
          this.removeCartItem();
          this.resetModalParam('inverse');
          this.onReady(this.eventData);
          this.setState(State('print.text','ოპერაცია წარმატებით შესრულდა! გნებავთ ზედდებულის ბეჭდვა?',this.state));
          this.setState(State('print.modal',true,this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  }

  inverseGenerateOverhead() {
    this.setState(State('property.inverse.expand',true,this.state));
    this.getCode('new');
  };

  onInverse = (event) => {
    this.getCode('last');
    this.setState(State('property.inverse.dialog',true,this.state))
  };

  inverseWarehouseManagement = (id) => {
    http.get("/api/secured/Staff/Filter/ByStock?stockId=" + id)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('property.stockManList',_.map(result.data,(value)=> {
            return {id:value.id, name:value.fullname}
          }), this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  };
  // </editor-fold>

  cartDialog=()=> {
    this.setState(State('cart.dialog',true,this.state))
  };
}

import React, { Component } from 'react';
import http, {PREFIX} from '../../../api/http';
import {Config} from "../../../config/Config";
import {
  CardCellRenderer,
  Modal,
  Calendar,
  AutoComplete,
  FileUploader,
  Cart,
  TreeTableGroup,
  Search, Overhead, ErrorModal, PrintModal,
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
import {Checkbox} from 'primereact/checkbox';
import _ from 'lodash';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import './warehouse.css';
import 'primeflex/primeflex.css';
import {State, putInCart, clearCartItem, removeCartItem, getCartItems, PrintElem} from '../../../utils';
import {Validator} from "../../../utils/validator";
import * as moment from 'moment';
import OverheadModalTable from "../../components/OverheadModalTable/OverheadModalTable";
import CustomDateComponent from "../../components/CustomDateComponent/CustomDateComponent";

export default class Warehouse extends Component {
  constructor(props){
    super(props);
    this.nameRef = React.createRef();
    this.modelRef= React.createRef();
    this.makerRef =React.createRef();
    this.state = {
      grid: {
        components: {
          loadingCellRenderer: function (params) {
            if (params.value !== undefined) {
              return params.value;
            } else {
              return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/loading.gif"/>';
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
            headerName: 'ID',
            field: 'id',
            width: 60,
            hide:true,
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
            field: 'fullBarcode',
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
        },
        frameworkComponents: { agDateInput: CustomDateComponent }
      },
      inventor: {
        income: {
          dialog: false,
          showDetails: false,
          date: new Date(),
          supplier: {id:null,name:''},
          comment:"",
          addon: {Left: '', Right: ''},
          tempAddon: {Left: '', Right: ''},
          invoice: '',
          inspectionNumber:'',
          detail: {
            file: null,
            expand:false,
            dialog: false,
            overhead: true,
            edit: false,
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
            comment:'',
            car: {
              number:"",
              year:"",
              vin:""
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
        selected:  {
          id:'',
          file: null,
          expand:false,
          dialog: false,
          overhead:false,
          edit: false,
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
          data: [],
          comment:'',
          car: {
            number:"",
            year:"",
            vin:""
          },
          numbers:{
            from:"",
            to: ""
          }
        },
        outcome: {
          dialog: false,
          expand:false,
          date: new Date(),
          tab: 0,
          transPerson: "",
          propertyManagement: "",
          requestPerson: "",
          stockMan: "",
          section: "",
          room: "",
          person: "",
          comment: "",
          files:[],
        },
        transfer: {
          date: new Date(),
          dialog: false,
          expand: false,
          comment: "",
          transPerson: "",
          propertyManagement: "",
          section: "",
          files:[],
        },
        overhead: {
          dialog: false,
          expand: false,
          qr: "",

          checked1: true,
          checked2: true,
          checked3: true,
          checked4: false,
          checked5: false,
          checked6: false,

          createDate: {
            checked:false,
            date1: new Date(),
            date2: new Date(),
          },
          transDate: {
            checked:false,
            date1: new Date(),
            date2: new Date(),
          },
          deliveryDate: {
            checked:false,
            date1: new Date(),
            date2: new Date(),
          },
          closeDate: {
            checked:false,
            date1: new Date(),
            date2: new Date(),
          },
          comment: {
            checked:false,
            text: "",
          },
          driver: {
            checked:false,
            text: "",
          },
          car: {
            checked:false,
            text: "",
          },
          supplier: {
            checked:false,
            text: "",
          },
          zednadebi: {
            checked:false,
            text: "",
          },
          zeddebuli: {
            checked:false,
            text: "",
          },
          buyerWaybillsEx:[]
        },
        search: {
          show: false,
          dialog: false,
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
        modelSuggestions: [],

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
      tab: 11,
      cart: {
        tab11: [],
        tab12: [],
        dialog: false
      },
      errorDialog: {
        dialog: false,
        text: ''
      },
      supplierList: [
        {id: '1', name: 'შპს'},
        {id: '2', name: 'ინდმეწარმე'},
        {id: '3', name: 'ფიზიკური პირი'},
        {id: '4', name: 'სააქციო საზოგადოება'}
      ],
      supplier: {
        dialog: false,
        value: "",
        number: "",
        dropdown:{id:null, name:''},
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
    this.loadConstructor();
  }
  getContextMenuItems=(params)=>{
    return  [
      'copy', 'copyWithHeaders', 'paste', 'separator',
      {
        name: 'ექსელში ექსპორტი .xlsx',
        action: function () {
          //window.open(params.context.thisComponent.prod + '/api/secured/Item/Stock/Export' + localStorage.getItem('filter')+"&list="+params.context.thisComponent.state.cart['tab' + params.context.thisComponent.state.tab].map(v=>v.id).join(","), '_blank');
          window.open( PREFIX+'/api/secured/Item/Stock/Export?stockId='+params.context.thisComponent.state.tab+'&filter=' +encodeURIComponent(localStorage.getItem('filter'))+"&list="+_.map(params.context.thisComponent.state.cart['tab' + params.context.thisComponent.state.tab],(value,index)=>index).join(","), '_blank');

        }
      },
      'separator',
      {
        name: 'რედაქტირება',
        action: function () {

          params.context.thisComponent.tmpData = params['node']['data'];
          params.context.thisComponent.edit();
        }
      },
      {
        name: 'ინვენტარის გაცემა',
        action: function () {
          if (!params['node']['data']['inCart']) {
            params.context.thisComponent.cart({data: params['node']['data'], contextMenu: true});
          }
          params.context.thisComponent.inventoryToBuildingDialog();
        }
      },
      {
        name: 'ინვენტარის მოძრაობა სექციებს შორის',
        action: function () {
          /*if (!params['node']['data']['inCart']) {
            params.context.thisComponent.cart({data: params['node']['data'], contextMenu: true});
          }*/
          params.context.thisComponent.onTransfer();
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
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  handleClickOutside = () => {
    setTimeout(() => {
      this.setState(State('inventor.itemSuggestions', [], this.state));
      this.setState(State('inventor.makerSuggestions', [], this.state));
      this.setState(State('inventor.modelSuggestions', [], this.state));
    }, 200)

  };
  onGridReady(params, filter= false) {

    this.eventData = params;
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const filterApi=params.api;
    const filterData = this.state.inventor.search.data;
    const selectedTabId = this.selectedTabId;
    const cartItems = _.map(this.state.cart['tab'+this.state.tab],( (value,index)=>index));
    let tabID = this.state.tab;
    const error = this.error;
    if(filter){
      this.gridApi.setFilterModel(null);
    }
    const datasource = {
      getRows(params) {
        const parameters = [];

        if (filter) {
          for (const f in filterData) {
            const name = (f.split('.').length > 0) ? f.split('.')[0] : f;
            if (filterData[f] !== '' && filterData[f] !== undefined && filterData[f] !== null) {
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
        for (const f in params['request']['filterModel']) {
          const name = (f.split('.').length > 0) ? f.split('.')[0] : f;
          parameters.push({
            property: name==='trDate'? 'tr_date': name,
            value: (params['request']['filterModel'][f]['filterType'] != undefined && params['request']['filterModel'][f]['filterType'] === 'date' ) ? moment(params['request']['filterModel'][f]['dateFrom']).format("DD/MM/YYYY") : params['request']['filterModel'][f]['filter'],
            operator: (params['request']['filterModel'][f]['filterType'] != undefined && params['request']['filterModel'][f]['filterType'] === 'date' ) ? 'eq' : 'like'
          });
        }
        localStorage.setItem("filter",JSON.stringify(parameters))
        http.get(Config.management.warehouse.get.items+"?stockId="+tabID+"&start="+params['request']['startRow']+"&limit="+params['request']['endRow']+"&filter="+encodeURIComponent(JSON.stringify(parameters)))
          .then(response => {
            if (response.status === 200) {
              params.successCallback(response['data'].map((v, k) => {
                v['rowId'] = (params['request']['startRow'] + 1 + k);
                if (v.barCodeType) {
                  if (v['barcode'].toString().length <= v['barCodeType']['length']) {
                    v.barcode = v['barCodeType']['value'] + new Array(v['barCodeType']['length'] - (v['barcode'].toString().length - 1)).join('0').slice((v['barCodeType']['length'] - (v['barcode'].toString().length - 1) || 2) * -1) + v['barcode'];
                  }
                  v['barcode'] = (v['spend'] === 1) ? '' : (v['barcode'].toString() === '0') ? '' : v['barcode'];
                }
                v['count'] = 1;
                v['cartId'] = v['id'];
                v['inCart'] = (cartItems.indexOf(v['id'].toString()) > -1);
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
  error=(error='დაფიქსირდა შეცდომა')=>{
    this.setState(State('errorDialog',{dialog:true, text: error},this.state));
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
    return (
      <React.Fragment>
        {this.state.errorDialog.dialog? <ErrorModal text={this.state.errorDialog.text} onClick={()=>this.setState(State('errorDialog',{dialog: false, text: ''},this.state))}/> : ''}
        {this.state.print.modal? <PrintModal text={this.state.print.text} onClick={(action)=> this.clearPrintData(action)}/> : ''}

        {/*<div className="actionButton ribbon">*/}
        {/*  <div className="buttonBox" style={{width: '150px'}}>*/}
        {/*    <Button label="A" icon="pi pi-home" className={this.state.tab === 11?'':'p-button-secondary'} onClick={()=>this.tabClick(11)}/>*/}
        {/*    <Button label="B" icon="pi pi-home" className={this.state.tab === 12?'':'p-button-secondary'} onClick={()=>this.tabClick(12)}/>*/}
        {/*  </div>*/}
        {/*  <div className="buttonBox">*/}
        {/*    <Button label="ინვ.მიღება" icon="pi pi-plus" onClick={() => this.onInventorIncome()}/>*/}
        {/*    <Button label="ზედ.მიღება" icon="pi pi-plus" onClick={() => this.onOverheadIncome()}/>*/}
        {/*    <Button label="რედაქტირება" icon="pi pi-pencil" onClick={()=>this.edit()}/>*/}
        {/*  </div>*/}
        {/*  <div className="buttonBox">*/}
        {/*    <Button label="ინვენტარის გაცემა" icon="pi pi-arrow-up" className="p-button-danger" onClick={() => this.onInventorOutcome()}/>*/}
        {/*    <Button label="მოძრაობა A-B" className="ui-button-raised arrow-icon" onClick={()=>this.onTransfer()} style={{width:'140px'}}/>*/}
        {/*    {*/}
        {/*      (!this.state.inventor.search.show)?*/}
        {/*        <Button label="ძებნა" icon="pi pi-search"*/}
        {/*                onClick={()=>this.setState(State('inventor.search.show',true,this.state))}/>:''*/}
        {/*    }*/}
        {/*    <div className="cart_count">*/}
        {/*      <i className="fa fa-cart-plus fa-lg " onClick={()=>this.cartDialog()}/>*/}
        {/*      <span>{_.size(this.state.cart['tab'+this.state.tab])}</span>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="actionButton ribbon">
          <div className="buttonBox" style={{width: '125px'}}>
            <Button label="A" icon="pi pi-home" className={this.state.tab === 11?'':'p-button-secondary'} onClick={()=>this.tabClick(11)}/>
            <Button label="B" icon="pi pi-home" className={this.state.tab === 12?'':'p-button-secondary'} onClick={()=>this.tabClick(12)}/>
          </div>
          <ul className="buttonBox">
            <li onClick={() => this.onInventorIncome()}>
              <i><img src="/assets/Favorites/icons8-add-list-50.png" /></i>
              <span>ინვ.მიღება</span>
            </li>
            <li onClick={() => this.onOverheadIncome()}>
              <i><img src="/assets/Favorites/icons8-add-file-50.png" /></i>
              <span>ზედ.მიღება</span>
            </li>
            <li onClick={()=>this.edit()}>
              <i><img src="/assets/Favorites/icons8-edit-property-50.png" /></i>
              <span>რედაქტირება</span>
            </li>
          </ul>
          <ul className="buttonBox">
            <li onClick={() => this.onInventorOutcome()}>
              <i><img src="/assets/Favorites/icons8-sell-50.png" /></i>
              <span>ინვენტარის გაცემა</span>
            </li>
            <li onClick={() => this.onTransfer()}>
              <i><img src="/assets/Favorites/icons8-separate-document-50.png" /></i>
              <span>მოძრაობა A-B</span>
            </li>

            {
              (!this.state.inventor.search.show)?
                <li onClick={()=>this.setState(State('inventor.search.show',true,this.state))}>
                  <i><img src="/assets/Favorites/icons8-search-property-50.png" /></i>
                  <span>ძებნა</span>
                </li>:''
            }

            <li onClick={()=>this.cartDialog()}>
              <div className="cart_count">
                <i className="fa fa-cart-plus fa-lg" />
                <span>{_.size(this.state.cart['tab'+this.state.tab])}</span>
              </div>
              <span>კალათა</span>
            </li>

          </ul>
        </div>
        {(this.state.inventor.search.show)?
          <Search
            measureUnits={this.state.inventor.measureUnitList}
            barcodeTypes={this.state.inventor.barCodes}
            data={this.state.inventor.search.data}
            onChange={(value,field)=>{
              this.setState(State('inventor.search.data.' + field, value,this.state));
            }}
            onFilter={()=>this.onGridReady(this.eventData,true)}
            onClick={()=>this.setState(State('inventor.search.show',false,this.state))}
            onClear={()=>
             {
               this.onReady(this.eventData);
               this.setState(State('inventor.search.data',{
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
               },this.state))
             }
            }
          />
          :''}
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
            getContextMenuItems={this.getContextMenuItems}
            gridOptions={this.state.grid.gridOptions}
            rowClassRules={this.state.grid.rowClassRules}
            onSelectionChanged={this.onSelectionChanged.bind(this)}
            onGridReady={this.onReady}
            onCellClicked={this.onClickedCell}
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

            <div className="expand_mode" style={{marginTop:'20px'}}>
              <Overhead title={this.state.print.overhead.title} carts={this.state.print.cart} tab={this.state.tab}  newCode={this.state.print.overhead.lastCode}/>
            </div>

          </div>
        </Modal>


        <Modal
          header="ზედნადებით მიღება" visible={this.state.inventor.overhead.dialog}
          onHide={() => this.resetModalParam('overhead')}
          style={{width: '1200px'}}
          footer = {
            <div className="dialog_footer">
              <div className="left_side">
              </div>
              {
                (!this.state.inventor.overhead.expand)?
                  <Button label="ჩაშლა" className="ui-button-raised" onClick={()=>this.transferGenerateOverhead()} />
                  :
                  <React.Fragment>
                    <Button label="მიღება" className="ui-button-raised"  onClick={()=>this.setState(State('inventor.income.dialog', true,this.state))}/>
                  </React.Fragment>
              }
              <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.resetModalParam('overhead')}/>
            </div>
          }>
          {
            (this.state.inventor.overhead.expand)?
             <OverheadModalTable data={this.state.inventor.overhead.buyerWaybillsEx} onChangeData={(e,supplier)=>{
               console.log(supplier)
               this.setState(State('inventor.income', e, this.state),
                 ()=>this.setState(State('supplier', supplier, this.state),()=> console.log(this.state)));
             }} />
              :
              <div className="p-grid overhead_modal">
                <div className="p-col-10">
                  <div className="p-grid">
                  <div className="fullwidth p-col-6">

                    <div className="p-grid">
                      <div className="p-col-5">
                        <Checkbox inputId="cb7" value="შექმნის თარიღი" onChange={(e) => this.setState(State('inventor.overhead.createDate.checked', e.checked, this.state))} checked={this.state.inventor.overhead.createDate.checked}></Checkbox>
                        <label htmlFor="cb7" className="p-checkbox-label">შექმნის თარიღი</label>
                      </div>
                      {this.state.inventor.overhead.createDate.checked?
                        <div className="p-col-7">
                          <Calendar date={this.state.inventor.overhead.createDate.date1} onDateChange={props=>this.setState(State('inventor.overhead.createDate.date1',props,this.state)) } />
                          <Calendar date={this.state.inventor.overhead.createDate.date2} onDateChange={props=>this.setState(State('inventor.overhead.createDate.date2',props,this.state)) } />
                        </div>:''}
                    </div>
                    <div className="p-grid">
                      <div className="p-col-5">
                        <Checkbox inputId="cb8" value="ტრანსპ. თარიღი" onChange={(e) => this.setState(State('inventor.overhead.transDate.checked', e.checked, this.state))} checked={this.state.inventor.overhead.transDate.checked}></Checkbox>
                        <label htmlFor="cb8" className="p-checkbox-label">ტრანსპ. თარიღი</label>
                      </div>
                      {this.state.inventor.overhead.transDate.checked?
                        <div className="p-col-7">
                          <Calendar date={this.state.inventor.overhead.transDate.date1} onDateChange={props=>this.setState(State('inventor.overhead.transDate.date1',props,this.state)) } />
                          <Calendar date={this.state.inventor.overhead.transDate.date2} onDateChange={props=>this.setState(State('inventor.overhead.transDate.date2',props,this.state)) } />
                        </div>:''}
                    </div>
                    <div className="p-grid">
                      <div className="p-col-5">
                        <Checkbox inputId="cb9" value="მიტანის თარიღი" onChange={(e) => this.setState(State('inventor.overhead.deliveryDate.checked', e.checked, this.state))} checked={this.state.inventor.overhead.deliveryDate.checked}></Checkbox>
                        <label htmlFor="cb9" className="p-checkbox-label">მიტანის თარიღი</label>
                      </div>
                      {this.state.inventor.overhead.deliveryDate.checked?
                        <div className="p-col-7">
                          <Calendar date={this.state.inventor.overhead.deliveryDate.date1} onDateChange={props=>this.setState(State('inventor.overhead.deliveryDate.date1',props,this.state)) } />
                          <Calendar date={this.state.inventor.overhead.deliveryDate.date2} onDateChange={props=>this.setState(State('inventor.overhead.deliveryDate.date2',props,this.state)) } />
                        </div>:''}
                    </div>
                    <div className="p-grid">
                      <div className="p-col-5">
                        <Checkbox inputId="cb10" value="დახურვის თარიღი" onChange={(e) => this.setState(State('inventor.overhead.closeDate.checked', e.checked, this.state))} checked={this.state.inventor.overhead.closeDate.checked}></Checkbox>
                        <label htmlFor="cb10" className="p-checkbox-label">დახურვის თარიღი</label>
                      </div>
                      {this.state.inventor.overhead.closeDate.checked?
                        <div className="p-col-7">
                          <Calendar date={this.state.inventor.overhead.closeDate.date1} onDateChange={props=>this.setState(State('inventor.overhead.closeDate.date1',props,this.state)) } />
                          <Calendar date={this.state.inventor.overhead.closeDate.date2} onDateChange={props=>this.setState(State('inventor.overhead.closeDate.date2',props,this.state)) } />
                        </div>:''}
                    </div>
                    <div className="p-grid">
                      <div className="p-col-5">
                        <Checkbox inputId="cb11" value="კომენტარი" onChange={(e) => this.setState(State('inventor.overhead.comment.checked', e.checked, this.state))} checked={this.state.inventor.overhead.comment.checked}></Checkbox>
                        <label htmlFor="cb11" className="p-checkbox-label">კომენტარი</label>
                      </div>
                      {this.state.inventor.overhead.comment.checked?
                        <div className="p-col-7">
                          <InputTextarea rows={1} value={this.state.inventor.overhead.comment.text} onChange={e => this.setState(State('inventor.overhead.comment.text', e.target.value, this.state))}/>
                        </div>:''}
                    </div>

                  </div>
                  <div className="fullwidth p-col-6">

                    <div className="p-grid">
                      <div className="p-col-5">
                        <Checkbox inputId="cb12" value="მძღოლის პირადი #" onChange={(e) => this.setState(State('inventor.overhead.driver.checked', e.checked, this.state))} checked={this.state.inventor.overhead.driver.checked}></Checkbox>
                        <label htmlFor="cb12" className="p-checkbox-label">მძღოლის პირადი #</label>
                      </div>
                      {this.state.inventor.overhead.driver.checked?
                        <div className="p-col-7">
                          <InputText value={this.state.inventor.overhead.driver.text} onChange={(e) => this.setState(State('inventor.overhead.driver.text', e.target.value, this.state))} />
                        </div>:''}
                    </div>

                    <div className="p-grid">
                      <div className="p-col-5">
                        <Checkbox inputId="cb13" value="მანქანის #" onChange={(e) => this.setState(State('inventor.overhead.car.checked', e.checked, this.state))} checked={this.state.inventor.overhead.car.checked}></Checkbox>
                        <label htmlFor="cb13" className="p-checkbox-label">მანქანის #</label>
                      </div>
                      {this.state.inventor.overhead.car.checked?
                        <div className="p-col-7">
                          <InputText value={this.state.inventor.overhead.car.text} onChange={(e) => this.setState(State('inventor.overhead.car.text', e.target.value, this.state))} />
                        </div>:''}
                    </div>

                    <div className="p-grid">
                      <div className="p-col-5">
                        <Checkbox inputId="cb14" value="მიმწ-ის საიდ.კოდი" onChange={(e) => this.setState(State('inventor.overhead.supplier.checked', e.checked, this.state))} checked={this.state.inventor.overhead.supplier.checked}></Checkbox>
                        <label htmlFor="cb14" className="p-checkbox-label">მიმწ-ის საიდ.კოდი</label>
                      </div>
                      {this.state.inventor.overhead.supplier.checked?
                        <div className="p-col-7">
                          <InputText value={this.state.inventor.overhead.supplier.text} onChange={(e) => this.setState(State('inventor.overhead.supplier.text', e.target.value, this.state))} />
                        </div>:''}
                    </div>

                    <div className="p-grid">
                      <div className="p-col-5">
                        <Checkbox inputId="cb15" value="ზედნადების #" onChange={(e) => this.setState(State('inventor.overhead.zednadebi.checked', e.checked, this.state))} checked={this.state.inventor.overhead.zednadebi.checked}></Checkbox>
                        <label htmlFor="cb15" className="p-checkbox-label">ზედნადების #</label>
                      </div>
                      {this.state.inventor.overhead.zednadebi.checked?
                        <div className="p-col-7">
                          <InputText value={this.state.inventor.overhead.zednadebi.text} onChange={(e) => this.setState(State('inventor.overhead.zednadebi.text', e.target.value, this.state))} />
                        </div>:''}
                    </div>

                    <div className="p-grid">
                      <div className="p-col-5">
                        <Checkbox inputId="cb16" value="ზედდებულის თანხა" onChange={(e) => this.setState(State('inventor.overhead.zeddebuli.checked', e.checked, this.state))} checked={this.state.inventor.overhead.zeddebuli.checked}></Checkbox>
                        <label htmlFor="cb16" className="p-checkbox-label">ზედდებულის თანხა</label>
                      </div>
                      {this.state.inventor.overhead.zeddebuli.checked?
                        <div className="p-col-7">
                          <InputText value={this.state.inventor.overhead.zeddebuli.text} onChange={(e) => this.setState(State('inventor.overhead.zeddebuli.text', e.target.value, this.state))} />
                        </div>:''}
                    </div>

                  </div>
                  </div>
                </div>
                <div className="p-col-2">
                  <h6>ზედნადების ტიპები</h6>
                  <div className="p-col-12">
                    <Checkbox inputId="cb1" value="შიდა გადაზიდვა" onChange={(e) => this.setState(State('inventor.overhead.checked1', e.checked, this.state))} checked={this.state.inventor.overhead.checked1}/>
                    <label htmlFor="cb1" className="p-checkbox-label">შიდა გადაზიდვა</label>
                  </div>
                  <div className="p-col-12">
                    <Checkbox inputId="cb2" value="ტრანსპორტირებით" onChange={(e) => this.setState(State('inventor.overhead.checked2', e.checked, this.state))} checked={this.state.inventor.overhead.checked2}/>
                    <label htmlFor="cb2" className="p-checkbox-label">ტრანსპორტირებით</label>
                  </div>
                  <div className="p-col-12">
                    <Checkbox inputId="cb3" value="ტრანსპ.ს გარეშე" onChange={(e) => this.setState(State('inventor.overhead.checked3', e.checked, this.state))} checked={this.state.inventor.overhead.checked3}></Checkbox>
                    <label htmlFor="cb3" className="p-checkbox-label">ტრანსპ.ს გარეშე</label>
                  </div>
                  <div className="p-col-12">
                    <Checkbox inputId="cb4" value="დისტრიბუცია" onChange={(e) => this.setState(State('inventor.overhead.checked4', e.checked, this.state))} checked={this.state.inventor.overhead.checked4}></Checkbox>
                    <label htmlFor="cb4" className="p-checkbox-label">დისტრიბუცია</label>
                  </div>
                  <div className="p-col-12">
                    <Checkbox inputId="cb5" value="უკან დაბრუნება" onChange={(e) => this.setState(State('inventor.overhead.checked5', e.checked, this.state))} checked={this.state.inventor.overhead.checked5}></Checkbox>
                    <label htmlFor="cb5" className="p-checkbox-label">უკან დაბრუნება</label>
                  </div>
                  <div className="p-col-12">
                    <Checkbox inputId="cb6" value="ქვეზედნადები" onChange={(e) => this.setState(State('inventor.overhead.checked6', e.checked, this.state))} checked={this.state.inventor.overhead.checked6}></Checkbox>
                    <label htmlFor="cb6" className="p-checkbox-label">ქვეზედნადები</label>
                  </div>
                </div>
              </div>
          }
        </Modal>
        <Modal
          header="ინვენტარის მიღება დეტალები"
          visible={this.state.inventor.income.detail.dialog}
          onHide={() => this.setState(State('inventor.income.detail.dialog', false, this.state))}
          style={{width: '1200px'}}
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
                    <th>განზ.ერთ</th>
                    {
                      (( this.state.inventor.income.detail.itemGroup.isStrict === 1)
                        ||
                        ( this.state.inventor.income.detail.itemGroup.isCar === 1)
                        ||
                        ( this.state.inventor.income.detail.itemGroup.spend === 1))?
                        <div/>:
                        <th>შტრიხკოდი</th>
                    }
                    {
                      ( this.state.inventor.income.detail.itemGroup.isCar === 1)?
                        <React.Fragment>
                          <th>სახელმწიფო ნომერი</th>
                          <th>წელი</th>
                          <th>Vin კოდი</th>
                        </React.Fragment>:
                        <th>ქარხნული ნომერი</th>
                    }
                    {
                      ( this.state.inventor.income.detail.itemGroup.isStrict === 1)?
                        <React.Fragment>
                          <td>-დან</td>
                          <td>-მდე</td>
                          <th>რაოდენობა</th>
                        </React.Fragment>:
                        <th>რაოდენობა</th>
                    }
                    <th>ჯგუფი</th>
                    <th>ტიპი</th>
                    <th>სტატუსი</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    _.map(this.state.inventor.income.detail.list, (value, index) => {
                      const  itemGroup =this.state.inventor.income.detail.itemGroup;
                      return (
                        <tr key={index}>
                          <td>{this.state.inventor.income.detail.item.name}</td>
                          <td>{this.state.inventor.income.detail.maker.name}</td>
                          <td>{this.state.inventor.income.detail.model.name}</td>
                          <td>{this.state.inventor.income.detail.price}</td>
                          <td>{this.state.inventor.income.detail.measureUnit.name}</td>
                          {
                            (itemGroup.isCar === 1 || itemGroup.isStrict === 1 || itemGroup.spend  === 1)?
                              <div/>
                              :
                              <td>
                                {value.barCodeName}
                                <input type="text" value={value.barCode}
                                       onChange={event => this.setState(State('inventor.income.detail.list.' + index + '.barCode', event.target.value, this.state))}/>
                              </td>
                          }
                          {
                            ( this.state.inventor.income.detail.itemGroup.isCar === 1)?
                              <React.Fragment>
                                <td><input type="text" value={value.car.number} onChange={event => this.setState(State('inventor.income.detail.list.'+index+'.car.number', event.target.value, this.state),()=>console.log(index,this.state.inventor.income.detail.list))}/>  </td>
                                <td><input type="text" value={value.car.year} onChange={event => this.setState(State('inventor.income.detail.list.'+index+'.car.year', event.target.value, this.state),()=>console.log(index,this.state.inventor.income.detail.list))}/> </td>
                                <td><input type="text" value={value.car.vin} onChange={event => this.setState(State('inventor.income.detail.list.'+index+'.car.vin', event.target.value, this.state),()=>console.log(index,this.state.inventor.income.detail.list))}/> </td>
                              </React.Fragment>:
                              <td>{this.state.inventor.income.detail.factoryNumber}</td>
                          }
                          {
                            ( this.state.inventor.income.detail.itemGroup.isStrict === 1)?
                              <React.Fragment>
                                <td>{this.state.inventor.income.detail.numbers.from}</td>
                                <td>{this.state.inventor.income.detail.numbers.to}</td>
                                <td>{Math.round(this.state.inventor.income.detail.numbers.to*1 - this.state.inventor.income.detail.numbers.from*1)}</td>
                              </React.Fragment>:
                              <td>{value.amount}</td>
                          }
                          <td>{this.state.inventor.income.detail.itemGroup.name}</td>
                          <td>{this.state.inventor.income.detail.type.name}</td>
                          <td>{this.state.inventor.income.detail.status.name}</td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </table>
              </div>) : (
              <>
                <div className="incomeModal p-grid">
                  <div className="fullwidth p-col-2">
                    <label>დასახელება</label>
                    <AutoComplete
                      class={this.state.inventor.income.errors.item ? 'bRed' : ''}
                      placeholder="დასახელება"
                      field="name"
                      suggestions={this.state.inventor.itemSuggestions}
                      onComplete={this.suggestItem}
                      onSelect={(e) => this.setState(State('inventor.income.detail.item', e, this.state), () => this.parseInventorDetailData(this.state.inventor.income.detail.item))}
                      onChange={(e) =>
                        this.setState(State('inventor.income.detail.item.name', e, this.state))}
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
                      onChange={(e) => this.setState(State('inventor.income.detail.maker.name', e, this.state))}
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
                  {
                    (this.state.inventor.income.detail.itemGroup.isStrict === 1) ?
                      '':
                      <div className="fullwidth p-col-2">
                        <label>რაოდენობა</label>
                        <InputText type="text" placeholder="დასახელება"
                                   className={this.state.inventor.income.errors.count ? 'bRed' : ''}
                                   value={this.state.inventor.income.detail.count}
                                   onChange={(e) => this.setState(State("inventor.income.detail.count", e.target.value.replace(',','.'), this.state))}/>
                      </div>
                  }
                  <div className="fullwidth p-col-2">
                    <label>ერთეულის ფასი</label>
                    <InputText type="text" placeholder="დასახელება" value={this.state.inventor.income.detail.price}
                               onChange={(e) => this.setState(State("inventor.income.detail.price", e.target.value.replace(',','.'), this.state))}/>
                  </div>
                  <div className="fullwidth p-col-2">
                    <label>სულ ფასი:</label>
                    <div
                      style={{lineHeight: '30px'}}>{(parseFloat(this.state.inventor.income.detail.price) * parseFloat(this.state.inventor.income.detail.count)).toFixed(2)}</div>
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
                            options={_.map(this.state.inventor.barCodes,value=> {  return {id: value.id, name: value.name} })}
                            onChange={(e) => this.setState(State("inventor.income.detail.barCodeType", {
                              id: e.value.id,
                              name: e.value.name
                            }, this.state), () => this.lastbarCode(this.state.inventor.income.detail.barCodeType))}
                            placeholder="ბარკოდი"
                            optionLabel="name"
                          />
                          <InputText type="number" placeholder="შტრ. კოდი"
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
                              class={this.state.inventor.income.errors.measureUnit ? 'bRed' : ''}
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
                    <label>კომენტარი</label>
                    <InputTextarea rows={1} value={this.state.inventor.income.detail.comment}
                                   onChange={e => this.setState(State('inventor.income.detail.comment', e.target.value, this.state))}/>

                  </div>
                  <div className="fullwidth p-col-12">
                    <FileUploader
                      onSelectFile={(file) => this.setState(State('inventor.income.detail.file', file.files[0], this.state))}/>
                  </div>
                </div>
              </>
            )
          }
        </Modal>
        <Modal
          header="ინვენტარის რედაქტირება"
          visible={this.state.inventor.selected.dialog}
          onHide={() => this.setState(State('inventor.selected.dialog', false, this.state))}
          style={{width: '1200px'}}
          footer={
            (<div>
              <Button label="დამახსოვრება" icon="pi pi-check" onClick={this.onUpdate}/> :
              <Button label="გაუქმება" icon="pi pi-times" className="p-button-secondary"
                      onClick={() => this.setState(State('inventor.selected.dialog', false, this.state))}/>
            </div>)
          }>
          {

            <div className="incomeModal p-grid">
              <div className="fullwidth p-col-2">
                <label>დასახელება</label>
                <AutoComplete
                  class={this.state.inventor.income.errors.item ? 'bRed' : ''}
                  placeholder="დასახელება"
                  field="name"
                  suggestions={this.state.inventor.itemSuggestions}
                  onComplete={this.suggestItem}
                  onSelect={(e) => this.setState(State('inventor.selected.item', e, this.state), () => this.parseInventorDetailData(this.state.selected.item))}
                  onChange={(e) =>
                    this.setState(State('inventor.selected.item.name', e, this.state))}
                  value={this.state.inventor.selected.item}
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
                  onSelect={(e) => this.setState(State('inventor.selected.maker', e, this.state))}
                  onChange={(e) => this.setState(State('inventor.selected.maker.name', e, this.state))}
                  value={this.state.inventor.selected.maker}
                />
              </div>
              <div className="fullwidth p-col-2">
                <label>მოდელი</label>
                <AutoComplete
                  placeholder="მოდელი"
                  field="name"
                  class={this.state.inventor.income.errors.model ? 'bRed' : ''}
                  disabled={_.isUndefined(this.state.inventor.selected.maker) || (_.isNull(this.state.inventor.selected.maker.id) && _.isEmpty(this.state.inventor.selected.maker.name))}
                  suggestions={this.state.inventor.modelSuggestions}
                  onComplete={this.suggestModel}
                  onSelect={(e) => this.setState(State('inventor.selected.model', e, this.state))}
                  onChange={(e) => this.setState(State('inventor.selected.model.name', e, this.state))}
                  value={this.state.inventor.selected.model}
                />
              </div>

              {
                (this.state.inventor.selected.itemGroup.isStrict === 1) ?
                  '':
                  <div className="fullwidth p-col-2">
                    <label>რაოდენობა</label>
                    <InputText type="text" placeholder="დასახელება"
                               className={this.state.inventor.income.errors.count ? 'bRed' : ''}
                               value={this.state.inventor.selected.count}
                               onChange={(e) => this.setState(State("inventor.selected.count", e.target.value, this.state))}/>
                  </div>
              }
              <div className="fullwidth p-col-2">
                <label>ერთეულის ფასი</label>
                <InputText type="text" placeholder="დასახელება" value={this.state.inventor.selected.price}
                           onChange={(e) => this.setState(State("inventor.selected.price", e.target.value, this.state))}/>
              </div>
              <div className="fullwidth p-col-2">
                <label>სულ ფასი:</label>

                <div
                  style={{lineHeight: '30px'}}>{(this.state.inventor.selected.price * this.state.inventor.selected.count).toFixed(2)}</div>
              </div>
              {
                (this.state.inventor.selected.itemGroup.spend === 1 || this.state.inventor.selected.itemGroup.isStrict === 1 || this.state.inventor.selected.itemGroup.isCar === 1) ? (
                    (this.state.inventor.selected.itemGroup.isStrict === 1) ?
                      (
                        <React.Fragment>
                          <div className="fullwidth p-col-2">
                            <label>დან</label>
                            <InputText type="text" placeholder="დან"
                                       value={this.state.inventor.selected.numbers.from}
                                       onChange={(e) => this.setState(State("inventor.selected.numbers.from", e.target.value, this.state))}/>
                          </div>
                          <div className="fullwidth p-col-2">
                            <label>მდე</label>
                            <InputText type="text" placeholder="მდე" value={this.state.inventor.selected.numbers.to}
                                       onChange={(e) => this.setState(State("inventor.selected.numbers.to", e.target.value, this.state))}/>
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
                        value={this.state.inventor.selected.barCodeType}
                        options={_.map(this.state.inventor.barCodes,value=> {  return {id: value.id, name: value.name} })}
                        onChange={(e) => this.setState(State("inventor.selected.barCodeType", {
                          id: e.value.id,
                          name: e.value.name
                        }, this.state), () => this.lastbarCode(this.state.inventor.selected.barCodeType))}
                        placeholder="ბარკოდი"
                        optionLabel="name"
                      />
                      <InputText type="number" placeholder="შტრ. კოდი"
                                 style={{textIndent: '0px', width: '78px', fontSize: '12px'}}
                                 value={this.state.inventor.selected.barCode}
                                 onChange={(e) => this.setState(State("inventor.selected.barCode", e.target.value, this.state))}/>
                    </div>
                  )
              }


              <div className="fullwidth p-col-2">
                <label>{(this.state.inventor.selected.itemGroup.isCar === 1) ? 'Vin კოდი' : 'ქარხნული ნომერი'}:</label>
                <InputText type="text" value={this.state.inventor.selected.factoryNumber}
                           onChange={(e) => this.setState(State("inventor.selected.factoryNumber", e.target.value, this.state))}/>
              </div>
              {
                (this.state.inventor.selected.itemGroup.isCar === 1) ?
                  (
                    <React.Fragment>
                      <div className="fullwidth p-col-2">
                        <label> სახელმწიფო ნომერი</label>
                        <InputText type="text" value={this.state.inventor.selected.car.number}
                                   onChange={(e) => this.setState(State("inventor.selected.car.number", e.target.value, this.state))}/>
                      </div>
                      <div className="fullwidth p-col-2">
                        <label>გამოშვების წელი</label>
                        <InputText type="text" value={this.state.inventor.selected.car.year}
                                   onChange={(e) => this.setState(State("inventor.selected.car.year", e.target.value, this.state))}/>
                      </div>
                    </React.Fragment>
                  ) : <div/>
              }
              <div className="fullwidth p-col-2">
                <label>განზომილების ერთეული</label>
                <Dropdown style={{width: '100%'}} value={this.state.inventor.selected.measureUnit}
                          options={this.state.inventor.measureUnitList}
                          onChange={(e) => this.setState(State("inventor.selected.measureUnit", {
                            id: e.value.id,
                            name: e.value.name
                          }, this.state))} placeholder="განზომილების ერთეული" optionLabel="name"/>
              </div>
              <div className={`fullwidth p-col-2`}>
                <label>საქონლის ჯგუფი</label>
                <div className="p-inputgroup">
                  <InputText placeholder="საქონლის ჯგუფი"
                             className={this.state.inventor.income.errors.itemGroup ? 'bRed' : ''}
                             value={this.state.inventor.selected.itemGroup.name} disabled />
                  <Button icon="pi pi-align-justify" className="p-button-info" style={{left: '-10px'}}
                          onClick={() => this.setState(State('inventor.itemGroup.dialog', true, this.state))}/>
                </div>
              </div>
              <div className="fullwidth p-col-2">
                <label>ინვენტარის ტიპი</label>
                <Dropdown value={this.state.inventor.selected.type}
                          className={this.state.inventor.income.errors.type ? 'bRed' : ''}
                          options={this.state.inventor.itemTypes}
                          onChange={(e) => this.setState(State("inventor.selected.type", {
                            id: e.value.id,
                            name: e.value.name
                          }, this.state))} placeholder="ინვენტარის ტიპი" optionLabel="name"/>
              </div>
              <div className="fullwidth p-col-2">
                <label>ინვენტარის სტატუსი</label>
                <Dropdown value={this.state.inventor.selected.status}
                          className={this.state.inventor.income.errors.status ? 'bRed' : ''}
                          options={this.state.inventor.itemStatus}
                          onChange={(e) => this.setState(State("inventor.selected.status", {
                            id: e.value.id,
                            name: e.value.name
                          }, this.state))} placeholder="ინვენტარის სტატუსი" optionLabel="name"/>
              </div>
              <div className="fullwidth p-col-12">
                <label>კომენტარი</label>
                <InputTextarea rows={1} value={this.state.inventor.selected.comment}
                               onChange={e => this.setState(State('inventor.selected.comment', e.target.value, this.state))}/>

              </div>
              <div className="fullwidth p-col-12">
                <FileUploader
                  onSelectFile={(file) => this.setState(State('inventor.selected.file', file.files[0], this.state))}/>
              </div>
            </div>
          }
        </Modal>
        <Modal
          header="ინვენტარის რედაქტირება დეტალები"
          visible={this.state.inventor.selected.dialog}
          onHide={() => {   this.resetInventor();this.gridApi.deselectAll();}}
          style={{width: '1200px'}}
          footer={
            (<div>
              {this.state.inventor.selected.expand ?
                <Button label="დამახსოვრება" icon="pi pi-check" onClick={this.onSaveEditDetail}/> :
                <Button label="ჩაშლა" icon="pi pi-check" onClick={this.onInventorEditExpand}/>
              }
              <Button label="გაუქმება" icon="pi pi-times" className="p-button-secondary"
                      onClick={() =>{  this.resetInventor();this.gridApi.deselectAll();}}/>
            </div>)
          }>
          {
            this.state.inventor.selected.expand ? (
              <div className="incomeAddedTable" style={{maxHeight: '300px', overflowY: 'scroll'}}>
                <table>
                  <thead>
                  <tr>
                    <th>დასახელება</th>
                    <th>მარკა</th>
                    <th>მოდელი</th>
                    <th>ფასი</th>
                    <th>განზ.ერთ</th>
                    {
                      (( this.state.inventor.selected.itemGroup.isStrict === 1)
                        ||
                        ( this.state.inventor.selected.itemGroup.isCar === 1)
                        ||
                        ( this.state.inventor.selected.itemGroup.spend === 1))?
                        <div/>:
                        <th>შტრიხკოდი</th>
                    }
                    {
                      ( this.state.inventor.selected.itemGroup.isCar === 1)?
                        <React.Fragment>
                          <th>სახელმწიფო ნომერი</th>
                          <th>წელი</th>
                          <th>Vin კოდი</th>
                        </React.Fragment>:
                        <th>ქარხნული ნომერი</th>
                    }
                    {
                      ( this.state.inventor.selected.itemGroup.isStrict === 1)?
                        <React.Fragment>
                          <td>-დან</td>
                          <td>-მდე</td>
                          <th>რაოდენობა</th>
                        </React.Fragment>:
                        <th>რაოდენობა</th>
                    }
                    <th>ჯგუფი</th>
                    <th>ტიპი</th>
                    <th>სტატუსი</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    _.map(this.state.inventor.selected.list, (value, index) => {
                      const  itemGroup =this.state.inventor.selected.itemGroup;
                      return (
                        <tr key={index}>
                          <td>{this.state.inventor.selected.item.name}</td>
                          <td>{this.state.inventor.selected.maker.name}</td>
                          <td>{this.state.inventor.selected.model.name}</td>
                          <td>{this.state.inventor.selected.price}</td>
                          <td>{this.state.inventor.selected.measureUnit.name}</td>
                          {
                            (itemGroup.isCar === 1 || itemGroup.isStrict === 1 || itemGroup.spend  === 1)?
                              <div/>
                              :
                              <td>
                                {value.barCodeName}
                                <input type="text" value={value.barCode}
                                       onChange={event => this.setState(State('inventor.selected.list.' + index + '.barCode', event.target.value, this.state))}/>
                              </td>
                          }
                          {
                            ( this.state.inventor.selected.itemGroup.isCar === 1)?
                              <React.Fragment>
                                <td><input type="text" value={value.car.number} onChange={event => this.setState(State('inventor.selected.list.'+index+'.car.number', event.target.value, this.state),()=>console.log(index,this.state.inventor.selected.list))}/>  </td>
                                <td><input type="text" value={value.car.year} onChange={event => this.setState(State('inventor.selected.list.'+index+'.car.year', event.target.value, this.state),()=>console.log(index,this.state.inventor.selected.list))}/> </td>
                                <td><input type="text" value={value.car.vin} onChange={event => this.setState(State('inventor.selected.list.'+index+'.car.vin', event.target.value, this.state),()=>console.log(index,this.state.inventor.selected.list))}/> </td>
                              </React.Fragment>:
                              <td>{this.state.inventor.selected.factoryNumber}</td>
                          }
                          {
                            ( this.state.inventor.selected.itemGroup.isStrict === 1)?
                              <React.Fragment>
                                <td>{this.state.inventor.selected.numbers.from}</td>
                                <td>{this.state.inventor.selected.numbers.to}</td>
                                <td>{Math.round(this.state.inventor.selected.numbers.to*1 - this.state.inventor.selected.numbers.from*1)}</td>
                              </React.Fragment>:
                              <td>{value.amount}</td>
                          }
                          <td>{this.state.inventor.selected.itemGroup.name}</td>
                          <td>{this.state.inventor.selected.type.name}</td>
                          <td>{this.state.inventor.selected.status.name}</td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </table>
              </div>) : (
              <>
                <div className="incomeModal p-grid">
                  <div className="fullwidth p-col-2">
                    <label>დასახელება</label>
                    <AutoComplete
                      class={this.state.inventor.income.errors.item ? 'bRed' : ''}
                      placeholder="დასახელება"
                      field="name"
                      suggestions={this.state.inventor.itemSuggestions}
                      onComplete={this.suggestItem}
                      onSelect={(e) => this.setState(State('inventor.selected.item', e, this.state), () => this.parseInventorDetailData(this.state.inventor.selected.item))}
                      onChange={(e) =>
                        this.setState(State('inventor.selected.item.name', e, this.state))}
                      value={this.state.inventor.selected.item}
                    />
                  </div>
                  <div className="fullwidth p-col-2">
                    <label>მარკა</label>
                    <AutoComplete
                      placeholder="მარკა"selected          field="name"
                      class={this.state.inventor.income.errors.maker ? 'bRed' : ''}
                      suggestions={this.state.inventor.makerSuggestions}
                      onComplete={this.suggestMaker}
                      onSelect={(e) => this.setState(State('inventor.selected.maker', e, this.state))}
                      onChange={(e) => this.setState(State('inventor.selected.maker.name', e, this.state))}
                      value={this.state.inventor.selected.maker}
                    />
                  </div>
                  <div className="fullwidth p-col-2">
                    <label>მოდელი</label>
                    <AutoComplete
                      placeholder="მოდელი"
                      field="name"
                      class={this.state.inventor.income.errors.model ? 'bRed' : ''}
                      disabled={_.isUndefined(this.state.inventor.selected.maker) || (_.isNull(this.state.inventor.selected.maker.id) && _.isEmpty(this.state.inventor.selected.maker.name))}
                      suggestions={this.state.inventor.modelSuggestions}
                      onComplete={this.suggestModel}
                      onSelect={(e) => this.setState(State('inventor.selected.model', e, this.state))}
                      onChange={(e) => this.setState(State('inventor.selected.model.name', e, this.state))}
                      value={this.state.inventor.selected.model}
                    />
                  </div>
                  {
                    (this.state.inventor.selected.itemGroup.isStrict === 1) ?
                      '':
                      <div className="fullwidth p-col-2">
                        <label>რაოდენობა</label>
                        <InputText type="text" placeholder="დასახელება"
                                   className={this.state.inventor.income.errors.count ? 'bRed' : ''}
                                   value={this.state.inventor.selected.count}
                                   onChange={(e) => this.setState(State("inventor.selected.count", e.target.value, this.state))}/>
                      </div>
                  }
                  <div className="fullwidth p-col-2">
                    <label>ერთეულის ფასი</label>
                    <InputText type="text" placeholder="დასახელება" value={this.state.inventor.selected.price}
                               onChange={(e) => this.setState(State("inventor.selected.price", e.target.value, this.state))}/>
                  </div>
                  <div className="fullwidth p-col-2">
                    <label>სულ ფასი:</label>
                    <div
                      style={{lineHeight: '30px'}}>{Math.round(parseInt(this.state.inventor.selected.price) * parseInt(this.state.inventor.selected.count))}</div>
                  </div>
                  {
                    (this.state.inventor.selected.itemGroup.spend === 1 || this.state.inventor.selected.itemGroup.isStrict === 1 || this.state.inventor.selected.itemGroup.isCar === 1) ? (
                        (this.state.inventor.selected.itemGroup.isStrict === 1) ?
                          (
                            <React.Fragment>
                              <div className="fullwidth p-col-2">
                                <label>დან</label>
                                <InputText type="text" placeholder="დან"
                                           value={this.state.inventor.selected.numbers.from}
                                           onChange={(e) => this.setState(State("inventor.selected.numbers.from", e.target.value, this.state))}/>
                              </div>
                              <div className="fullwidth p-col-2">
                                <label>მდე</label>
                                <InputText type="text" placeholder="მდე" value={this.state.inventor.selected.numbers.to}
                                           onChange={(e) => this.setState(State("inventor.selected.numbers.to", e.target.value, this.state))}/>
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
                            value={this.state.inventor.selected.barCodeType}
                            options={_.map(this.state.inventor.barCodes,value=> {  return {id: value.id, name: value.name} })}
                            onChange={(e) => this.setState(State("inventor.selected.barCodeType", {
                              id: e.value.id,
                              name: e.value.name
                            }, this.state), () => this.lastbarCode(this.state.inventor.selected.barCodeType))}
                            placeholder="ბარკოდი"
                            optionLabel="name"
                          />
                          <InputText type="number" placeholder="შტრ. კოდი"
                                     style={{textIndent: '0px', width: '78px', fontSize: '12px'}}
                                     value={this.state.inventor.selected.barCode}
                                     onChange={(e) => this.setState(State("inventor.selected.barCode", e.target.value, this.state))}/>
                        </div>
                      )
                  }

                  <div className="fullwidth p-col-2">
                    <label>{(this.state.inventor.selected.itemGroup.isCar === 1) ? 'Vin კოდი' : 'ქარხნული ნომერი'}:</label>
                    <InputText type="text" value={this.state.inventor.selected.factoryNumber}
                               onChange={(e) => this.setState(State("inventor.selected.factoryNumber", e.target.value, this.state))}/>
                  </div>
                  {
                    (this.state.inventor.selected.itemGroup.isCar === 1) ?
                      (
                        <React.Fragment>
                          <div className="fullwidth p-col-2">
                            <label> სახელმწიფო ნომერი</label>
                            <InputText type="text" value={this.state.inventor.selected.car.number}
                                       onChange={(e) => this.setState(State("inventor.selected.car.number", e.target.value, this.state))}/>
                          </div>
                          <div className="fullwidth p-col-2">
                            <label>გამოშვების წელი</label>
                            <InputText type="text" value={this.state.inventor.selected.car.year}
                                       onChange={(e) => this.setState(State("inventor.selected.car.year", e.target.value, this.state))}/>
                          </div>
                        </React.Fragment>
                      ) : <div/>
                  }
                  <div className="fullwidth p-col-2">
                    <label>განზომილების ერთეული</label>
                    <Dropdown style={{width: '100%'}} value={this.state.inventor.selected.measureUnit}
                              options={this.state.inventor.measureUnitList}
                              class={this.state.inventor.income.errors.measureUnit ? 'bRed' : ''}
                              onChange={(e) => this.setState(State("inventor.selected.measureUnit", {
                                id: e.value.id,
                                name: e.value.name
                              }, this.state))} placeholder="განზომილების ერთეული" optionLabel="name"/>
                  </div>
                  <div className={`fullwidth p-col-2`}>
                    <label>საქონლის ჯგუფი</label>
                    <div className="p-inputgroup">
                      <InputText placeholder="საქონლის ჯგუფი"
                                 className={this.state.inventor.income.errors.itemGroup ? 'bRed' : ''}
                                 value={this.state.inventor.selected.itemGroup.name} disabled />
                      <Button icon="pi pi-align-justify" className="p-button-info" style={{left: '-10px'}}
                              onClick={() => this.setState(State('inventor.itemGroup.dialog', true, this.state))}/>
                    </div>
                  </div>
                  <div className="fullwidth p-col-2">
                    <label>ინვენტარის ტიპი</label>
                    <Dropdown value={this.state.inventor.selected.type}
                              className={this.state.inventor.income.errors.type ? 'bRed' : ''}
                              options={this.state.inventor.itemTypes}
                              onChange={(e) => this.setState(State("inventor.selected.type", {
                                id: e.value.id,
                                name: e.value.name
                              }, this.state))} placeholder="ინვენტარის ტიპი" optionLabel="name"/>
                  </div>
                  <div className="fullwidth p-col-2">
                    <label>ინვენტარის სტატუსი</label>
                    <Dropdown value={this.state.inventor.selected.status}
                              className={this.state.inventor.income.errors.status ? 'bRed' : ''}
                              options={this.state.inventor.itemStatus}
                              onChange={(e) => this.setState(State("inventor.selected.status", {
                                id: e.value.id,
                                name: e.value.name
                              }, this.state))} placeholder="ინვენტარის სტატუსი" optionLabel="name"/>
                  </div>
                  <div className="fullwidth p-col-12">
                    <label>კომენტარი</label>
                    <InputTextarea rows={1} value={this.state.inventor.selected.comment}
                                   onChange={e => this.setState(State('inventor.selected.comment', e.target.value, this.state))}/>

                  </div>
                  <div className="fullwidth p-col-12">
                    <FileUploader
                      onSelectFile={(file) => this.setState(State('inventor.selected.file', file.files[0], this.state))}/>
                  </div>
                </div>
              </>
            )
          }
        </Modal>
        <Modal
          header="ინვენტარის მიღება"
          visible={this.state.inventor.income.dialog}
          onHide={() => this.setState(State('inventor.income.dialog', false, this.state),()=>this.resetIncome())}
          style={{width: '1200px'}}
          footer={
            <div>
              {
                this.state.inventor.income.showDetails ?
                  <React.Fragment>
                    {
                      (!_.isEmpty(this.state.inventor.income.addon.Right)) ?
                        <span style={{ position: 'absolute', left: '10px',fontSize:'16px', fontFamily: 'lbet-st'}}>
                              ბოლო კოდი : {this.state.inventor.income.addon.Right}
                        </span>
                        :
                        <span/>
                    }
                    <Button label="ზედდებულის გააქტიურება" icon="pi pi-check" onClick={() => this.onSaveInventor()}/>
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
              <div className="expand_mode">
                <div style={{width:'100%', textAlign: 'center'}}>
                  <h3>
                    საწყობის შემოსავლის ელ. ზედდებული № {this.state.inventor.income.tempAddon.Left} - <input type="text" style={{ border: '0px' }} value={this.state.inventor.income.tempAddon.Right} onChange={e=>this.setState(State('inventor.income.tempAddon.Right',e.target.value,this.state))}/>
                  </h3>
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
                      _.map(this.state.inventor.income.data, (value,index) => {
                        return (
                          <tr key={index}>
                            <td>{moment(this.state.inventor.income.date).format("DD-MM-YYYY")}</td>
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
                      class={this.state.inventor.income.errors.supplier ? 'bRed width-85' : 'width-85'}
                      suggestions={this.state.inventor.supplierSuggestions}
                      onComplete={this.suggestSupplier}
                      onSelect={(e) => this.setState(State('inventor.income.supplier', e, this.state))}
                      onChange={(e) => this.setState(State('inventor.income.supplier.name', e, this.state))}
                      value={this.state.inventor.income.supplier}
                      addIcon={true}
                      onAdd={()=> this.showSupplierDialog()}
                    />
                  </div>
                  <div className="fullwidth p-col-3">
                    <label>სასაქონლო ზედნადები</label>
                    <InputText type="text" value={this.state.inventor.income.invoice}  onChange={e=>this.setState(State('inventor.income.invoice', e.target.value, this.state))}/>
                  </div>
                  <div className="fullwidth p-col-3">
                    <label>მიღება ჩაბარების აქტი</label>
                    <InputText type="text" value={this.state.inventor.income.inspectionNumber}  onChange={e=>this.setState(State('inventor.income.inspectionNumber', e.target.value, this.state))}/>
                  </div>
                  <div className="fullwidth p-col-12">
                    <label>კომენტარი</label>
                    <InputTextarea
                      rows={1}
                      value={this.state.inventor.income.comment}
                      onChange={e => this.setState(State('inventor.income.comment', e.target.value, this.state))}/>
                    <Button label="დამატება" icon="pi pi-plus" onClick={() => {
                      this.resetDetail();
                      this.loadInventorData();
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
                      <th> </th>
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
                            <td><i className="fa fa-edit" onClick={()=>this.setState(State('inventor.income.detail',value,this.state),()=>{
                              this.setState(State('inventor.income.detail.expand', false, this.state));
                              this.setState(State('inventor.income.detail.edit', true, this.state),
                                () => this.setState(State('inventor.income.detail.dialog', true, this.state)));
                            })}/></td>
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
        <Modal
          header="ინვენტარის გაცემა" visible={this.state.inventor.outcome.dialog}
          onHide={() => this.resetModalParam('outcome')}
          style={{width: '900px'}}
          footer = {
            (this.state.inventor.outcome.tab === 0)?
              // შენობა ტაბის  ღილაკები
            <div className="dialog_footer">
              <div className="left_side">
                <Button label="კალათის გასუფთავება" className="p-button-danger" onClick={()=>this.removeCartItem()}/>
                <Button label="დოკუმენტები" className="ui-button-raised"/>
              </div>
              {
                (!this.state.inventor.outcome.expand)?
                  <Button label="ზედდებულის გენერაცია" className="ui-button-raised" onClick={()=>this.outcameTab0GenerateOverhead()} />
                  :
                  <React.Fragment>
                    <span className="last_code">ბოლო კოდი - {this.state.inventor.lastCode} </span>
                    <Button label="ზედდებულის გააქტიურება" className="ui-button-raised"  onClick={()=>this.outcameTab0ActiveOverhead()}/>
                  </React.Fragment>
              }
              <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.resetModalParam('outcome')}/>
            </div>
              :
              // პიროვნება ტაბის  ღილაკები
            <div className="dialog_footer">
                <div className="left_side">
                  <Button label="კალათის გასუფთავება" className="p-button-danger" onClick={()=>this.removeCartItem()}/>
                  <Button label="დოკუმენტები" className="ui-button-raised"/>
                </div>
                {
                  (!this.state.inventor.outcome.expand)?
                    <Button label="ზედდებულის გენერაცია" className="ui-button-raised" onClick={()=>this.outcameTab1GenerateOverhead()} />
                    :
                    <React.Fragment>
                      <span className="last_code">ბოლო კოდი - {this.state.inventor.lastCode} </span>
                      <Button label="ზედდებულის გააქტიურება" className="ui-button-raised"  onClick={()=>this.outcameTab1ActiveOverhead()}/>
                    </React.Fragment>
                }
                <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.resetModalParam('outcome')}/>
              </div>
          }>
          {
            (this.state.inventor.outcome.expand) ?
              <div className="expand_mode">
                <Overhead title="ქონების მართვის გასავლის ელ. ზედდებული ქ.გ - " carts={this.state.cart} tab={this.state.tab}  newCode={this.state.inventor.newCode} onChange={e=>this.setState(State('inventor.newCode',e.target.value,this.state))}/>
              </div>
              :
              <>
              <TabView renderActiveOnly={false} activeIndex={this.state.inventor.outcome.tab} onTabChange={(e)=>this.inventorOutcomeTabChange(e)}>
                <TabPanel header="შენობა">
                  <div className="incomeModal p-grid">
                    <div className="fullwidth p-col-8">
                      <div className="p-grid">
                        <div className="fullwidth p-col-6">
                          <label>თარიღი</label>
                          <Calendar date={this.state.inventor.outcome.date} onDateChange={props=>this.setState(State('inventor.outcome.date',props,this.state)) } />
                        </div>
                        <div className="fullwidth p-col-6">
                          <label>ქონების მართვა</label>
                          <Dropdown value={this.state.inventor.outcome.propertyManagement}  onMouseDown={(e)=>this.propertyManagement()} options={this.state.inventor.propertyManagementList} onChange={(e) => this.setState(State("inventor.outcome.propertyManagement",{ id: e.value.id, name: e.value.name},this.state))} optionLabel="name" placeholder="" style={{width:'100%'}} />
                        </div>
                        <div className="fullwidth p-col-6">
                          <label>მომთხოვნი პიროვნება</label>
                          <AutoComplete
                            field="fullName"
                            suggestions={this.state.inventor.requestPersonList}
                            onComplete={(e) => this.requestPersonList(e)}
                            onSelect = {(e)=>this.setState(State('inventor.outcome.requestPerson',e,this.state))}
                            onChange = {(e)=>this.setState(State('inventor.outcome.requestPerson',e,this.state))}
                            value={this.state.inventor.outcome.requestPerson}
                          />
                        </div>
                        <div className="fullwidth p-col-6">
                          <label>ტრანსპორტირების პასხ. პირი</label>
                          <AutoComplete
                            field="fullName"
                            suggestions={this.state.inventor.transPersonList}
                            onComplete={(e) => this.transPersonList(e)}
                            onSelect={(e)=>this.setState(State('inventor.outcome.transPerson',e,this.state))}
                            onChange={(e) => this.setState(State('inventor.outcome.transPerson',e,this.state))}
                            value={this.state.inventor.outcome.transPerson}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="fullwidth p-col-4">
                      <label>კომენტარი</label>
                      <InputTextarea value={this.state.inventor.outcome.comment} onChange = {(e)=>this.setState(State('inventor.outcome.comment',e.target.value,this.state))} rows={4} placeholder="შენიშვნა" style={{width: '100%', minHeight: '100px'}}/>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel header="პიროვნება">
                  <div className="incomeModal p-grid">
                    <div className="fullwidth p-col-4">
                      <label>თარიღი</label>
                      <Calendar date={this.state.inventor.outcome.date} onDateChange={props=>this.setState(State('inventor.outcome.date',props,this.state)) } />
                    </div>
                    <div className="fullwidth p-col-4">
                      <label>პიროვნება</label>
                      <AutoComplete
                        field="fullname"
                        suggestions={this.state.inventor.personality}
                        onComplete={this.Person}
                        onSelect={(e)=>this.setState(State('inventor.outcome.person',e,this.state),()=>this.personRoom(e.id))}
                        onChange={(e) => this.setState(State('inventor.outcome.person',e,this.state))}
                        value={this.state.inventor.outcome.person}
                      />
                    </div>
                    <div className="fullwidth p-col-4">
                      <label>ქონების მართვა</label>
                      <Dropdown value={this.state.inventor.outcome.propertyManagement}  onMouseDown={(e)=>this.propertyManagement()} options={this.state.inventor.propertyManagementList} onChange={(e) => this.setState(State("inventor.outcome.propertyManagement",{ id: e.value.id, name: e.value.name},this.state))} optionLabel="name" placeholder="" style={{width:'100%'}} />
                    </div>
                    <div className="fullwidth p-col-4">
                      <label>სექცია</label>
                      <Dropdown value={this.state.inventor.outcome.room} options={this.state.inventor.roomList} onChange={(e) => this.setState(State( "inventor.outcome.room",{ id: e.value.id, name: e.value.name},this.state))} optionLabel="name" placeholder="სექცია" style={{width:'100%'}} />
                    </div>
                    <div className="fullwidth p-col-4">
                      <label>ტრანსპორტირების პასხ. პირი</label>
                      <AutoComplete
                        field="fullName"
                        suggestions={this.state.inventor.transPersonList}
                        onComplete={(e) => this.transPersonList(e)}
                        onSelect={(e)=>this.setState(State('inventor.outcome.transPerson',e,this.state))}
                        onChange={(e) => this.setState(State('inventor.outcome.transPerson',e,this.state))}
                        value={this.state.inventor.outcome.transPerson}
                      />
                    </div>
                    <div className="fullwidth p-col-4">
                      <label>მომთხოვნი პიროვნება</label>
                      <AutoComplete
                        field="fullName"
                        suggestions={this.state.inventor.requestPersonList}
                        onComplete={(e) => this.requestPersonList(e)}
                        onSelect = {(e)=>this.setState(State('inventor.outcome.requestPerson',e,this.state))}
                        onChange = {(e)=>this.setState(State('inventor.outcome.requestPerson',e,this.state))}
                        value={this.state.inventor.outcome.requestPerson}
                      />
                    </div>
                    <div className="fullwidth p-col-12">
                      <label>კომენტარი</label>
                      <InputTextarea value={this.state.inventor.outcome.comment} onChange = {(e)=>this.setState(State('inventor.outcome.comment',e.target.value,this.state))} rows={1} placeholder="შენიშვნა" style={{width: '100%'}}/>
                    </div>
                  </div>
                </TabPanel>
              </TabView>
              <Cart onRemoveItem={(index)=>this.removeItemFromCart(this.state.tab,index)}
                data={this.state.cart['tab' + this.state.tab]}
                onChangeAmount={e=>{
                  let data=JSON.parse(this.state.cart['tab' + this.state.tab][e.index]);
                  if(e.count>data.amount){
                    e.count=data.amount;
                  }
                  else if(e.count < 1){
                    e.count = 1;
                  }
                  data.count = e.count;
                  this.setState(State('cart.tab' + this.state.tab+"."+e.index,JSON.stringify(data),this.state))
                }
              }/>
              </>
          }
        </Modal>
        <Modal
          header="ინვენტარის მოძრაობა სექციებს შორის" visible={this.state.inventor.transfer.dialog}
          onHide={() => this.resetModalParam('transfer')}
          style={{width: '900px'}}
          footer = {
            <div className="dialog_footer">
              <div className="left_side">
                <Button label="კალათის გასუფთავება" className="p-button-danger" onClick={()=>this.removeCartItem()}/>
                <Button label="დოკუმენტები" className="ui-button-raised"/>
              </div>
              {
                (!this.state.inventor.transfer.expand)?
                  <Button label="ზედდებულის გენერაცია" className="ui-button-raised" onClick={()=>this.transferGenerateOverheadAB()} />
                  :
                  <React.Fragment>
                    <span className="last_code">ბოლო კოდი - {this.state.inventor.lastCode} </span>
                    <Button label="ზედდებულის გააქტიურება" className="ui-button-raised"  onClick={()=>this.transferActiveOverhead()}/>
                  </React.Fragment>
              }
              <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.resetModalParam('transfer')}/>
            </div>
          }>
          {
            (this.state.inventor.transfer.expand)?
              <div className="expand_mode">
                <Overhead title="საწყობიდან გასავლის ელ. ზედდებული ს.გ - " carts={this.state.cart} tab={this.state.tab}  newCode={this.state.inventor.newCode} onChange={e=>this.setState(State('property.newCode',e.target.value,this.state))}/>
              </div>
              :
              <div className="incomeModal p-grid">
                <div className="fullwidth p-col-8">
                  <div className="p-grid">
                    <div className="fullwidth p-col-6">
                      <label>თარიღი</label>
                      <Calendar date={this.state.inventor.transfer.date} onDateChange={props=>this.setState(State('inventor.transfer.date',props,this.state)) } />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>სექცია</label>
                      <Dropdown value={this.state.inventor.transfer.section} options={this.state.inventor.sectionList} onChange={(e) => this.setState(State( "inventor.transfer.section",{ id: e.value.id, name: e.value.name},this.state), this.warehouseManagement(e.value.id))} optionLabel="name" placeholder="სექცია" style={{width:'100%'}} />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>ქონების მართვა</label>
                      <Dropdown value={this.state.inventor.transfer.propertyManagement}  options={this.state.inventor.stockManList} onChange={(e) => this.setState(State("inventor.transfer.propertyManagement",{ id: e.value.id, name: e.value.name},this.state))} optionLabel="name" placeholder="" style={{width:'100%'}} />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>ტრანსპორტირების პასხ. პირი</label>
                      <AutoComplete
                        field="fullName"
                        suggestions={this.state.inventor.transPersonList}
                        onComplete={(e) => this.transPersonList(e)}
                        onSelect={(e)=>this.setState(State('inventor.transfer.transPerson',e,this.state))}
                        onChange={(e) => this.setState(State('inventor.transfer.transPerson',e,this.state))}
                        value={this.state.inventor.transfer.transPerson}
                      />
                    </div>
                  </div>
                </div>
                <div className="fullwidth p-col-4">
                  <label>კომენტარი</label>
                  <InputTextarea rows={4} placeholder="შენიშვნა" style={{width: '100%', minHeight: '100px'}}/>
                </div>
                <Cart onRemoveItem={(index)=>this.removeItemFromCart(this.state.tab,index)} data={this.state.cart['tab' + this.state.tab]} onChangeAmount={e=>{
                  let data=JSON.parse(this.state.cart['tab' + this.state.tab][e.index]);
                  if(e.count>data.amount){
                    e.count=data.amount;
                  }else if(e.count < 1){
                    e.count = 1;
                  }
                  data.count = e.count;
                  this.setState(State('cart.tab' + this.state.tab+"."+e.index,JSON.stringify(data),this.state))
                }
                }/>
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
        <Modal
          className="itemGroup"
          header="საქონლის ჯგუფი"
          visible={this.state.inventor.itemGroup.dialog}
          onHide={() => this.setState(State('inventor.itemGroup.dialog', false, this.state))}
          style={{width: '800px', maxHeight: '500px'}}>
          {
            (this.state.inventor.itemGroup.dialog) ?
              <TreeTableGroup
                column={[{field: 'name', title: 'Name'}]}
                data={this.state.inventor.itemGroup.data}
                onSelectItemGroup={(e) => this.setState(State("inventor.income.detail.itemGroup", e, this.state),
                  () => this.setState(State("inventor.itemGroup.dialog", false, this.state),
                    () =>{ let group = this.state.inventor.income.detail.itemGroup; this.setState(State('inventor.income.detail.barCodeType', (group.isCar ===1 || group.isStrict ===1 || group.spend ===1 )? {id:'', name:""}: this.state.inventor.income.detail.barCodeType, this.state ),()=>console.log(this.state.inventor.income.detail.itemGroup)); } )) }  /> : ''
          }
        </Modal>
        <Modal
          header="მიმწოდებელის დამატება"
          visible={this.state.supplier.dialog}
          onHide={() => this.setState(State('supplier.dialog', false, this.state))}
          style={{width: '500px'}}
          footer = {
            <div className="dialog_footer">
              <div className="left_side">&nbsp;</div>
              <Button label="დამატება" className="p-button-info" onClick={()=>{
                let formData = new FormData();
                formData.append('type', this.state.supplier.dropdown.id);
                formData.append('name', this.state.supplier.value);
                formData.append('number', this.state.supplier.number);

                  http.post("/api/secured/Supplier/Insert",formData)
                    .then(result => {
                        if(result.status === 200) {
                          this.setState(State('supplier.dialog', false, this.state));
                          this.setState(State('inventor.income.supplier', {id:this.state.supplier.dropdown.id, name:this.state.supplier.value}, this.state));
                        }else{
                          this.error(result.error);
                        }
                    })
                    .catch(reason => this.error(reason.error) );
              }}/>
              <Button label="დახურვა" className="p-button-secondary" onClick={()=>this.setState(State('supplier.dialog', false, this.state))}/>
            </div>
          }
        >
          <div className="mimwodeblis_tipi">
            <label>აირჩიეთ მიმწოდებლის ტიპი</label>
            <Dropdown value={this.state.supplier.dropdown} options={this.state.supplierList} onChange={(e) => this.setState(State( "supplier.dropdown",{ id: e.value.id, name: e.value.name},this.state))} optionLabel="name"  style={{width:'100%'}} />
            {
              this.state.supplier.dropdown.name !== ''?
                <div style={{display:'flex'}}>
                  <div style={{marginRight: '15px'}}>
                    <label>{(this.state.supplier.dropdown.id === '2' || this.state.supplier.dropdown.id === '3') ? 'სახელი და გვარი': 'დასახელება'}</label>
                    <InputText style={{width: '100%'}} value={this.state.supplier.value} onChange={(e) => this.setState(State('supplier.value',e.target.value,this.state))} />
                  </div>
                  <div>
                    <label>{(this.state.supplier.dropdown.id === '2' || this.state.supplier.dropdown.id === '3') ? 'პირადი ნომერი' : 'საიდენტიფიკაციო'}</label>
                    <InputText style={{width: '100%'}} value={this.state.supplier.number} onChange={(e) => this.setState(State('supplier.number',e.target.value,this.state))} />
                  </div>
                </div>
              :''
            }
          </div>

        </Modal>
      </React.Fragment>
    );
  }
  showSupplierDialog(){
    this.setState(State('supplier.dialog', true, this.state));
    //this.setState(State('supplier.value', '', this.state));
    //this.setState(State('supplier.number', '', this.state));
    this.setState(State('supplier.dropdown', {id:null, name:''}, this.state));
  }
  tabClick(tabID) {
    this.setState(State('tab',tabID,this.state));
    this.onReady(this.eventData);
  }
  getCode(type) {
    http.get("/api/secured/Item/Addon?type=Person/Transfer&subType="+type).then(result => {
      if (result.status === 200) {
        if(type === 'last'){
          this.setState(State('inventor.lastCode',result.data.Right,this.state));
        }else if(type === 'new'){
          this.setState(State('inventor.newCode',result.data.Right,this.state));
        }
      }
    });
  }
  // <editor-fold defaultstate="collapsed" desc="ინვენტარის გაცემა">
  inventorOutcomeTabChange=(e)=>{
    if(this.state.inventor.outcome.tab !== e.index){
      let otcm = {
        dialog: true,
        expand:false,
        date: new Date(),
        tab: 0,
        transPerson: "",
        propertyManagement: "",
        requestPerson: "",
        stockMan: "",
        section: "",
        person: "",
        room: "",
        comment: "",
        files:[],
      };
      this.setState(State('inventor.outcome', otcm, this.state));
      this.setState(State('inventor.requestPersonList', [], this.state));
      this.setState(State('inventor.stockManList', [], this.state));
      this.setState(State('inventor.personality', [], this.state));
      this.setState(State('inventor.transPersonList', [], this.state));
      this.setState(State('inventor.propertyManagementList', [], this.state));
    }
    this.setState(State('inventor.outcome.tab', e.index, this.state));
  };

  onInventorOutcome=()=> {
    console.log(this.state);
    this.setState(State('inventor.outcome.dialog', true, this.state));
    this.setState(State('inventor.outcome.expand', false, this.state));
    this.getCode('last');
  };

  // შენობა ტაბის  ღილაკები
  outcameTab0GenerateOverhead=()=> {
    /*let fields = ['propertyManagement','requestPerson','transPerson'];

    let errors = [];
    for (let f in fields){
      console.log(this.state.inventor.outcome[f]);
      if(this.state.inventor.outcome[f] === ''){
        errors.push(f);
      }
    };

    if(errors.length > 0){
      this.error('გთხოვთ შეავსოთ ყველა ველი');
    }else{
      this.setState(State('inventor.outcome.expand',true,this.state));
      this.getCode('new');
    }*/
    this.setState(State('inventor.outcome.expand',true,this.state));
    this.getCode('new');
  };
  outcameTab0ActiveOverhead=()=> {
    let formData = new FormData();

    formData.append('note', this.state.inventor.outcome.comment);
    formData.append('addon', this.state.inventor.newCode);
    formData.append('trDate',moment(this.state.inventor.outcome.date).format('DD-MM-YYYY'));

    formData.append('fromStock', this.state.tab);
    formData.append('carrierPerson', this.state.inventor.outcome.transPerson.id); // ტრანსპორტ. პასხ. პირი:
    formData.append('toWhomSection', this.state.inventor.outcome.propertyManagement.id); // ქონების მართვა
    formData.append('requestPerson', this.state.inventor.outcome.requestPerson.id); // მომთხოვნი პიროვნება

    formData.append('files', this.state.inventor.outcome.files);
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
    this.setState(State('print.title','ინვენტარის გაცემა',this.state));
    this.setState(State('print.overhead',{
      title:'ქონების მართვის გასავლის ელ. ზედდებული ქ.გ - ',
      lastCode: this.state.inventor.newCode
    },this.state));
    this.setState(State('print.data',{
      'თარიღი': moment(this.state.inventor.outcome.date).format('DD-MM-YYYY'),
      'ქონების მართვა': this.state.inventor.outcome.propertyManagement.name,
      'მომთხოვნი პიროვნება':this.state.inventor.outcome.requestPerson.name,
      'ტრანსპორტ. პასხ. პირი':this.state.inventor.outcome.transPerson.fullName,
      'კომენტარი': this.state.inventor.outcome.comment
    },this.state));

    http.post("/api/secured/Item/Stock/Transfer",formData)
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
  };

  // პიროვნება ტაბის  ღილაკები
  outcameTab1GenerateOverhead=()=> {
    this.setState(State('inventor.outcome.expand',true,this.state));
    this.getCode('new');
  };
  outcameTab1ActiveOverhead=()=> {
    let formData = new FormData();

    formData.append('note', this.state.inventor.outcome.comment);
    formData.append('addon', this.state.inventor.newCode);
    formData.append('trDate',moment(this.state.inventor.outcome.date).format('DD-MM-YYYY'));

    formData.append('fromStock', this.state.tab);
    formData.append('roomId', _.isUndefined(this.state.inventor.outcome.room.id)? '':this.state.inventor.outcome.room.id);
    formData.append('carrierPerson', this.state.inventor.outcome.transPerson.id); // ტრანსპორტ. პასხ. პირი:
    formData.append('toWhomSection', this.state.inventor.outcome.propertyManagement.id); // ქონების მართვა
    formData.append('requestPerson', this.state.inventor.outcome.requestPerson.id); // მომთხოვნი პიროვნება
    formData.append('receiverPerson', this.state.inventor.outcome.person.id); // მიმღები პიროვნება (პიროვნება)

    formData.append('files', this.state.inventor.outcome.files);
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
    this.setState(State('print.title','ინვენტარის გაცემა',this.state));
    this.setState(State('print.overhead',{
      title:'ქონების მართვის გასავლის ელ. ზედდებული ქ.გ - ',
      lastCode: this.state.inventor.newCode
    },this.state));
    this.setState(State('print.data',{
      'თარიღი': moment(this.state.inventor.outcome.date).format('DD-MM-YYYY'),
      'პიროვნება': this.state.inventor.outcome.person.fullname,
      'ქონების მართვა':this.state.inventor.outcome.propertyManagement.name,
      'სექცია':this.state.inventor.outcome.room.name,
      'ტრანსპორტირების პასხ. პირი':this.state.inventor.outcome.transPerson.fullName,
      'მომთხოვნი პიროვნება':this.state.inventor.outcome.requestPerson.fullName,
      'კომენტარი': this.state.inventor.outcome.comment
    },this.state));

    http.post("/api/secured/Item/Stock/Transfer",formData)
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
  };
  // </editor-fold>
  // <editor-fold defaultstate="collapsed" desc="ზედნადებით მიღება">
  onOverheadIncome=()=> {
    this.setState(State('inventor.overhead.dialog', true, this.state));
    //this.setState(State('inventor.outcome.expand', false, this.state));
    this.getCode('last');
  };


  // </editor-fold>
  warehouseManagement = (id) => {
    http.get("/api/secured/Staff/Filter/ByStock?stockId=" + id).then(result => {
      if (result.status === 200) {
        this.setState(State('inventor.stockManList',_.map(result.data,(value)=> {
          return {id:value.id, name:value.fullname}
        }), this.state));
      }else{
        this.error(result.error);
      }
    });
  };
  propertyManagement = () => {
    http.get("/api/secured/Staff/Filter/ByProperty?name=")
      .then(result => {
        if (result.status === 200) {
          this.setState(State('inventor.propertyManagementList', _.map(result.data,(value) =>{
            return {id:value.id, name:value.fullname}
          }), this.state));
        }
      })
      .catch(reason => this.error(reason.error) );
  };
  transPersonList(e){
    http.get("/api/secured/Staff/Filter/ByName/V2?name="+e)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('inventor.transPersonList',_.map(result.data,(value)=>{
            return {id:value.id, name:value.fullname, fullName: value.fullname}
          }), this.state));
        } else {
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
          this.setState(State('inventor.requestPersonList', _.map(result.data,(value) =>{
            return {id:value.id, name:value.fullname, fullName: value.fullname}
          }), this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  }
  inverseWarehouseManagement = (id) => {
    http.get("/api/secured/Staff/Filter/ByStock?stockId=" + id)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('inventor.stockManList',_.map(result.data,(value)=> {
            return {id:value.id, name:value.fullname}
          }), this.state));
        }
      });
  };
  Person=(event)=>{
    this.setState(State('inventor.personality', [], this.state));
    http.get("/api/secured/Staff/Filter/ByName/V2?name=" + event)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('inventor.personality', result.data, this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  };
  personRoom =(id)=>{
    http.get("/api/secured/Item/Building/Rooms?receiverPerson=" + id)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('inventor.roomList',_.map(result.data,(value)=>{
            return {id:value.id,name:value.name}
          }), this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  };
  resetModalParam(modal){
    if(modal !== 'print') {
      this.setState(State('inventor.' + modal + '.dialog', false, this.state));
      this.setState(State('inventor.' + modal + '.expand', false, this.state));
      this.setState(State('inventor.' + modal + '.date', new Date(), this.state));
      this.setState(State('inventor.' + modal + '.comment', '', this.state));
      this.setState(State('inventor.' + modal + '.files', [], this.state));
    }

    this.setState(State('inventor.personality',[],this.state));
    this.setState(State('inventor.roomList',[],this.state));
    this.setState(State('inventor.stockManList',[],this.state));
    this.setState(State('inventor.propertyManagementList',[],this.state));
    this.setState(State('inventor.transPersonList',[],this.state));
    this.setState(State('inventor.requestPersonList',[],this.state));

    if(modal === 'transfer') {
      this.setState(State('inventor.'+modal+'.transPerson','',this.state));
      this.setState(State('inventor.'+modal+'.propertyManagement','',this.state));
      this.setState(State('inventor.'+modal+'.section','',this.state));
    }
    if(modal === 'outcome') {
      this.setState(State('inventor.'+modal+'.transPerson','',this.state));
      this.setState(State('inventor.'+modal+'.propertyManagement','',this.state));
      this.setState(State('inventor.'+modal+'.requestPerson','',this.state));
      this.setState(State('inventor.'+modal+'.person','',this.state));
      this.setState(State('inventor.'+modal+'.tab',0,this.state));
    }
    if(modal === 'overhead'){
      let overhead = {
        dialog: false,
          expand: false,
          qr: "",

          checked1: true,
          checked2: true,
          checked3: true,
          checked4: false,
          checked5: false,
          checked6: false,

          createDate: {
          checked:false,
            date1: new Date(),
            date2: new Date(),
        },
        transDate: {
          checked:false,
            date1: new Date(),
            date2: new Date(),
        },
        deliveryDate: {
          checked:false,
            date1: new Date(),
            date2: new Date(),
        },
        closeDate: {
          checked:false,
            date1: new Date(),
            date2: new Date(),
        },
        comment: {
          checked:false,
            text: "",
        },
        driver: {
          checked:false,
            text: "",
        },
        car: {
          checked:false,
            text: "",
        },
        supplier: {
          checked:false,
            text: "",
        },
        zednadebi: {
          checked:false,
            text: "",
        },
        zeddebuli: {
          checked:false,
            text: "",
        }
      }
      this.setState(State('inventor.'+modal,overhead,this.state));
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



  transferActiveOverhead=()=> {
    let formData = new FormData();

    formData.append('note', this.state.inventor.transfer.comment);
    formData.append('addon', this.state.inventor.newCode);
    formData.append('trDate',moment(this.state.inventor.transfer.date).format('DD-MM-YYYY'));

    formData.append('carrierPerson', this.state.inventor.transfer.transPerson.id); // ტრანსპორტ. პასხ. პირი:
    formData.append('toWhomStock', this.state.inventor.transfer.propertyManagement.id); // ქონების მართვა
    formData.append('fromStock', this.state.tab);

    formData.append('files', this.state.inventor.transfer.files);
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
      lastCode: this.state.inventor.newCode
    },this.state));
    this.setState(State('print.data',{
      'თარიღი': moment(this.state.inventor.transfer.date).format('DD-MM-YYYY'),
      'სექცია': this.state.inventor.transfer.section.name,
      'ქონების მართვა':this.state.inventor.transfer.propertyManagement.name,
      'ტრანსპორტ. პასხ. პირი':this.state.inventor.transfer.transPerson.fullName,
      'კომენტარი': this.state.inventor.transfer.comment
    },this.state));

    http.post("/api/secured/Item/Stock/Change",formData)
      .then(result => {
        if (result.status === 200) {
          this.removeCartItem();
          this.resetModalParam('transfer');
          this.onReady(this.eventData);
          this.setState(State('print.text','ოპერაცია წარმატებით შესრულდა! გნებავთ ზედდებულის ბეჭდვა?',this.state));
          this.setState(State('print.modal',true,this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  }

  transferGenerateOverheadAB() {
    this.getCode('new');

    //this.setState(State('inventor.transfer.dialog',true,this.state));
    this.setState(State('inventor.transfer.expand',true,this.state));
    //this.getCode('last');
  }

  transferGenerateOverhead() {
    this.getCode('new');

    let formData= new FormData();
    let st = this.state.inventor.overhead;

    let itypes = [];
    for (let i = 1; i <= 6; i++) {
      if(st['checked'+i]){
        itypes.push(i);
      }
    }

    if(st.driver.checked){
      formData.append('driver_tin',st.driver.text);
    }
    if(st.car.checked){
      formData.append('car_number',st.car.text);
    }
    if(st.supplier.checked){
      formData.append('seller_tin',st.supplier.text);
    }
    if(st.comment.checked){
      formData.append('comment',st.comment.text);
    }
    if(st.zednadebi.checked){
      formData.append('waybill_number',st.zednadebi.text);
    }
    if(st.zeddebuli.checked){
      formData.append('full_amount',st.zeddebuli.text);
    }

    if(st.transDate.checked){
      formData.append('begin_date_s',moment(st.transDate.date1).format('DD-MM-YYYY'));
      formData.append('begin_date_e',moment(st.transDate.date2).format('DD-MM-YYYY'));
    }
    if(st.createDate.checked){
      formData.append('create_date_s',moment(st.createDate.date1).format('DD-MM-YYYY'));
      formData.append('create_date_e',moment(st.createDate.date2).format('DD-MM-YYYY'));
    }
    if(st.deliveryDate.checked){
      formData.append('delivery_date_s',moment(st.deliveryDate.date1).format('DD-MM-YYYY'));
      formData.append('delivery_date_e',moment(st.deliveryDate.date1).format('DD-MM-YYYY'));
    }
    if(st.closeDate.checked){
      formData.append('close_date_s',moment(st.closeDate.date1).format('DD-MM-YYYY'));
      formData.append('close_date_e',moment(st.closeDate.date1).format('DD-MM-YYYY'));
    }

    formData.append('itypes',_.join(itypes,','));


    http.post('/api/secured/Rs/getBuyerWaybillsEx',formData)
      .then(result => {
        if(result.status===200){
          this.setState(State('inventor.overhead.buyerWaybillsEx', result.data, this.state),
            ()=>    this.setState(State('inventor.overhead.expand',true,this.state)));
          //this.onGridReady(this.eventData);
          console.log(this.state.inventor.overhead)
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  };
  onTransfer = (event) => {
    this.setState(State('inventor.transfer.dialog',true,this.state));
    this.setState(State('inventor.transfer.expend',false,this.state));
    this.getCode('last');
  };
  suggestSupplier = (event) => {
    this.setState(State('inventor.supplierSuggestions', [], this.state));
    http.get("/api/secured/Supplier/Filter?query=" + event)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('inventor.supplierSuggestions', result.data, this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  };
  suggestItem = (event) => {
    this.setState(State('inventor.itemSuggestions', [], this.state));
    http.get("/api/secured/Item/Filter/ByName?str=" + event)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('inventor.itemSuggestions', result.data, this.state));
        }
      })
  };
  suggestMaker = (event) => {
    this.setState(State('inventor.makerSuggestions', [], this.state));
    http.get("/api/secured/List/Maker/Filter?query=" + event)
      .then(result => {
        if (result.status === 200) {
          this.setState(State('inventor.makerSuggestions', result.data, this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  };
  suggestModel = (event) => {
    this.setState(State('inventor.modelSuggestions', [], this.state));
    http.get("/api/secured/List/Model/Filter?query="+event+"&parent=" + this.state.inventor.income.detail.maker.id )
      .then(result => {
        if (result.status === 200) {
          this.setState(State('inventor.modelSuggestions', result.data, this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
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
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error))
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

  removeItemFromCart = (tab, key) => {
    removeCartItem({"globalKey": tab, "key": key, "value": "key"})
      .then(result => {

        this.getCartItems().then(()=>{
          this.onGridReady(this.eventData)
        })
      })
      .then()
  };

  loadConstructor = async () => {
    this.getStockData();
    this.loadInventorData();
  };
  getCartItems = async () => {
    await getCartItems({'globalKey': this.state.tab})
      .then(result => {
        (_.isUndefined(result)) ? this.setState(State('cart.tab' + this.state.tab, [], this.state)) : this.setState(State('cart.tab' + this.state.tab, result, this.state));
      })
      .catch(reason => this.error(reason.error))
  };
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
    const validate = await Validator(['itemGroup','item', 'type', 'status', 'count','measureUnit'], this.state.inventor.income.detail,'name');
    if(_.size(validate)>0){
      _.forEach(validate, val => {
        this.setState(State('inventor.income.errors.' + val, true, this.state));
      });
      return;
    }
    this.getFreeCodes();
    this.getAddon('type=Stock/Income&subType=last').then(result => {
      this.setState(State('inventor.income.addon', result.data, this.state),()=>console.log(this.state));
    })
    this.getAddon('type=Stock/Income&subType=').then(result => {
      this.setState(State('inventor.income.tempAddon', result.data, this.state),()=>console.log(this.state));
    })
  };
  onInventorEditExpand=async ()=>{
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
    const validate = await Validator(['itemGroup','item', 'type', 'status', 'count','measureUnit'], this.state.inventor.selected,'name');
    if(_.size(validate)>0){
      _.forEach(validate, val => {
        this.setState(State('inventor.income.errors.' + val, true, this.state));
      });
      return;
    }
    this.getEditFreeCodes();
    /*this.getAddon('type=Stock/Income&subType=last').then(result => {
      this.setState(State('inventor.selected.addon', result.data, this.state),()=>console.log(this.state));
    })
    this.getAddon('type=Stock/Income&subType=').then(result => {
      this.setState(State('inventor.selected.tempAddon', result.data, this.state),()=>console.log(this.state));
    })*/
  }
  getAddon = (params) => {
    return http.get("/api/secured/Item/Addon?"+params);
  };
  getEditFreeCodes = () => {
    let formData = new FormData();
    if(!_.isNull(this.state.inventor.selected.file)){
      formData.append('file', this.state.inventor.selected.file);
    }
    const barcode = (this.state.inventor.selected.barCodeType.id) ? this.state.inventor.selected.barCodeType.id : '';
    http.post("/api/secured/List/BarCode/Get/Updated/FreeCodes?barCodeType=" + barcode
      +"&start="+this.state.inventor.selected.barCode
      + "&count=" + this.state.inventor.selected.count
      +"&itemGroup="+this.state.inventor.selected.itemGroup.id
      +"&itemId="+this.state.inventor.selected.id,formData)
      .then(result => {
        if(result.status === 200){
          this.setState(State('inventor.selected.expand', true, this.state));
          this.setState(State("inventor.selected.list", _.map(result.data, value => {
            return {
              "car": { number: this.state.inventor.selected.car.number, year: this.state.inventor.selected.car.year, vin:this.state.inventor.selected.factoryNumber  },
              "barCodeName": value.barCodeItem.value,
              "barCode": value.barCodeItem.barCodeVisualValue,
              "serialNumber": this.state.inventor.selected.factoryNumber,
              "amount": value.amount
            }
          }), this.state));
        }else{
          this.error(result.error)
        }
      })
      .catch(reason => this.error(reason.error) );
  };
  getFreeCodes = () => {
    this.setState(State('inventor.income.detail.expand', true, this.state));
    let formData = new FormData();
    if(!_.isNull(this.state.inventor.income.detail.file)){
      formData.append('file', this.state.inventor.income.detail.file);
    }
    const barcode = (this.state.inventor.income.detail.barCodeType.id) ? this.state.inventor.income.detail.barCodeType.id : '';

    http.post("/api/secured/List/BarCode/Get/FreeCodes?barCodeType=" + barcode + "&count=" + this.state.inventor.income.detail.count+"&itemGroup="+this.state.inventor.income.detail.itemGroup.id,formData)
      .then(result => {
        if(result.status === 200){
          this.setState(State("inventor.income.detail.list", _.map(result.data, value => {
            return {
              "car": { number: this.state.inventor.income.detail.car.number, year: this.state.inventor.income.detail.car.year, vin:this.state.inventor.income.detail.factoryNumber  },
              "barCodeName": value.barCodeItem.value,
              "barCode": value.barCodeItem.barCodeVisualValue,
              "serialNumber": this.state.inventor.income.detail.factoryNumber,
              "amount": value.amount
            }
          }), this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  };
  lastbarCode=(type)=> {
    console.log(type);
    type['id'] = (_.isUndefined(type.id) || _.isNull(type.id) )? '': type.id;
    http.get("/api/secured/List/BarCode/Get/LastCode?barCodeType="+type.id)
      .then(result => {
        if(result.status === 200) {
          this.setState(State('inventor.income.detail.lastbarCode', result.data, this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  }
  onSaveDetail=()=>{
    let data= this.state.inventor.income.data;

    this.setState(State('inventor.itemSuggestions', [], this.state));
    this.setState(State('inventor.makerSuggestions', [], this.state));
    this.setState(State('inventor.modelSuggestions', [], this.state));
    let formData= new FormData();
    //console.log(this.state.inventor.income.detail.barCodeType)

    formData.append('data', JSON.stringify({
      name: this.state.inventor.income.detail.item.name,
      list: this.state.inventor.income.detail.list,
      selectedMaker: this.state.inventor.income.detail.maker,
      selectedModel: this.state.inventor.income.detail.model,
      amount: this.state.inventor.income.detail.count,
      price: this.state.inventor.income.detail.price,
      barCodeType: (this.state.inventor.income.detail.barCodeType.id)? this.state.inventor.income.detail.barCodeType.id: "",
      barCode: this.state.inventor.income.detail.barCode,
      factoryNumber: this.state.inventor.income.detail.factoryNumber,
      measureUnit: this.state.inventor.income.detail.measureUnit.id,
      itemGroup: this.state.inventor.income.detail.itemGroup.id,
      selectedItemType: this.state.inventor.income.detail.type,
      status: this.state.inventor.income.detail.status.id
    }));
    http.post('/api/secured/Item/PreInsert/Add',formData)
      .then(result => {
        if(result.status===200){
          if(!this.state.inventor.income.detail.edit){
            data.push(this.state.inventor.income.detail);
          }
          this.onGridReady(this.eventData);
          this.setState(State("inventor.income.data", data, this.state),
            () =>{
              this.setState(State('inventor.income.detail.dialog', false, this.state),
                () => this.resetDetail())
            });
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  };


  onSaveEditDetail=()=>{
    let data= [];
    this.setState(State('inventor.itemSuggestions', [], this.state));
    this.setState(State('inventor.makerSuggestions', [], this.state));
    this.setState(State('inventor.modelSuggestions', [], this.state));
    let formData= new FormData();

    formData.append('data', JSON.stringify({
      name: this.state.inventor.selected.item.name,
      list: this.state.inventor.selected.list,
      selectedMaker: this.state.inventor.selected.maker,
      selectedModel: this.state.inventor.selected.model,
      amount: this.state.inventor.selected.count,
      price: this.state.inventor.selected.price,
      barCodeType: (this.state.inventor.selected.barCodeType.id)? this.state.inventor.selected.barCodeType.id: "",
      barCode: this.state.inventor.selected.barCode,
      factoryNumber: this.state.inventor.selected.factoryNumber,
      measureUnit: this.state.inventor.selected.measureUnit.id,
      itemGroup: this.state.inventor.selected.itemGroup.id,
      selectedItemType: this.state.inventor.selected.type,
      status: this.state.inventor.selected.status.id
    }));
    http.post('/api/secured/Item/Update?id='+this.state.inventor.selected.id,formData)
      .then(result => {
        if(result.status===200){
          this.onGridReady(this.eventData);
          data.push(this.state.inventor.selected);
          this.setState(State("inventor.selected.data", data, this.state),
            () =>{
              this.setState(State('inventor.selected.dialog', false, this.state),
                () => { this.resetInventor();this.gridApi.deselectAll() ;})
            });
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  }
  parseInventorDetailData = (data) => {
    this.setState(State('inventor.income.detail.maker', (data.maker) ? data.maker : {id: null, name: ""}, this.state));

    if(data.barCodeType){
      this.setState(State('inventor.income.detail.barCodeType', {
        id: data['barCodeType']['id'],
        name: data['barCodeType']['name']
      }, this.state));
    }

    this.setState(State('inventor.income.detail.measureUnit', {
      id: data.measureUnit['id'],
      name: data.measureUnit['name']
    }, this.state));
    this.setState(State('inventor.income.detail.itemGroup', data.itemGroup, this.state));
    this.setState(State('inventor.income.detail.type', data.itemType, this.state));
    this.setState(State('inventor.income.detail.status', data.itemStatus, this.state));
    this.setState(State('inventor.income.detail.price', data.price, this.state));
    this.setState(State('inventor.income.detail.count', data.inStock, this.state));
    this.setState(State('inventor.income.detail.factoryNumber', data.factoryNumber, this.state));

    console.log(data,this.state.inventor.income.detail);
    return;
    this.lastbarCode(this.state.inventor.income.detail.barCodeType);
  };
  resetInventor=()=>{
    this.setState(State('inventor',
      {
        income: {
          dialog: false,
          showDetails: false,
          date: new Date(),
          supplier: {id:null,name:''},
          comment:"",
          addon: {Left: '', Right: ''},
          tempAddon: {Left: '', Right: ''},
          invoice: '',
          inspectionNumber:'',
          detail: {
            file: null,
            expand:false,
            dialog: false,
            overhead: true,
            edit: false,
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
            comment:'',
            car: {
              number:"",
              year:"",
              vin:""
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
        selected:  {
          id:'',
          file: null,
          expand:false,
          dialog: false,
          edit: false,
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
          data: [],
          comment:'',
          car: {
            number:"",
            year:"",
            vin:""
          },
          numbers:{
            from:"",
            to: ""
          }
        },
        outcome: {
          dialog: false,
          expand:false,
          date: new Date(),
          tab: 0,
          transPerson: "",
          propertyManagement: "",
          requestPerson: "",
          stockMan: "",
          section: "",
          room: "",
          person: "",
          comment: "",
          files:[],
        },
        transfer: {
          date: new Date(),
          dialog: false,
          expand: false,
          comment: "",
          transPerson: "",
          propertyManagement: "",
          section: "",
          files:[],
        },
        overhead: {
          dialog: false,
          expand: false,
          qr: "",

          checked1: true,
          checked2: true,
          checked3: true,
          checked4: false,
          checked5: false,
          checked6: false,

          createDate: {
            checked:false,
            date1: new Date(),
            date2: new Date(),
          },
          transDate: {
            checked:false,
            date1: new Date(),
            date2: new Date(),
          },
          deliveryDate: {
            checked:false,
            date1: new Date(),
            date2: new Date(),
          },
          closeDate: {
            checked:false,
            date1: new Date(),
            date2: new Date(),
          },
          comment: {
            checked:false,
            text: "",
          },
          driver: {
            checked:false,
            text: "",
          },
          car: {
            checked:false,
            text: "",
          },
          supplier: {
            checked:false,
            text: "",
          },
          zednadebi: {
            checked:false,
            text: "",
          },
          zeddebuli: {
            checked:false,
            text: "",
          },
          buyerWaybillsEx:[]
        },
        search: {
          show: false,
          dialog: false,
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
            inspectionNumber:""
          }
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
        modelSuggestions: [],

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
  resetIncome=()=>{
    this.setState(State('inventor.income',
      {
        dialog: false,
        showDetails: false,
        date: new Date(),
        supplier: {id:null,name:''},
        comment:"",
        addon: {Left: '', Right: ''},
        tempAddon: {Left: '', Right: ''},
        invoice: '',
        inspectionNumber:'',
        detail: {
          file: null,
          expand:false,
          dialog: false,
          overhead: true,
          edit: false,
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
          comment:'',
          car: {
            number:"",
            year:"",
            vin:""
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
      },this.state))
  }
  generateInventor = async () => {
    const validate = Validator(['supplier'], this.state.inventor.income,'id');
    console.log(validate)
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
      overhead: true,
      edit: false,
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
      comment:'',
      car: {
        number:"",
        year:"",
        vin:""
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
    formData.append('invoiceAddon', this.state.inventor.income.tempAddon.Right);
    formData.append('data', JSON.stringify(_.map(this.state.inventor.income.data, value => {
      return {
        govNumber:value.car.number,
        pYear:value.car.year,
        fromN:value.numbers.from,
        toN:value.numbers.to,
        note:value.comment,
        name: value.item.name,
        list: value.list,
        selectedMaker: value.maker,
        selectedModel: value.model,
        amount: value.count,
        price: value.price,
        barCodeType: value.barCodeType.id,
        barCode: value.barCode,
        factoryNumber: value.factoryNumber || value.car.vin,
        measureUnit: value.measureUnit.id,
        itemGroup: value.itemGroup.id,
        selectedItemType: value.type,
        status: value.status.id
      }
    })));

    // prepear print data
    this.setState(State('print.cart.tab'+this.state.tab,this.state.cart['tab'+this.state.tab],this.state));
    this.setState(State('print.title','ინვენტარის მიღება',this.state));
    this.setState(State('print.overhead',{
      title:'საწყობის შემოსავლის ელ. ზედდებული № '+ this.state.inventor.income.tempAddon.Left+' - ',
      lastCode: this.state.inventor.income.tempAddon.Right
    },this.state));
    this.setState(State('print.data',{
      'თარიღი': moment(this.state.inventor.income.date).format('DD-MM-YYYY'),
      'მიმწოდებელი': this.state.inventor.income.supplier.name,
      'სასაქონლო ზედნადები':this.state.inventor.income.invoice,
      'მიღება ჩაბარების აქტი':this.state.inventor.income.inspectionNumber,
      'კომენტარი': this.state.inventor.income.comment
    },this.state));

    http.post('/api/secured/Item/Insert',formData)
      .then(result => {
        if(result.status ===200) {
          this.setState(State('inventor.income.dialog', false, this.state));
          this.onGridReady(this.eventData);
          this.setState(State('print.text','ოპერაცია წარმატებით შესრულდა! გნებავთ ზედდებულის ბეჭდვა?',this.state));
          this.setState(State('print.modal',true,this.state));
        }else{
          this.error(result.error);
        }
      })
      .catch(reason => this.error(reason.error) );
  }
  onSelectionChanged = () => {

    const selectedRows = this.gridApi.getSelectedRows()[0];
    if(selectedRows){
      this.setState(State('inventor.selected',
        {
          id: selectedRows.id,
          file: null,
          expand: false,
          overhead:false,
          amount:selectedRows.amount,
          dialog: false,
          itemGroup: selectedRows.itemGroup,
          item: {name: selectedRows.name || '', id: selectedRows.id || ''},
          maker: selectedRows.maker||{id:'',name:''},
          model: selectedRows.model||{id:'',name:''},
          measureUnit: {name: selectedRows.measureUnit.name || '', id: selectedRows.measureUnit.id || ''},
          type: selectedRows.itemType,
          status: selectedRows.itemStatus,
          count: selectedRows.count,
          price: selectedRows.price,
          barCodeType: (selectedRows.barCodeType) ? {
            name: selectedRows.barCodeType.name || '',
            id: selectedRows.barCodeType.id || ''
          } : {id: '', name: ''},
          barCode: '',
          factoryNumber: selectedRows.factoryNumber,
          files: [],
          lastbarCode: selectedRows.barCodeType,
          list: [],
          comment: selectedRows.comment,
          car: {
            number: selectedRows.govNumber,
            year: selectedRows.pYear,
            vin: selectedRows.factoryNumber
          },
          numbers: {
            from: selectedRows.fromN,
            to: selectedRows.toN
          }
        }
        , this.state))
    }

  };
  onUpdate=()=>{
    const data = {
      govNumber: this.state.inventor.selected.car.number,
      pYear: this.state.inventor.selected.car.year,
      fromN: this.state.inventor.selected.numbers.from,
      toN: this.state.inventor.selected.numbers.to,
      note: this.state.inventor.selected.comment,
      name: this.state.inventor.selected.item.name,
      list: this.state.inventor.selected.list,
      selectedMaker: this.state.inventor.selected.maker? {id:this.state.inventor.selected.maker.id , name: this.state.inventor.selected.maker.name}:{id:'',name:''},
      selectedModel: this.state.inventor.selected.model?{id:this.state.inventor.selected.model.id , name: this.state.inventor.selected.model.name }:{id:'',name:''},
      amount: this.state.inventor.selected.count,
      price: this.state.inventor.selected.price,
      barCodeType: this.state.inventor.selected.barCodeType.id,
      barCode: this.state.inventor.selected.barCode,
      factoryNumber: this.state.inventor.selected.factoryNumber || this.state.inventor.selected.car.vin,
      measureUnit: this.state.inventor.selected.measureUnit.id,
      itemGroup: this.state.inventor.selected.itemGroup.id,
      selectedItemType: this.state.inventor.selected.type,
      status: this.state.inventor.selected.status.id
    };
    let formData  =  new FormData();
    formData.append("id",this.state.inventor.selected.id);
    formData.append("data", JSON.stringify(data));
    http.post("/api/secured/Item/Update",formData)
      .then(result=>{
        if(result.status === 200){
          console.log(result)
        }else{
          this.error(result.error)
        }
      })
      .catch(reason => this.error(reason.error))
  };
  edit=()=> {
    if(this.state.inventor.selected.id){
      http.post("/api/secured/Item/select_update?id="+this.state.inventor.selected.id)
        .then(response=>{
          if(response.status === 200){
            this.setState(State('inventor.selected.amount', response.data.amount,this.state));
            this.setState(State('inventor.selected.count', response.data.amount,this.state));
            this.setState(State('inventor.selected.dialog', true,this.state));

          }else{
            this.error(response.error)
          }
        })
        .catch(reason => this.error(reason.error))

    }

    //this.setState(State('inventor.selected.dialog',true,this.state))
  }
  cartDialog=()=> {
    this.setState(State('cart.dialog',true,this.state))
  }
}

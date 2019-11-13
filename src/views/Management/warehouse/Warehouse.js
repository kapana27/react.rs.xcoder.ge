import React, { Component } from 'react';
import http from  '../../../api/http';
import {Config} from "../../../config/Config";
import {CardCellRenderer, Modal, Calendar, AutoComplete, FileUploader, Cart, TreeTableGroup, Search} from '../../components'
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
export default class Warehouse extends Component {
  constructor(props){
    super(props);
    this.state={
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
      inventor:{
        income:{
          dialog: false,
          date: new Date(),
          supplier:"",
          detail:{
            dialog: false,
            itemGroup: { name:''}
          }
        },
        outcome:{
          dialog: false
        },
        transfer:{
          date: new Date(),
          dialog: false
        },
        search:{
          dialog: false
        },
        supplierSuggestions:[],
        barCodes:[],
        measureUnitList:[],
        itemGroup:{
          dialog: false,
          data:{}
        },
        itemTypes:[],
        itemStatus:[],
        stock:[],
      },
      tab: 11,
      cart:{
        tab11:[],
        tab12:[],
        dialog:false
      }
    }
    this.loadConstructor();

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
    const cartItems = this.cartItems;
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
              //v['inCart'] = (cartItems.indexOf(v['id'].toString()) > -1);
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
      this.setState(State("inventor.itemGroup.data", data, this.state),()=>console.log(this.state));
    });
  };
  onReady = (params) => {
      this.getCartItems().then(()=>{
        this.onGridReady(params)
      })
  };
  render() {


    return (
      <React.Fragment >
        <div className="actionButton">
          <div className="buttonBox" style={{width: '150px'}}>
            <Button label="A" icon="pi pi-home" />
            <Button label="B" icon="pi pi-home" />
          </div>
          <div className="buttonBox">
            <Button label="ინვ.მიღება" icon="pi pi-plus" onClick={()=>this.onInventorIncome()}/>
            <Button label="ძედ.მიღება" icon="pi pi-plus" />
            <Button label="რედაქტირება" icon="pi pi-pencil" />
          </div>
          <div className="buttonBox">
            <Button label="ინვ.გაცემა" icon="pi pi-arrow-up" className="p-button-danger" onClick={()=>this.setState(State('inventor.outcome.dialog',true,this.state))}/>
            <Button label="მოძრაობა A-B"  className="ui-button-raised arrow-icon" onClick={()=>this.setState(State('inventor.transfer.dialog',true,this.state))}/>
            <Button label="ძებნა" icon="pi pi-search"  onClick={()=>this.setState(State('inventor.search.dialog',true,this.state))}/>
            <i className="fa fa-cart-plus fa-lg " onClick={()=>this.setState(State('cart.dialog',true,this.state))} style={{fontSize: '32px', marginRight: '12', color: '#007ad9', cursor:'pointer'}}/><sup>{_.size(this.state.cart['tab'+this.state.tab])}</sup>
          </div>
        </div>
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
        <Modal header="ინვენტარის მიღება" visible={this.state.inventor.income.detail.dialog} onHide={()=>this.setState(State('inventor.income.detail.dialog',false,this.state))} style={{width:'1200px'}}>
          <div className="incomeModal p-grid">
            <div className="fullwidth p-col-2">
              <label>დასახელება</label>
              <InputText type="text" placeholder="დასახელება" />
            </div>
            <div className="fullwidth p-col-2">
              <label>მარკა</label>
              <InputText type="text" placeholder="დასახელება" />
            </div>
            <div className="fullwidth p-col-2">
              <label>მოდელი</label>
              <InputText type="text" placeholder="დასახელება" />
            </div>
            <div className="fullwidth p-col-2">
              <label>რაოდენობა</label>
              <InputText type="text" placeholder="დასახელება" />
            </div>
            <div className="fullwidth p-col-2">
              <label>ერთეულის ფასი</label>
              <InputText type="text" placeholder="დასახელება" />
            </div>
            <div className="fullwidth p-col-2">
              <label>სულ ფასი:</label>
              <InputText type="text" placeholder="დასახელება" />
            </div>


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
              <div className="p-inputgroup">
                <InputText placeholder="საქონლის ჯგუფი" value={this.state.inventor.income.detail.itemGroup.name} disabled/>
                <Button icon="pi pi-align-justify" className="p-button-info" style={{left: '-10px'}} onClick={()=>this.setState(State('inventor.itemGroup.dialog',true,this.state))}/>
              </div>
            </div>
            <div className="fullwidth p-col-2">
              <label>ინვენტარის ტიპი</label>
              <Dropdown optionLabel="name" />
            </div>
            <div className="fullwidth p-col-2">
              <label>ინვენტარის სტატუსი</label>
              <Dropdown optionLabel="name" />
            </div>
            <div className="fullwidth p-col-12">
                <FileUploader onUpload={files=>console.log(files)}/>
            </div>
          </div>
        </Modal>
        <Modal header="ინვენტარის მიღება" visible={this.state.inventor.income.dialog} onHide={()=>this.setState(State('inventor.income.dialog',false,this.state))} style={{width:'1200px'}} >
          <div className="incomeModal p-grid">
            <div className="fullwidth p-col-3">
              <label>მიღების თარიღი</label>
              <Calendar date={this.state.inventor.income.date} onDateChange={props=>this.setState(State('inventor.income.date',props,this.state)) } />
            </div>
            <div className="fullwidth p-col-3">
              <label>მიმწოდებელი</label>
              <AutoComplete
                field="generatedName"
                suggestions={this.state.inventor.supplierSuggestions}
                onComplete={this.suggestSupplier}
                onSelect={(e)=>this.setState(State('inventor.income.supplier',e,this.state))}
                onChange={(e) => this.setState(State('inventor.income.supplier',e,this.state))}
                value={this.state.inventor.income.supplier}
              />
            </div>
            <div className="fullwidth p-col-3">
              <label>სასაქონლო ზედნადები</label>
              <InputText type="text" />
            </div>
            <div className="fullwidth p-col-3">
              <label>ინსპექტირების დასკვნის ნომერი</label>
              <InputText type="text" />
            </div>
            <div className="fullwidth p-col-12">
              <label>კომენტარი</label>
              <InputTextarea rows={1} />
              <Button label="დამატება" icon="pi pi-plus" onClick={()=>this.setState(State('inventor.income.detail.dialog',true,this.state))} />
            </div>
          </div>

          <div className="incomeAddedTable">
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
                <th width="30px"><span></span></th>
              </tr>
              </thead>
              <tbody>
                <tr>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34</td>
                </tr>
                <tr>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34</td>
                </tr>
                <tr>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34</td>
                </tr>
                <tr>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34</td>
                </tr>
                <tr>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34</td>
                </tr>
                <tr>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34 4</td>
                  <td>34</td>
                </tr>


              </tbody>
            </table>
          </div>

        </Modal>

        <Modal header="ინვენტარის გაცემა" visible={this.state.inventor.outcome.dialog} onHide={()=>this.setState(State('inventor.outcome.dialog',false,this.state))} style={{width:'900px'}}>
          <TabView renderActiveOnly={false}>
            <TabPanel header="შენობა">
              <div className="incomeModal p-grid">
                <div className="fullwidth p-col-8">
                  <div className="p-grid">
                    <div className="fullwidth p-col-6">
                      <label>თარიღი</label>
                      <InputText type="text" placeholder="თარიღი" />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>ქონების მართვა</label>
                      <InputText type="text" placeholder="ქონების მართვა" />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>მომთხოვნი პიროვნება</label>
                      <InputText type="text" placeholder="მომთხოვნი პიროვნება" />
                    </div>
                    <div className="fullwidth p-col-6">
                      <label>ტრანსპორტირების პასხ. პირი</label>
                      <InputText type="text" placeholder="ტრანსპორტირების პასხ. პირი" />
                    </div>
                  </div>
                </div>
                <div className="fullwidth p-col-4">
                  <label>კომენტარი</label>
                  <InputTextarea rows={4} placeholder="შენიშვნა" style={{width:'100%', minHeight:'100px'}} />
                </div>
              </div>
            </TabPanel>
            <TabPanel header="პიროვნება">
              <div className="incomeModal p-grid">
                <div className="fullwidth p-col-4">
                  <label>თარიღი</label>
                  <InputText type="text" placeholder="თარიღი" />
                </div>
                <div className="fullwidth p-col-4">
                  <label>პიროვნება</label>
                  <InputText type="text" placeholder="პიროვნება" />
                </div>
                <div className="fullwidth p-col-4">
                  <label>ქონების მართვა</label>
                  <InputText type="text" placeholder="ქონების მართვა" />
                </div>
                <div className="fullwidth p-col-4">
                  <label>სექცია</label>
                  <Dropdown optionLabel="name" placeholder="სექცია" style={{width:'100%'}} />
                </div>
                <div className="fullwidth p-col-4">
                  <label>ტრანსპორტირების პასხ. პირი</label>
                  <InputText type="text" placeholder="ტრანსპორტირების პასხ. პირი" />
                </div>
                <div className="fullwidth p-col-4">
                  <label>მომთხოვნი პიროვნება</label>
                  <InputText type="text" placeholder="მომთხოვნი პიროვნება" />
                </div>
                <div className="fullwidth p-col-12">
                  <label>კომენტარი</label>
                  <InputTextarea rows={1} placeholder="შენიშვნა" style={{width:'100%'}} />
                </div>
              </div>
            </TabPanel>
          </TabView>
          <Cart data={this.state.cart['tab'+this.state.tab]}/>
        </Modal>
        <Modal header="ინვენტარის მოძრაობა სექციებს შორის" visible={this.state.inventor.transfer.dialog} onHide={()=>this.setState(State('inventor.transfer.dialog',false,this.state))} style={{width:'1200px'}}>
          <div className="incomeModal p-grid">
            <div className="fullwidth p-col-8">
              <div className="p-grid">
                <div className="fullwidth p-col-6">
                  <label>თარიღი</label>
                  <InputText type="text" placeholder="თარიღი" />
                </div>
                <div className="fullwidth p-col-6">
                  <label>სექცია</label>
                  <Dropdown optionLabel="name" placeholder="სექცია" style={{width:'100%'}} />
                </div>
                <div className="fullwidth p-col-6">
                  <label>ქონების მართვა</label>
                  <Dropdown optionLabel="name" placeholder="სექცია" style={{width:'100%'}} />
                </div>
                <div className="fullwidth p-col-6">
                  <label>ტრანსპორტირების პასხ. პირი</label>
                  <InputText type="text" placeholder="ტრანსპორტირების პასხ. პირი" />
                </div>
              </div>
            </div>
            <div className="fullwidth p-col-4">
              <label>კომენტარი</label>
              <InputTextarea rows={4} placeholder="შენიშვნა" style={{width:'100%', minHeight:'100px'}} />
           </div>
          </div>
          <hr/>
          <Cart data={this.state.cart['tab'+this.state.tab]}/>
        </Modal>
        <Modal header="კალათა" visible={this.state.cart.dialog} onHide={()=>this.setState(State('cart.dialog',false,this.state))} style={{width:'800px'}} >
            <Cart data={this.state.cart['tab'+this.state.tab]}/>
        </Modal>
        <Modal className="itemGroup" header="საქონლის ჯგუფი" visible={this.state.inventor.itemGroup.dialog} onHide={()=>this.setState(State('inventor.itemGroup.dialog',false,this.state))} style={{width:'800px', maxHeight:'500px'}} >
          {
            (this.state.inventor.itemGroup.dialog)? <TreeTableGroup column={[{field:'name',title:'Name'}]} data={this.state.inventor.itemGroup.data} onSelectItemGroup={(e)=>this.setState(State("inventor.income.detail.itemGroup",e,this.state),()=>this.setState(State("inventor.itemGroup.dialog",false,this.state),()=>console.log(this.state)))}/>:''
          }
        </Modal>
      </React.Fragment>
    );
  }
  suggestSupplier = (event) => {
    console.log(event)
    this.setState(State('inventor.supplierSuggestions', [], this.state));
    http.get("/api/secured/Supplier/Filter?query=" + event).then(result => {
      if (result.status === 200) {
        this.setState(State('inventor.supplierSuggestions', result.data, this.state), () => console.log(this.state.inventor));
      }
    })
  };
  itemTemplate=(event)=>{
    const {generatedName}=event;
    console.log(generatedName);
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
}

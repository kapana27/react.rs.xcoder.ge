import React, { Component } from 'react';
import http from  '../../../api/http';
import {Config} from "../../../config/Config";
import {CardCellRenderer,Modal,Calendar} from  '../../components'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import {Link} from 'react-router-dom';
import {InputText} from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';
import {Dropdown} from 'primereact/dropdown';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';
import './warehouse.css';
import 'primeflex/primeflex.css'

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
          date: new Date()
        }
      }
    }

  }
  componentDidMount() {
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
        console.log(params);
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
          console.log(filterData);
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
                <Button label="ინვ.გაცემა" icon="pi pi-arrow-up" className="p-button-danger" />
                <Button label="მოძრაობა A-B"  className="ui-button-raised arrow-icon"/>
                <Button label="ძებნა" icon="pi pi-search" />
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
              onGridReady={this.onGridReady}
            />
          </div>
          <Modal header="ინვენტარის მიღება" visible={this.state.inventor.income.dialog} onHide={()=>this.setState({inventor:{income: {...this.state.inventor.income, dialog:false}}})} width={'1200px'}>
            <div className="incomeModal p-grid">
              <div className="fullwidth p-col-3">
                <label>მიღების თარიღი</label>
                <Calendar date={this.state.inventor.income.date} onDateChange={props=>this.setState({inventor:{income: {...this.state.inventor.income, date:props}}})} />
              </div>
              <div className="fullwidth p-col-3">
                <label>მიმწოდებელი</label>
                <InputText type="text" />
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
                <InputTextarea rows={1}></InputTextarea>
                <Button label="დამატება" icon="pi pi-plus" />
              </div>
            </div>



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
                <InputText type="text" />
              </div>
              <div className="fullwidth p-col-2">
                <label>ინვენტარის ტიპი</label>
                <Dropdown optionLabel="name" />
              </div>
              <div className="fullwidth p-col-2">
                <label>ინვენტარის სტატუსი</label>
                <Dropdown optionLabel="name" />
              </div>

            </div>






          </Modal>
        </React.Fragment>
    );
  }

  onInventorIncome() {
    console.log(this.state);
    this.setState({inventor: {income: {...this.state.inventor.income, dialog:true}}});
  }
}

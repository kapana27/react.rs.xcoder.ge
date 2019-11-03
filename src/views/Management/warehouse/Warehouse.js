import React, { Component } from 'react';
import http from  '../../../api/http';
import {Config} from "../../../config/Config";
import {CardCellRenderer} from  '../../components'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
// prime ng react
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {Button} from 'primereact/button';

import './warehouse.css';

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
       }
    }
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
                <Button label="ინვ.მიღება" icon="pi pi-plus" />
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
        </React.Fragment>


    );
  }
}

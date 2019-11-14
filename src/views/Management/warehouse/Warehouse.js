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
            field: 'barcode',
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
          date: new Date(),
          supplier: "",
          comment:"",
          detail: {
            expand:false,
            dialog: false,
            itemGroup: {name: '', id: null},
            item: {name: '', id: null},
            maker: {name: '', id: null},
            measureUnit: {name: '', id: null},
            type: {name: '', id: null},
            status: {name: '', id: null},
            count: '',
            price: '',
            barcodeType: {name: '', id: null, key: null},
            barcode: '',
            factoryNumber:'',
            files:[],
            lastBarCode: {value: '', name: '', length: '', id: '', barCodeVisualValue: "", startPoint: "", endPoint: ""},
            list: []
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
        this.setState(State('inventor.barCodes', _.map(result.data,(value,index)=>{  return { key: index, id:value.id, name: value.name}  }), this.state));
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
        <Modal
          header="ინვენტარის მიღება დეტალები"
          visible={this.state.inventor.income.detail.dialog}
          onHide={()=>this.setState(State('inventor.income.detail.dialog',false,this.state))}
          style={{width:'1200px'}}
          footer={
            (<div>
              {this.state.inventor.income.detail.expand ?
              <Button label="დამახსოვრება" icon="pi pi-check" onClick={this.onSaveDetail}/> :
              <Button label="ჩაშლა" icon="pi pi-check" onClick={this.onInventorDetailExpand}/>}
              <Button label="გაუქმება" icon="pi pi-times" className="p-button-secondary" onClick={()=>this.setState(State('inventor.income.detail.dialog',false,this.state))}/>
            </div>)
          }
        >
          {
            this.state.inventor.income.detail.expand?
              (<div className="incomeAddedTable">
                <table >
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
                      _.map(this.state.inventor.income.detail.list, (value,index)=>{
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
                              {value.barcodeName}
                              <input type="text" value={value.barCode} onChange={event => this.setState(State('inventor.income.detail.list.'+index+'.barCode',event.target.value,this.state))}/>
                            </td>
                            <td>ჯგუფი</td>
                            <td>ტიპი</td>
                            <td>სტატუსი</td>
                          </tr>
                        )
                      })
                    }
                    </tbody>
                </table>
              </div>):(<div className="incomeModal p-grid">
                <div className="fullwidth p-col-2">
                  <label>დასახელება</label>
                  <AutoComplete
                    placeholder="დასახელება"
                    field="name"
                    suggestions={this.state.inventor.itemSuggestions}
                    onComplete={this.suggestItem}
                    onSelect={(e)=>this.setState(State('inventor.income.detail.item',e,this.state))}
                    onChange={(e) => this.setState(State('inventor.income.detail.item',e,this.state))}
                    value={this.state.inventor.income.detail.item}
                  />
                </div>
                <div className="fullwidth p-col-2">
                  <label>მარკა</label>
                  <AutoComplete
                    placeholder="მარკა"
                    field="name"
                    suggestions={this.state.inventor.makerSuggestions}
                    onComplete={this.suggestMaker}
                    onSelect={(e)=>this.setState(State('inventor.income.detail.maker',e,this.state))}
                    onChange={(e) => this.setState(State('inventor.income.detail.maker',e,this.state))}
                    value={this.state.inventor.income.detail.maker}
                  />
                </div>
                <div className="fullwidth p-col-2">
                  <label>მოდელი</label>
                  <AutoComplete
                    placeholder="მოდელი"
                    field="name"
                    disabled={_.isNull(this.state.inventor.income.detail.maker.id) && _.isEmpty(this.state.inventor.income.detail.maker.name) }
                    suggestions={this.state.inventor.modelSuggestions}
                    onComplete={this.suggestModel}
                    onSelect={(e)=>this.setState(State('inventor.income.detail.model',e,this.state))}
                    onChange={(e) => this.setState(State('inventor.income.detail.model',e,this.state))}
                    value={this.state.inventor.income.detail.model}
                  />
                </div>
                <div className="fullwidth p-col-2">
                  <label>რაოდენობა</label>
                  <InputText type="text" placeholder="დასახელება" value={this.state.inventor.income.detail.count} onChange={(e)=>this.setState(State("inventor.income.detail.count",e.target.value,this.state))}/>
                </div>
                <div className="fullwidth p-col-2">
                  <label>ერთეულის ფასი</label>
                  <InputText type="text" placeholder="დასახელება" value={this.state.inventor.income.detail.price} onChange={(e)=>this.setState(State("inventor.income.detail.price",e.target.value,this.state))}/>
                </div>
                <div className="fullwidth p-col-2">
                  <label>სულ ფასი:</label>
                  <div style={{lineHeight: '30px'}}>{Math.round(parseInt(this.state.inventor.income.detail.price)*parseInt(this.state.inventor.income.detail.count))}</div>
                </div>
                <div className="fullwidth barcode p-col-2">
                  <label>შტრიხკოდი</label>
                  <Dropdown value={this.state.inventor.income.detail.barcodeType} options={this.state.inventor.barCodes} onChange={(e) => this.setState(State( "inventor.income.detail.barcodeType",{key: e.value.key, id: e.value.id, name: e.value.name},this.state),()=>this.lastBarCode(this.state.inventor.income.detail.barcodeType))} placeholder="ბარკოდი" optionLabel="name"/>
                  <InputText type="text" placeholder="შტრ. კოდი" style={{textIndent:'0px',width:'78px',fontSize:'12px'}} value={this.state.inventor.income.detail.barcode} onChange={(e)=>this.setState(State("inventor.income.detail.barcode",e.target.value,this.state))}/>
                </div>
                <div className="fullwidth p-col-2">
                  <label>ქარხნული ნომერი:</label>
                  <InputText type="text" value={this.state.inventor.income.detail.factoryNumber} onChange={(e)=>this.setState(State("inventor.income.detail.factoryNumber",e.target.value,this.state))}/>
                </div>
                <div className="fullwidth p-col-2">
                  <label>განზომილების ერთეული</label>
                  <Dropdown value={this.state.inventor.income.detail.measureUnit} options={this.state.inventor.measureUnitList} onChange={(e) => this.setState(State( "inventor.income.detail.measureUnit",{ id: e.value.id, name: e.value.name},this.state))} placeholder="განზომილების ერთეული" optionLabel="name"/>
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
                  <Dropdown value={this.state.inventor.income.detail.type} options={this.state.inventor.itemTypes} onChange={(e) => this.setState(State( "inventor.income.detail.type",{ id: e.value.id, name: e.value.name},this.state))} placeholder="ინვენტარის ტიპი" optionLabel="name"/>
                </div>
                <div className="fullwidth p-col-2">
                  <label>ინვენტარის სტატუსი</label>
                  <Dropdown value={this.state.inventor.income.detail.status} options={this.state.inventor.itemStatus} onChange={(e) => this.setState(State( "inventor.income.detail.status",{ id: e.value.id, name: e.value.name},this.state))} placeholder="ინვენტარის სტატუსი" optionLabel="name"/>
                </div>
                <div className="fullwidth p-col-12">
                  <FileUploader onUpload={files=>this.setState(State("inventor.income.detail.files",files,this.state),()=>console.log(this.state.inventor))}/>
                </div>
              </div>)
          }
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
              <InputTextarea rows={1} value={this.state.inventor.income.comment} onChange={e=>this.setState(State('inventor.income.comment',e.target.event,this.state))} />
              <Button label="დამატება" icon="pi pi-plus" onClick={()=>this.setState(State('inventor.income.detail.dialog',true,this.state))} />
            </div>
          </div>
          <div className="incomeAddedTable" style={{ maxHeight: '200px', overflowY: 'scroll'}}>
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
                _.map(this.state.inventor.income.data,(value,index)=>{
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
                        <td>{Math.round(parseInt(value.price)*parseInt(value.count))}</td>
                      </tr>
                    )
                })
              }
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
            (this.state.inventor.itemGroup.dialog)? <TreeTableGroup column={[{field:'name',title:'Name'}]} data={this.state.inventor.itemGroup.data} onSelectItemGroup={(e)=>this.setState(State("inventor.income.detail.itemGroup",e,this.state),()=>this.setState(State("inventor.itemGroup.dialog",false,this.state)))}/>:''
          }
        </Modal>
      </React.Fragment>
    );
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
  onInventorDetailExpand = () => {
    this.setState(State('inventor.income.detail.expand', true, this.state));
    http.get("/api/secured/List/BarCode/Get/FreeCodes?barCodeType="+this.state.inventor.income.detail.barcodeType.id+"&count="+this.state.inventor.income.detail.count)
      .then(result => {
        this.setState(State("inventor.income.detail.list", _.map(result.data, value => {
          return {
            "barcodeName": value.value,
            "barCode": value.barCodeVisualValue,
            "serialNumber": this.state.inventor.income.detail.factoryNumber,
            "amount": 1
          }
        }), this.state));


      })
      .catch()


  };
  lastBarCode=(type)=> {
    http.get("/api/secured/List/BarCode/Get/LastCode?barCodeType="+type.id)
      .then(result => {

        this.setState(State('inventor.income.detail.lastBarCode', result.data, this.state));
      })
      .catch()
  }
  onSaveDetail=()=>{
    let data= this.state.inventor.income.data;
    data.push(this.state.inventor.income.detail);
    this.setState(State('inventor.itemSuggestions', [], this.state));
    this.setState(State('inventor.makerSuggestions', [], this.state));
    this.setState(State('inventor.modelSuggestions', [], this.state));
       this.setState(State("inventor.income.data",data,this.state),
         ()=>this.setState(State('inventor.income.detail.dialog',false,this.state),
           ()=>this.setState(State('inventor.income.detail',{
             expand:false,
             dialog: false,
             itemGroup: {name: '', id: null},
             item: {name: '', id: null},
             maker: {name: '', id: null},
             measureUnit: {name: '', id: null},
             type: {name: '', id: null},
             status: {name: '', id: null},
             count: '',
             price: '',
             barcodeType: {name: '', id: null, key: null},
             barcode: '',
             factoryNumber:'',
             files:[],
             lastBarCode: {value: '', name: '', length: '', id: '', barCodeVisualValue: "", startPoint: "", endPoint: ""},
             list: []
           }, this.state))))

  }
}

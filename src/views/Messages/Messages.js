import React, { Component } from 'react';



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
import {Paginator} from 'primereact/paginator';
import 'primeflex/primeflex.css';
import './messages.css';

import * as moment from "moment";
import {State} from "../../utils";


class Messages extends Component{
  constructor(props){
    super(props);
    this.state = {
      massage: {

      },
      tab: 31,
      paginator: {
        first: 0,
        rows: 0,
        first2: 0,
        rows2: 0
      }

    };
    this.onPageChange = this.onPageChange.bind(this);
    this.onPageChange2 = this.onPageChange2.bind(this);
  }
  render() {
    return  (
      <React.Fragment>
        <div className="actionButton">
          <div className="buttonBox">
            <Button label="მისაღები" className={this.state.tab === 31?'':'p-button-secondary'} onClick={()=>this.tabClick(31)} />
            <Button label="მიღებული"   className={this.state.tab === 32?'':'p-button-secondary'} onClick={()=>this.tabClick(32)} />
            <Button label="უარყოფილი"   className={this.state.tab === 33?'':'p-button-secondary'} onClick={()=>this.tabClick(33)} />
            <Button label="გაუქმების ოპერაციები"   className={this.state.tab === 34?'':'p-button-secondary'} onClick={()=>this.tabClick(34)} />
          </div>
          <div className="buttonBox"></div>
          <div className="buttonBox"></div>
        </div>
        <section>
          <div className="menu">
            <div className="subdiv">
              <table>
              <thead>
                <tr>
                  <th rowspan="2">№</th>
                  <th colspan="2">ელ. ზედდებულის ნომერი</th>
                  <th rowspan="2">თარიღი</th>
                  <th rowspan="2">დ</th>
                </tr>
                <tr>
                  <th>გასავლის ზედდებული</th>
                  <th>შემოსავლის ზედდებული</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>4</td>
                </tr>
              </tbody>
            </table>
            </div>
            <Paginator first={this.state.paginator.first} rows={this.state.paginator.rows} totalRecords={120}  onPageChange={this.onPageChange}></Paginator>
          </div>
          <div className="cont">
            <div className="subdiv">
              <table>
                <thead>
                <tr>
                  <th>დასახელება</th>
                  <th>მარკა</th>
                  <th>მოდელი</th>
                  <th>ფასი</th>
                  <th>რაოდენობა</th>
                </tr>
                </thead>

                <tbody>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>4</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>4</td>
                </tr>
                </tbody>

              </table>
            </div>

            <Paginator first={this.state.paginator.first} rows={this.state.paginator.rows} totalRecords={120}  onPageChange={this.onPageChange}></Paginator>
          </div>
        </section>
        <div style={{height: '100vh', width: '100vw'}}>
          <iframe src="http://rsnew.xcoder.ge/" frameBorder="0" style={{width: '100%', height: '100%'}}/>
        </div>
      </React.Fragment>
    )
  }


  tabClick(tabID) {
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



export default Messages;


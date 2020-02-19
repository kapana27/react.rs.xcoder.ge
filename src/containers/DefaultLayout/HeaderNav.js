import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';


import logo from '../../assets/img/brand/logo.png'
import sygnet from '../../assets/img/brand/sygnet.png'
import './header.css';

class HeaderNav extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="ribbon" data-select={window.location.hash.slice(2)}>
          <ul className="nav">
            <li data-active="Management/warehouse"><a href="#/Management/warehouse">საწყობის მართვა</a></li>
            <li data-active="Management/property"><a href="#/Management/property">ქონების მართვა</a></li>
            <li data-active="messages"><a href="#/messages">შეტყობინებები</a></li>
            <li data-active="directory"><a href="#/directory">ცნობარი</a></li>
            <li style={{flex:1}} divider></li>
            <li>
              <div className="user">
                {this.props.user.firstName} {this.props.user.lastName}
                <div className="dr-nav">
                  <button onClick={()=>this.props.onLogout()}>გამოსვლა</button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </React.Fragment>
    );
  }
}


export default HeaderNav;

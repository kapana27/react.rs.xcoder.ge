import React, {Component} from 'react';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import PropTypes from 'prop-types';
import _ from 'lodash';

export const PrintModal = (props) => {
  let modalTiTle = props.title? props.title:'შეტყობინება';
  return (
    <div className="printOverflow">
      <div className="printBox" data-title={modalTiTle}>
        <i onClick = {()=>props.onClick('cancel')}></i>
        {props.text}
        <div className="print_action_but">
          <button data-action="print" onClick ={()=>props.onClick('print')}>ბეჭდვა</button>
          <button data-action="cancel" onClick={()=>props.onClick('cancel')}>გამოსვლა</button>
        </div>
      </div>
    </div>
  )
};


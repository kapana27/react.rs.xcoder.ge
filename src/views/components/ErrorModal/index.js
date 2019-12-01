import React, {Component} from 'react';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import PropTypes from 'prop-types';
import _ from 'lodash';
export const ErrorModal = (props) => {
  return (
    <div className="errorOverflow">
      <div className="errorBox" data-title="შეცდომა">
        <i onClick = {props.onClick}></i>
        {props.text}
      </div>
    </div>
  )
};

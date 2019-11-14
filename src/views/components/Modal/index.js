import React, {Component} from 'react';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import PropTypes from 'prop-types';
import _ from 'lodash';
export const Modal = (props) => {
  let footer;

  if(!_.isEmpty(props.footer)){
     footer = props.footer
  }else{
     footer = (
      <div>
        <Button label="Yes" icon="pi pi-check" onClick={props.onHide}/>
        <Button label="No" icon="pi pi-times" onClick={props.onHide} className="p-button-secondary"/>
      </div>
    );
  }


  return (
    <Dialog header={props.header} visible={props.visible} style={props.style} footer={footer} onHide={props.onHide}  maximizable={true} draggable={true}>
      <div className={props.className}>
        {props.children}
      </div>
    </Dialog>
  )
};
Modal.propTypes = {
  header: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.string,
  children: PropTypes.any,
  style: PropTypes.any
};
Modal.defaultProps = {
  header:'',
  width: '600px',
  visible: false,
  children:null,
  style: null
};

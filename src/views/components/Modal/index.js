import React, {Component} from 'react';
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import PropTypes from 'prop-types';

export const Modal = (props) => {
  const footer = (
    <div>
      <Button label="Yes" icon="pi pi-check" onClick={props.onHide}/>
      <Button label="No" icon="pi pi-times" onClick={props.onHide} className="p-button-secondary"/>
    </div>
  );

  return (
    <Dialog header={props.header} visible={props.visible} style={props.style} footer={footer} onHide={props.onHide}  maximizable={true} draggable={true}>
      {props.children}
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

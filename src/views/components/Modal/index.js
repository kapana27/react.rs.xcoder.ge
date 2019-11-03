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
    <Dialog header={props.header} visible={props.visible} style={{width: props.width}} footer={footer} onHide={props.onHide} >
      {props.children}
    </Dialog>
  )
};
Modal.propTypes = {
  header: PropTypes.string,
  visible: PropTypes.bool,
  width: PropTypes.string,
  children: PropTypes.element
};
Modal.defaultProps = {
  header:'',
  width: '600px',
  visible: false,
  children: ''
};

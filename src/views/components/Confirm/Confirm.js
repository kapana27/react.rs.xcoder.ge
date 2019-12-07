import React from 'react';
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";


export const Confirm = (props) => {

  function click(status) {
        props.click(status)
  }

  return (
        <Dialog header={props.header} visible={true} style={{width: '50vw'}} footer={
          <div>
            <Button label="დიახ" icon="pi pi-check" onClick={()=>click('yes')} />
            <Button label="არა" icon="pi pi-times" onClick={()=>click('no')} className="p-button-secondary" />
          </div>
        } onHide={props.onHide} maximizable>
          {props.text}
        </Dialog>
  )
};

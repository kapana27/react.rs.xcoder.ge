import React,{useEffect,useState} from 'react';
import {Dialog} from 'primereact/dialog';
import {Button} from "primereact/button";
import PropTypes from 'prop-types';
const Insert = (props) => {
  const [show,setShow]=useState(props.show);
  useEffect(() => {
    console.log(props)
    setShow(props.show);
  }, [props.show]);
return (show)?(<Dialog header="" footer={
    <div>
      <Button label="შენახვა" icon="pi pi-check" onClick={props.onYesClick} />
      <Button label="გაუქმება" icon="pi pi-times" onClick={props.onNoClick} />
    </div>
  } visible={show} style={{minWidth: '500px',height:'auto'}} modal={show} >
    {props.children}
       </Dialog>
  ):null;
};
Insert.propTypes = {
   show:PropTypes.bool
};
Insert.defaultProps = {
  show: false
};


const Update = (props) => {

};

const Delete = (props) => {

};


export default {
  Insert,
  Update,
  Delete
};







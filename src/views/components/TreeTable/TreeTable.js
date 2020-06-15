import {TreeTable} from 'primereact/treetable';
import React,{useState,useEffect} from 'react';
import PropTypes from "prop-types";
import _ from  'lodash';
import {Column} from "primereact/column";
import http from "../../../api/http";
import {Button} from "primereact/button";

export const TreeTableGroup = (props) => {
  const [selectedNodeKey1, setSelectedNodeKey1] =useState(null)
  const [selectedData, setSelectedData] =useState({id:-1,name:''})

  useEffect(()=>{
    if(selectedData===null){
      setSelectedNodeKey1(-1);
    }else{
      setSelectedNodeKey1(selectedData['key']);
    }

    props.onSelectItemGroup(selectedData['data']);
  },[selectedData])

  return (
    <div>
      <TreeTable value={props.data.root} selectionMode="single" onSelect={(e) =>{ (JSON.stringify(e.node)===JSON.stringify(selectedData))? setSelectedData({data:{id:-1}})  :  setSelectedData(e.node)  ; }} selectionKeys={selectedNodeKey1}  >
        {
          _.map(props.column,(value,index)=>{
            return <Column key={value} field={value.field}  header={value.title} expander={value.expander}  body={value.body}> test</Column>
          })
        }
      </TreeTable>
    </div>
  )

};
TreeTableGroup.propTypes = {
  column:PropTypes.array,
  data:PropTypes.any,
  onSelectItemGroup: PropTypes.func
};
TreeTableGroup.defaultProps = {
  column:[],
  data:null
};


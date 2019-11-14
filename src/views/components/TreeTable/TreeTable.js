import {TreeTable} from 'primereact/treetable';
import React,{useState,useEffect} from 'react';
import PropTypes from "prop-types";
import _ from  'lodash';
import {Column} from "primereact/column";
import http from "../../../api/http";

export const TreeTableGroup = (props) => {
  return (
    <div>
      <TreeTable value={props.data.root} selectionMode="single" onSelect={(e) => props.onSelectItemGroup(e.node.data)} >
        {
          _.map(props.column,(value,index)=>{
            return <Column key={index} field={value.field} header={value.title} expander/>
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


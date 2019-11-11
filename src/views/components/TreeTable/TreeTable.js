import {TreeTable} from 'primereact/treetable';
import React,{useState,useEffect} from 'react';
import PropTypes from "prop-types";
import _ from  'lodash';
import {Column} from "primereact/column";
import http from "../../../api/http";


export const TreeTableGroup = (props) => {
  let data = [];
  if(!_.isEmpty(props.URL)){
      http.get(props.URL).then((result) => {
        data = {
          root: _.map(result.data, (value, index) => {
            value['key'] = index;
            if (!_.isUndefined(value.children) && _.size(value.children) > 0) {
              _.map(value.children, (value1, index1) => {
                value1['key'] = (index+"-"+index1 );
                return value1;
              });
            }
            return value;
          })
        };
        console.log(JSON.stringify(data))
      }).catch()
  }

  return (
    <div>
      <TreeTable value={data}>
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
  URL: PropTypes.string
};
TreeTableGroup.defaultProps = {
  column:[],
  URL:''
};

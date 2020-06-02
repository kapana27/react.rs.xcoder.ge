import React,{useState,useEffect} from 'react';
import {TreeTable} from 'primereact/treetable';
import {Column} from "primereact/column";
import Request from "../../../api/http2";
import {TreeTableGroup} from "../../components";


export const MeasurementUnit = (props) => {
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    MeasureUnit().then(result => {
     if(result.data.status===200){
       setNodes({"root":parseUnit(result.data.data)} );
     }
    })
  },[props]);
    return (
      <TreeTableGroup data={nodes}  column={[{field:'name', title:'name', expander:true},{field:'parent_name', title:'მშობელი ერთეული', expander:false}]} onSelectItemGroup={e=>console.log(e)}/>
    )
};

const MeasureUnit =  ()=>{
    return  Request.get("/api/secured/MeasureUnit/Select")
}
const parseUnit = (data = [], key = 0) => {

  if (data.length > 0) {
    return data.map((value,index) => {
      return parse(value, index.toString(), index);
    });
  }
};

const parse = (data = {data: [], children: []}, datakey="0", key = 0) => {
  if (data.children.length > 0) {
     data.children.map((value, index) => parse(value, key + "-" + index , key + 1));
  }
  data['key']=datakey;
  return data;
};


import React,{useState,useEffect} from 'react';
import {TreeTable} from 'primereact/treetable';
import {Column} from "primereact/column";
import Request from "../../../api/http2";
import {Table, TreeTableGroup} from "../../components";


export const Employeees = (props) => {
  const [nodes, setNodes] = useState([]);
  const [selected,setSelected]=useState(-1)
  useEffect(() => {
    MeasureUnit().then(result => {
      if(result.data.status===200){
        setNodes({"root":parseUnit(result.data.data)} );
      }
    })
  },[props]);
  return (
    <>
      <div className={"col-md-4"}>
        <TreeTableGroup data={nodes}  column={[{field:'name', title:'დასახელება', expander:true}]}  onSelectItemGroup={e=>setSelected((e)?e.id:-1)}/>
      </div>
      <div className={"col-md-8"}>
        <Table
          URL={"/api/secured/Staff/Department/Select?dep="+selected+""}
          Thead={
            <tr>
              <th >ID</th>
              <th >საშტატო ერთეული</th>
              <th >მდებარეობა</th>
              <th >თანამდებობა</th>
              <th >სახელი გვარი</th>
              <th >მობილური</th>
              <th >პირადობა</th>
              <th >ელფოსტა</th>
            </tr>
          }
          Fields={[
            {
              field:'data.id'
            },
            {
              field:'data.department.name'
            },
            {
              field:'data.location.names'
            },
            {
              field:'data.position.name'
            },
            {
              field:'data.fullname'
            },
            {
              field:'data.mobile'
            },
            {
              field:'data.pid'
            },
            {
              field:'data.email'
            }
          ]}
        />


      </div>
    </>
  )
};

const MeasureUnit =  ()=>{
  return  Request.get("/api/secured/Organizational/Structure/Tree/Select")
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


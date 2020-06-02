import React,{useState,useEffect} from 'react';
import {Checkbox} from 'primereact/checkbox';
import Request from "../../../api/http2";
import {TreeTableGroup} from "../../components";


export const Group = (props) => {
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    MeasureUnit().then(result => {
      if(result.data.status===200){
        setNodes({"root":parseUnit(result.data.data)} );
      }
    })
  },[props]);
  return (
    <TreeTableGroup data={nodes}
                    column={[
                      {field:'name', title:'დასახელება', expander:true},
                       {field:'spend', title:'სახარჯი', expander:false,  body:(node, column)=><Checkbox disabled  checked={node.data.spend===1}/>},
                      {field:'selectable', title:'არჩევითი', expander:false,  body:(node, column)=><Checkbox disabled  checked={node.data.selectable===1}/>},
                      {field:'isCar', title:'ავტომობილები სპეც.ტექნიკა', expander:false,  body:(node, column)=><Checkbox disabled  checked={node.data.isCar===1}/>},
                      {field:'isStrict', title:'მკაცრი აღრიცხვის დოკუმენტი', expander:false , body:(node, column)=><Checkbox disabled  checked={node.data.isStrict===1}/>},
                    ]} onSelectItemGroup={e=>console.log(e)}/>
  )
};

const MeasureUnit =  ()=>{
  return  Request.get("/api/secured/ItemGroup/Select?node=root")
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


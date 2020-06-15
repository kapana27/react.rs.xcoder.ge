import React,{useState,useEffect} from 'react';
import {TreeTable} from 'primereact/treetable';
import {Column} from "primereact/column";
import Request from "../../../api/http2";
import {Table, TreeTableGroup} from "../../components";
import _ from "lodash";
import {State} from "../../../utils";
import http2 from "../../../api/http";
import {InputText} from "primereact/inputtext";
import TableComponent from "../TableComponents/StandartTableComponents";


export const Position = (props) => {
  const [nodes, setNodes] = useState([]);
  const [selected,setSelected]=useState(-1)
  const [update,setUpdate]=useState(false)
  const [selectData,setSelectedData] = useState({id:-1,name:''});
  const [data,setData] = useState({id:-1,name:''});
  const [modal, setModal] = useState(null);




  useEffect(() => {
    MeasureUnit().then(result => {
      if(result.data.status===200){
        setNodes({"root":parseUnit(result.data.data)} );
      }
    })
  },[props]);
  return (
    <>
      <TableComponent.Insert show={modal !==null} onYesClick={()=>{

        let url = modal === 'new' ? "/api/secured/Organizational/Structure/StaffPosition/Position/Insert?parentId=" + selected + "&name=" + data.name :
          "/api/secured/Organizational/Structure/StaffPosition/Position/Update?id=" + selectData.id + "&name=" + data.name;

        http2.post(url)
          .then(response=>{
            if(response.status){
              setUpdate(false);
              setModal(null);
              setData({id:-1,name:''});
              setUpdate(true)

            }else {
              alert("დაფიქსირდა შეცდომა");
            }
          })
          .catch()


      }} onNoClick={()=>setModal(null)}>
        <div>
          <label >მიუთითეთ თანამდებობას დასახელება</label>
          <InputText value={data.name} onChange={(e) =>{  setData({name:e.target.value});}} placeholder={"მიუთითეთ თანამდებობას დასახელება"} style={{ width:'100%'}}/>
        </div>
      </TableComponent.Insert>
      <div className={"col-md-4"}>
        <TreeTableGroup data={nodes}  column={[{field:'name', title:'დასახელება', expander:true}]} onSelectItemGroup={e=>setSelected((e)?e.id:-1)}/>
      </div>
      <div className={"col-md-8"}>
        <Table
          URL={"/api/secured/Organizational/Structure/StaffPosition/Position/Select?parentId="+selected+""}
          Thead={
            <tr>
              <th >ID</th>
              <th >დასახელება</th>
            </tr>
          }
          Fields={[
            {
              field:'data.id'
            },
            {
              field:'data.name'
            }
          ]}
          onSelect={(selected) => {
              setSelectedData((!_.isEmpty(selected)) ? selected: {id:-1,name:''})
          }}
          update={update}
          mainHeader={
            <tr>
              <th colSpan={2} style={{textAlign:'right'}}>
                <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=> { if(selected !== -1){  setUpdate(false);setModal('new')}}}/>
                &nbsp; &nbsp;
                <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                  if(selectData.id !== -1){
                      setUpdate(false);
                      setData(selectData);
                    setModal('edit')
                  }
                }}/>
                &nbsp;
                &nbsp;
                <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                  if(selectData.id ===-1){
                    return ;
                  }
                  if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                    http2.get("/api/secured/Organizational/Structure/StaffPosition/Position/Delete?id="+selectData.id)
                      .then(response=>{
                        if(response.status){
                          setUpdate(false);
                          setModal(null);
                          setData({id:-1,name:''});
                          setUpdate(true)
                        }
                      })
                  }
                }}/>
              </th>
            </tr>
          }
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


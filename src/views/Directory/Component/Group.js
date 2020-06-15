import React,{useState,useEffect} from 'react';
import {Checkbox} from 'primereact/checkbox';
import Request from "../../../api/http2";
import {TreeTableGroup} from "../../components";
import {Button} from "primereact/button";
import {State} from "../../../utils";
import http2 from "../../../api/http";
import {InputText} from "primereact/inputtext";
import TableComponent from "../TableComponents/StandartTableComponents";
import {InputNumber} from "primereact/inputnumber";


export const Group = (props) => {
  const [nodes, setNodes] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectData,setSelectedData] = useState({id:-1,name:false,spend:false,selectable:false,isCar:false,isStrict:false,depreciationCharge:0});
  const [data,setData] = useState({id:-1,name:"",spend:false,selectable:false,isCar:false,isStrict:false,depreciationCharge:0});

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    MeasureUnit().then(result => {
      if(result.data.status===200){
        setNodes({"root":parseUnit(result.data.data)} );
      }
    })
  },[props]);
  useEffect(() => {
    if(update){
      MeasureUnit().then(result => {
        if(result.data.status===200){
          setNodes({"root":parseUnit(result.data.data)} );
        }
      })
    }

  },[update]);
  return (
    <>
      <TableComponent.Insert show={modal !==null} onYesClick={()=>{
        if(data.name.length===0){
            return ;
        }

        let url =( (modal === 'new') ? ("/api/secured/ItemGroup/Insert?name="+data.name+"&selectable="+((data.selectable)?1:0)+"&spend="+(data.spend?1:0)+"&isCar="+(data.isCar?1:0)+"&isStrict="+(data.isStrict?1:0)+"&id=null&depreciationCharge="+data.depreciationCharge+"&parent="+((selectData===undefined)? 0:selectData.id))
          :("/api/secured/ItemGroup/Update?name="+data.name+"&selectable="+((data.selectable)?1:0)+"&spend="+(data.spend?1:0)+"&isCar="+(data.isCar?1:0)+"&isStrict="+(data.isStrict?1:0)+"&depreciationCharge="+data.depreciationCharge+"&id="+selectData.id));
        http2.post(url)
          .then(response=>{
            if(response.status){
              setUpdate(false);
              setModal(null);
              setData({id:-1,name:"",spend:false,selectable:false,isCar:false,isStrict:false,depreciationCharge:0});
              setUpdate(true)

            }else {
              alert("დაფიქსირდა შეცდომა");
            }
          })
          .catch()
      }} onNoClick={()=>setModal(null)}>
        <div>
          <label >დასახელება</label>
          <InputText value={data.name} onChange={(e) =>{
              setData({...data,name:e.target.value})
          }} placeholder={"დასახელება"} style={{ width:'100%'}}/>
        </div>
        <div>
          <label >წლიური ცვეთა</label>
          <input type="number" value={data.depreciationCharge} onChange={(e) =>{
            console.log((e.target.value<0)?0: ((e.target.value>100)?100:e.target.value))
            setData({...data,depreciationCharge:((e.target.value<0)?0: ((e.target.value>100)?100:e.target.value))})
          }} placeholder={"წლიური ცვეთა"} style={{ width:'100%',padding:5}}/>
        </div>
        <div>
          <Checkbox  value={data.spend} checked={data.spend} onChange={e=>  setData({...data,spend:e.checked})}/> სახარჯი
        </div>
        <div>
          <Checkbox   value={data.selectable}  checked={data.selectable} onChange={e=>  setData({...data,selectable:e.checked})}/> არჩევითი
        </div>
        <div>
          <Checkbox   value={data.isCar} checked={data.isCar} onChange={e=>  setData({...data,isCar:e.checked})}/> ავტომობილები სპეც.ტექნიკა
        </div>
        <div>
          <Checkbox   value={data.isStrict} checked={data.isStrict} onChange={e=>  setData({...data,isStrict:e.checked})}/> მკაცრი აღრიცხვის დოკუმენტი
        </div>
      </TableComponent.Insert>
      <Button label="დამატება" icon="pi pi-check" className="p-button-success" onClick={() => { setUpdate(false);setModal('new')}}/> &nbsp;
      <Button label="რედაქტირება" icon="pi pi-pencil" onClick={() => {
        if(selectData !== undefined && selectData.id !== -1){
          setUpdate(false);
          setData(selectData);
          setModal('edit')
        }
      }}/> &nbsp;
      <Button label="წაშლა" icon="pi pi-times" className="p-button-danger" onClick={() => {
        if (selectData === undefined || selectData.id===-1) {
          return;
        }
        if (window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")) {
          http2.get("/api/secured/ItemGroup/Delete?id=" + selectData.id)
            .then(response => {
              if (response.status) {
                setUpdate(false);
                setModal(null);
                setData({id:-1,name:"",spend:false,selectable:false,isCar:false,isStrict:false});
                setUpdate(true)
              }
            })
        }
      }}/> &nbsp;
    <TreeTableGroup data={nodes}
                    column={[
                      {field:'name', title:'დასახელება', expander:true},
                      {field:'depreciationCharge', title:'წლიური ცვეთა', expander:false},
                       {field:'spend', title:'სახარჯი', expander:false,  body:(node, column)=><Checkbox disabled  checked={node.data.spend===1}/>},
                      {field:'selectable', title:'არჩევითი', expander:false,  body:(node, column)=><Checkbox disabled  checked={node.data.selectable===1}/>},
                      {field:'isCar', title:'ავტომობილები სპეც.ტექნიკა', expander:false,  body:(node, column)=><Checkbox disabled  checked={node.data.isCar===1}/>},
                      {field:'isStrict', title:'მკაცრი აღრიცხვის დოკუმენტი', expander:false , body:(node, column)=><Checkbox disabled  checked={node.data.isStrict===1}/>},
                    ]} onSelectItemGroup={e=>setSelectedData(e)}/>
     </>
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


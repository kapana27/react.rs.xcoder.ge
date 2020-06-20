import React,{useState,useEffect} from 'react';
import Request from "../../../api/http2";
import {Table, TreeTableGroup} from "../../components";
import PropTypes from 'prop-types';
import {State} from "../../../utils";
import http2 from "../../../api/http";
import TableComponent from "../TableComponents/StandartTableComponents";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";

export const Employeees = (props) => {
  const [nodes, setNodes] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [data,setData] = useState({id:-1,name:''});
  const [modal, setModal] = useState(null);
  const [update,setUpdate]=useState(false)
  const [selectData,setSelectedData] = useState({id:-1,name:''});
  const [roles, setRoles]=useState([])
  const [positions, setPositions]=useState([])
  const [cities, setCities]=useState([])
  const [buildings, setBuildings]=useState([])
  const [sections, setSections]=useState([])
  const [additional,setAdditional] = useState([]);
  const [adBuildings,setAdBuildings] = useState([]);
  const [selectUser,setSelectUser] = useState({id:-1});
  const [adData, setAdData] = useState({
    city: '',
    building: ''
  });
  const [formData, setFormData] = useState({
    department: "",
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    pid: "",
    role: "",
    position: "",
    buildings: "182,270",
    section: "",
    location: "",
    adBuilding:[]
});
  const [grid,setGrid]=useState(0);
  useEffect(() => {
    MeasureUnit().then(result => {
      if(result.data.status===200){
        setNodes({"root":parseUnit(result.data.data)} );
      }
    })
    getCities().then(response=>{
      if(response.status){
        setCities(response.data.data.map(val=>{
          return  {
            label: val.name,
            value:val.id
          }
        }))
      }else{
        setCities([])
      }
    })

    getRoles().then(result=>{
      if(result.status){
          setRoles(result.data.data.map(val=>{
            return  {
              label: val.name,
              value:val.role
            }
          }))
      }else{
        setRoles([]);
      }
    })

  },[props]);
  useEffect(()=>{
    if(selectData.id !== -1){
      getPositions(selectData.id).then(response=>{
        if(response.status){
          setPositions(response.data.data.map(val=>{
            return  {
              label:val.name,
              value:val.id
            }
          }))
        }else{
          setPositions([]);
        }
      })
    }
  },[selectData])

  useEffect(()=>{
    if(formData.city !== -1 && formData.city !==''){
      console.log("get building",formData.city)
      getBuildings(formData.city).then(response=>{
        if(response.status){
          console.log("get building",formData.city)

          setBuildings(response.data.data.map(val=>{
            return  {
              label:val.name,
              value:val.id
            }
          }))
        }else{
          setBuildings([]);
        }
      })
    }
  },[formData.city])
  useEffect(()=>{
    if(formData.location !== -1 && formData.location !==''){
      getSection(formData.location).then(response=>{
        if(response.status){
          setSections(response.data.data.map(val=>{
            return  {
              label:val.name,
              value:val.id
            }
          }))
        }else{
          setSections([]);
        }
      })
    }
  },[formData.location])

  useEffect(() => {
    if (formData.role === 'ROLE_PLACE') {
      setGrid(4)
    } else {
      setGrid(0)
    }
  }, [formData.role]);

  useEffect(() => {
   if(adData.city !=='' && adData.city !== -1){
     getAdBuildings(adData.city).then(response=>{
       if(response.status){
         setAdBuildings(response.data.data.map(val=>{
           return  {
             label:val.name,
             value:val.id
           }
         }))
       }else{
         setAdBuildings([]);
       }
     })
   }
  }, [adData.city]);
  useEffect(()=>{
    if(selectUser.id !== -1 && selectUser.id !== undefined){

        http2.get("/api/secured/Staff/Select_Edit?id="+selectUser.id)
          .then(response=>{
            if(response.status){

              try{

                let user =response.data;
                let city =user.location.parentUnit.id?user.location.parentUnit.id:'';

              setFormData({
                department: user.department ? user.department.id:'',
                firstname: user.firstname?user.firstname:'',
                lastname: user.lastname?user.lastname:'',
                email: user.email?user.email:'',
                mobile: user.mobile?user.mobile:'',
                pid: user.pid?user.pid:'',
                role: user.role?user.role.role:'',
                position: user.position?user.position.id:'',
                city:city,
                buildings: "",
                section: user.section?user.section.id:'',
                location: user.location?user.location.id:'',
                adBuilding:user.staffBuildings? user.staffBuildings:[]
              })
              }catch (e) {
                console.log(e.message)
              }
            }
          })

    }
  },[selectUser])


  return (
    <>
      <TableComponent.Insert show={modal !==null} onYesClick={()=>{
        let data =new FormData();
        let url = modal === 'new' ? "/api/secured/Staff/Insert"  :
          "/api/secured/Staff/Update";

        if(modal==='new'){
          data.append("department", selected);
          data.append("firstname", formData.firstname);
          data.append("lastname", formData.lastname);
          data.append("email", formData.email);
          data.append("mobile", formData.mobile);
          data.append("pid", formData.pid);
          data.append("role", formData.role);
          data.append("position", formData.position);
          data.append("section", formData.section);
          data.append("location", formData.location);
          data.append("buildings", additional.map(value => value.building.value).join(","));
        }else if(modal==='edit'){
          data.append("id",selectUser.id);
          data.append("department", selected);
          data.append("firstname", formData.firstname);
          data.append("lastname", formData.lastname);
          data.append("email", formData.email);
          data.append("mobile", formData.mobile);
          data.append("pid", formData.pid);
          data.append("role", formData.role);
          data.append("position", formData.position);
          data.append("section", formData.section);
          data.append("location", formData.location);
          data.append("buildings", (additional.map(value => value.building.value).join(","))+(formData.adBuilding? formData.adBuilding.map(value => value.buildingId).join(","):''))
        }


        http2.post(url,data)
          .then(response=>{
            if(response.status){
              setFormData({
                department: "",
                firstname: "",
                lastname: "",
                email: "",
                mobile: "",
                pid: "",
                role: "",
                position: "",
                buildings: "",
                section: "",
                location: "",
                adBuilding:[]
              });

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
        <div style={{height:'600px', width:'800px',margin:0}} className={'row'}>
          <div className={`col-md-${12-grid}`}>
            <div>
              <h3>{selectData.name}</h3>
            </div>
            <div>
              <label >მიუთითეთ როლი</label>
              <Dropdown style={{width:'100%'}} value={formData.role} options={roles} onChange={(e) => setFormData({...formData,role:e.value})}  filterPlaceholder="აირჩიეთ როლი" filterBy="label,value" placeholder="აირჩიეთ როლი"/>
            </div>
            <div>
              <label >მიუთითეთ პოზიციის დასახელება</label>
              <Dropdown style={{width:'100%'}} value={formData.position} options={positions} onChange={(e) => {setFormData({...formData,position:e.value})}}  filterPlaceholder="აირჩიეთ პოზიცია" filterBy="label,value" placeholder="აირჩიეთ პოზიცია"/>
            </div>
            <div>
              <label >სახელი</label>
              <InputText value={formData.firstname} onChange={(e) =>setFormData({...formData,firstname:e.target.value})} placeholder={"სახელი"} style={{ width:'100%'}}/>
            </div>
            <div>
              <label >გვარი</label>
              <InputText value={formData.lastname} onChange={(e) =>setFormData({...formData,lastname:e.target.value})} placeholder={"გვარი"} style={{ width:'100%'}}/>
            </div>
            <div>
              <label >ელფოსტა</label>
              <InputText value={formData.email} onChange={(e) =>setFormData({...formData,email:e.target.value})} placeholder={"ელფოსტა"} style={{ width:'100%'}}/>
            </div>
            <div>
              <label >მობილური</label>
              <InputText value={formData.mobile} onChange={(e) =>setFormData({...formData,mobile:e.target.value})} placeholder={"მობილური"} style={{ width:'100%'}}/>
            </div>
            <div>
              <label >პირადი ნომერი</label>
              <InputText value={formData.pid} onChange={(e) =>setFormData({...formData,pid:e.target.value})} placeholder={"პირადი ნომერი"} style={{ width:'100%'}}/>
            </div>
            <div>
              <label >აირჩიეთ ქალაქი</label>
              <Dropdown style={{width:'100%'}} value={formData.city} filter={true} options={cities} onChange={(e) => setFormData({...formData,city:e.value})} filterBy="label,value" placeholder="აირჩიეთ ქალაქი"/>
            </div>
            <div>
              <label >აირჩიეთ შენობა</label>
              <Dropdown style={{width:'100%'}} value={formData.location} options={buildings} onChange={(e) => setFormData({...formData,location:e.value})}  filterBy="label,value" placeholder="აირჩიეთ შენობა"/>
            </div>
            <div>
              <label >აირჩიეთ სექცია</label>
              <Dropdown style={{width:'100%'}} value={formData.section} options={sections} onChange={(e) => setFormData({...formData,section:e.value})}  filterBy="label,value" placeholder="აირჩიეთ სექცია"/>
            </div>
          </div>
           <div className={`col-md-${grid}`} style={{borderLeft:'1px solid black'}}>
             {
               (grid>0)?(
                 <div>
                   <div>
                     <label >აირჩიეთ ქალაქი</label>
                     <Dropdown style={{width:'100%'}} value={adData.city} filter={true} options={cities} onChange={(e) =>  setAdData({...adData,city:e.value})} filterBy="label,value" placeholder="აირჩიეთ ქალაქი"/>
                   </div>
                   <div>
                     <label >აირჩიეთ შენობა</label>
                     <Dropdown style={{width:'100%'}} value={adData.building} options={adBuildings} onChange={(e) => setAdData({...adData,building:e.value})}  filterBy="label,value" placeholder="აირჩიეთ შენობა"/>
                   </div>
                   <br/>
                   <Button label="დამატება" icon="pi pi-check" onClick={()=>{
                      let city=cities.find(value => value.value ===adData.city)
                      let building=adBuildings.find(value => value.value ===adData.building)
                      if(city && building){
                        setAdditional([...additional,{city:city,building:building}])
                      }
                   }} />
                   <br/>
                   <div className={'row'}>
                     <div className={'col-md-12'}style={{paddingRight:0}}>
                       <table style={{width:'100%',border:'1px solid black'}}>
                         <tbody>
                         {
                           additional.map((value, index) => {
                             return (
                               <tr key={index}>
                                 <td>{value.city.label}</td>
                                 <td>{value.building.label}</td>
                                 <td onClick={()=>{
                                    setAdditional(additional.filter(((value1, index1) => index1 !== index)))
                                 }}>x</td>
                               </tr>
                             )
                           })
                         }
                         {
                           formData.adBuilding.map((value, index) => {
                             return (
                               <tr key={index}>
                                 <td>{value.parentName}</td>
                                 <td>{value.name}</td>
                                 <td onClick={()=>{

                                   setFormData({...formData,adBuilding:formData.adBuilding.filter(((value1, index1) => index1 !== index))})
                                 }}>x</td>
                               </tr>
                             )
                           })
                         }
                         </tbody>
                       </table>
                     </div>

                   </div>

                 </div>
               ):null
             }


           </div>
        </div>

      </TableComponent.Insert>
      <div className={"col-md-4"}>
        <TreeTableGroup data={nodes}  column={[{field:'name', title:'დასახელება', expander:true}]}  onSelectItemGroup={e=>{  setSelected((e)?e.id:-1) ; setSelectedData((e)?e:{id:-1,name:''});  }}/>
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
              field:'data.location.name'
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
          update={update}
          onSelect={e=>setSelectUser(e?e:{id:-1})}
          mainHeader={
            <tr>
              <th colSpan={8} style={{textAlign:'right'}}>
                <i className="fa fa-plus"  style={{fontSize:'16px'}} onClick={()=> { if(selected !== -1){  setUpdate(false);setModal('new')}}}/>
                &nbsp; &nbsp;
                <i className="fa fa-edit"  style={{fontSize:'16px'}} onClick={()=>{
                  if(selectUser.id !== -1){
                    setUpdate(false);
                    setSelectedData({id:-1})
                    setData(selectData);
                    setModal('edit')
                  }
                }}/>
                &nbsp;
                &nbsp;
                <i className="fa fa-times"  style={{fontSize:'16px',color:'red',cursor:'pointer'}} onClick={()=>{
                  if(selectUser.id ===-1){
                    return ;
                  }
                  if(window.confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა")){
                    http2.get("/api/secured/Staff/Delete?id="+selectUser.id)
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
const MeasureUnit = () => {
  return Request.get("/api/secured/Organizational/Structure/Tree/Select")
};

const getRoles =()=>{
  return Request.get("/api/secured/Staff/Roles");
}
const getCities =()=>{
  return Request.get("/api/secured/StructuralUnit/City/Select?name=");
}
const getPositions = (id) => {
  if (id === '' || id === -1) {
    return;
  }
  return Request.get("/api/secured/Organizational/Structure/StaffPosition/Position/Select?parentId=" + id + "&start=0&limit=1000");
};
const getBuildings = (id) => {
  console.log("get buidlings",id)
  if (id === '' || id === -1) {
    return;
  }
  return Request.get("/api/secured/StructuralUnit/City/Building/Select?name=&cityId=" +( (id)?id:'') + "&start=0&limit=1000");
};
const getAdBuildings = (id) => {
  if (id === '' || id === -1) {
    return;
  }
  return Request.get("/api/secured/StructuralUnit/City/Building/Select?name=&cityId=" + ((id)?id:'' )+ "&start=0&limit=1000");
};
const getSection = (id) => {
  if (id === '' || id === -1) {
    return;
  }
  return Request.get("/api/secured/StructuralUnit/City/Building/Section/Select?name=&parentId="+id);
};
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


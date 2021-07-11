import  React,{useState,useEffect} from 'react';
import {FileUpload} from 'primereact/fileupload';
import {Button} from 'primereact/button';
import PropTypes from "prop-types";
import _ from 'lodash'
import http from "../../../api/http";
import http3 from "../../../api/http3";
export const FileUploader = (props) => {

    const [files,setFiles]=useState([]);

  function onSelect(e) {

   if(e.xhr.status===200){
     const data = JSON.parse(e.xhr.response)['data'];
     setFiles( _.map(data,v=>{
       return {id:v['id'], name: v['filename'], size: v['size']}
     }));
   }
  }
  useEffect(()=>{
    props.onSelectFile({files:files})
  },[files])

  return <div>
  <FileUpload
    name="file"
    url={props.url}
    accept=".pdf,.png"
    multiple={props.multiple}
    maxFileSize={1000000}
    onSelect={(e)=> {
      //props.onSelectFile(e)
      console.log(e)

    }}
    auto={true}
    onUpload={e=>{
      //props.onUpload(JSON.parse(e.xhr.response))
      onSelect(e)
    }}
    chooseLabel="აირჩიეთ ფაილი"
    cancelLabel="გაუქმება"
    uploadLabel="ატვირთვა"
    previewWidth={24}
  >
  </FileUpload>
  <table style={{width: '100%'}} cellPadding={5}>
    <tbody>
    {
      files.map((value,index) => {
        return (
          <tr key={index} style={styles.tr}>
            <td>{value.name}</td>
            <td>{value.size}</td>
            <td width={20} onClick={()=>{
              (new http3()).get("/api/secured/Document/Delete?id="+value.id).then(response=>{
                if(response.status===200 ){
                  setFiles(files.filter((value1, index1) => index1!==index))
                }
              })

            }}>
              <Button icon="pi pi-times" />
            </td>
          </tr>
        )
      })
    }
    </tbody>
  </table>
</div>
};
const styles = {
  tr:{
    border: '1px solid #d4d4d4'
  }
};

FileUploader.propTypes = {
  url: PropTypes.string,
  onSelectFile:PropTypes.func,
  onUpload:PropTypes.func,
  multiple:PropTypes.bool
};
FileUploader.defaultProps = {
  url:'/api/secured/Document/Upload',
  onUpload: e => console.log(e),
  multiple:true
};

import  React,{useState,useEffect} from 'react';
import {FileUpload} from 'primereact/fileupload';
import {Button} from 'primereact/button';
import PropTypes from "prop-types";

export const FileUploader = (props) => {

    const [files,setFiles]=useState([]);
  useEffect(()=>{
    props.onUpload(files)
  },[files])

  function onSelect(e) {
   if(e.xhr.status===200){
     const data = JSON.parse(e.xhr.response)['data'];
     setFiles([...files, {id:data[0]['id'], name: data[0]['filename'], size: Math.ceil(e.files[0]['size']/1024)+"KB"}]);
   }
  }

  return <div>
  <FileUpload
    name="file"
    url={props.url}
    accept="pdf,png"
    maxFileSize={1000000}
    onUpload={(e)=>onSelect(e)}

    auto={false}
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
            <td width={20} onClick={()=>setFiles(files.filter((value1, index1) => index1!==index))}>
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
  onUpload:PropTypes.func
};
FileUploader.defaultProps = {
  url:'/api/secured/Document/Upload',
};

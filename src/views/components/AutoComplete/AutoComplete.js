import React,{ useState,useEffect} from "react";
import {InputText} from 'primereact/inputtext';
import PropTypes from 'prop-types';
import {Modal} from "../Modal";
import './AutoComplete.css';

export const AutoComplete = (props) => {
  const [loader, setLoader]= useState(false);
  const [container, setContainer]= useState(true);

  useEffect(() => {
        setLoader(false);
  });

  function select(value,props) {
     setContainer(false);
     props.onSelect(value)
  }

  function renderSuggestions(props) {
      if(props.suggestions.length>0 && container){
         return <div style={style.container} className="autocomplete-container">
           {
             props.suggestions.map((value,index) => {
                if (props.field){
                    return <div style={style.item} key={index} onClick={()=>select(value,props)}>{value[props.field]}</div>
                }
               return <div style={style.item} key={index} onClick={()=>select(value,props)}>{value}</div>
             })
           }
         </div>

      }
  }

  function change(e) {
    setLoader(true);
    setContainer(true);
    props.onChange(e.target.value);
    props.onComplete(e.target.value);
  }

  return (
    <React.Fragment>
      <div style={{position:'relative'}}>
        <InputText
          className={props.class}
          disabled={props.disabled}
          placeholder={props.placeholder}
          value={(typeof props.value === "string")? props.value: props.value[props.field]}
          onChange={(e)=>change(e)}
        />
        <i className="p-autocomplete-loader pi pi-spinner pi-spin" style={{display: `${loader? 'block':'none'}`}}/>
      </div>

      <div style={{position:'relative'}} >
        {renderSuggestions(props)}
      </div>
    </React.Fragment>
  )
};
AutoComplete.propTypes = {
  value: PropTypes.any,
  suggestions: PropTypes.array,
  onChange:PropTypes.func,
  onSelect: PropTypes.func,
  onComplete: PropTypes.func
};
AutoComplete.defaultProps = {
  value:'',
  suggestions: []
};

const style = {
  container: {
    maxHeight: '200px',
    width: 'auto',
    minWidth:'180px',
    overflowY: 'scroll',
    border: "1px solid #b1a5a5",
    position: 'absolute',
    background: 'white',
    zIndex: 2222
  },
  item: {
    width: '100%',
    borderBottom: '0px solid #c4baba',
    height: '30px',
    lineHeight: '30px',
    padding: '0px 10px',
    cursor:'pointer',
    background: 'white',
    zIndex:2222,
    whiteSpace: 'nowrap'
  },

};

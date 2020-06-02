import React,{useState,useEffect,useCallback} from 'react';
import {Paginator} from 'primereact/paginator';
import PropTypes from "prop-types";
import http from "../../../api/http";
import _ from 'lodash';
import './table.css'
import moment from "moment";
import http2 from "../../../api/http2";
import { v4 as uuidv4 } from 'uuid';




export const Table = (props) => {
const [loaderName, setLoaderName] = useState(uuidv4());

useEffect(()=>{

  http2.subscribeLoader(loaderName, e => {
    console.log(loaderName,e)
    setLoader(e);
  });
  return ()=>{
    http2.unsubscribeLoader(loaderName);
  }
},[])

  let [loader,setLoader] = useState(false);
  let [start,setStart] = useState(props.start);
  let [limit,setLimit] = useState(props.limit);
  let [total,setTotal] = useState(props.rows);
  let [thead,setThead] = useState(props.Thead);
  let [tbody,setTbody] = useState(props.Tbody);
  let [types,setTypes] = useState(props.Types);
  let [selected,setSelected] = useState({});
  let [data,setData] = useState(props.data || []);

  const onSelect = (value) => {
    setSelected(_.isEqual(selected, value) ? {} : value);
  };
  useEffect(() => setThead(props.Thead),[props.Thead]);
  useEffect(() =>   getData(),[props.URL]);
  useEffect(() => props.onSelect(selected), [selected]);
  useEffect(() => getData() , [props.update]);

  useEffect(()=>{
    setData(props.data)
  },[props.data])


  useEffect(() => {
    if(props.URL !== undefined &&props.URL!== null && props.URL.toString().trim()!=='' )
    http2.get(props.URL + "&page=1&start=" + start + "&limit=" + limit)
      .then(result => {
        if(result.status){
          setTotal(result.data.totalCount);
          setData(result.data.data);
        }
        getData(loaderName);
      })

  },[start]);

  const getData=(name)=>{
    http2.loader(name).get(props.URL + "&page=1&start=" + start + "&limit=" + limit)
      .then(result => {
        if(result.status){
          setTotal(result.data.totalCount);
          setData(result.data.data);
        }

      })
  }

  return (
      <div className="rs-table-container">
        <div className="rs-table">
          { (loader)? <div className='gif_loader'/>:""  }
          <table>
            {thead}
            {

              <tbody>
              {

                _.map(data, (value, index) => {
                  return <tr key={index} onClick={() => onSelect(value)}
                             className={_.isEqual(selected, value) ? 'selected' : ''}>
                    {
                      _.map(props.Fields, (th, key) => {
                        return <td key={key}>
                          {
                            (!_.isUndefined(th['typed']) && th['typed']) ?
                              ((!_.isUndefined(th['multiple'])) && th['multiple']) ?

                                _.reduce(th['multipleParams'].split("."), (m_val, m_key) => {

                                  if (_.isEmpty(m_val)) {
                                    m_val = types[m_key];
                                  } else {
                                    m_val = m_val[m_key]
                                  }
                                  return m_val;
                                }, types)[[value[th['field']]]]
                              : (!_.isUndefined(th['concated']) && th['concated']) ?
                              _.join(_.map(th.field.split(","), f => {
                                return _.isUndefined(types[value[f]]) ? value[f] : types[value[f]];
                              }), "-")
                              :
                              types[value[th['field']]]
                            :
                            (_.size(th['field'].split(".")) > 1) ?
                            _.reduce(th['field'].split("."), (val, th) => {
                            if (_.isEmpty(val)) {
                            val = value[th];
                          } else {
                            val = val[th]
                          }
                            return val;
                          }, value)
                            : (th['type'] === 'date') ? moment(value[th['field']]).format(th.format) : value[th['field']]

                          }
                        </td>;
                      })
                    }
                  </tr>
                })
              }
              </tbody>

            }
          </table>
        </div>
        <Paginator
          first={start}
          rows={limit}
          totalRecords={total}
          onPageChange={(e) => { setStart(e.first); setLimit(e.rows);}}
        />
      </div>
    )
};

Table.propTypes = {
  URL: PropTypes.string,
  Thead: PropTypes.element,
  Fields: PropTypes.array,
  Tbody: PropTypes.element,
  start: PropTypes.number,
  rows: PropTypes.number,
  limit:PropTypes.number,
  total: PropTypes.number,
  Types: PropTypes.object,
  selected:PropTypes.object,
  onSelect: PropTypes.func,
  data:PropTypes.array,
  name:PropTypes.string
};

Table.defaultProps = {
  name: uuidv4(),
  URL: "",
  Fields: [],
  Thead: <tbody><tr><td>header not found</td></tr></tbody>,
  Tbody: <tbody><tr><td>content not found</td></tr></tbody>,
  start: 0,
  rows: 30,
  limit:30,
  total: 0,
  Types:{},
  selected:{},
  data:[],
  onSelect:(selected)=>console.log(selected)
};




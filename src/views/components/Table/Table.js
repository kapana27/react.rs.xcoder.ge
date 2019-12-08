import React,{useState,useEffect,useCallback} from 'react';
import {Paginator} from 'primereact/paginator';
import PropTypes from "prop-types";
import http from "../../../api/http";
import _ from 'lodash';
import './table.css'
export const Table = (props) => {

  let [start,setStart] = useState(props.start);
  let [limit,setLimit] = useState(props.rows);
  let [total,setTotal] = useState(props.rows);
  let [thead,setThead] = useState(props.Thead);
  let [tbody,setTbody] = useState(props.Tbody);
  let [types,setTypes] = useState(props.Types);
  let [selected,setSelected] = useState({});
  let [data,setData] = useState([]);

  const onSelect = (value) => {
    setSelected(_.isEqual(selected, value) ? {} : value);
  };
  useEffect(() => setThead(props.Thead),[props.Thead]);
  useEffect(() =>   getData(),[props.URL]);
  useEffect(() => props.onSelect(selected), [selected]);
  useEffect(() => getData() , [props.update]);
  useEffect(() => {
    http.get(props.URL + "&page=1&start=" + start + "&limit=" + limit)
      .then(result => {
        setTotal(result.totalCount);
        setData(result.data);
        getData();
      })

  },[start]);

  const getData=()=>{
    http.get(props.URL + "&page=1&start=" + start + "&limit=" + limit)
      .then(result => {
        setTotal(result.totalCount);
        setData(result.data);
      })
  }

  return (
      <div className="rs-table-container">
        <div className="rs-table">
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
                              (!_.isUndefined(th['concated']) && th['concated']) ?
                                _.join(_.map(th.field.split(","), f => {
                                  return _.isUndefined(types[value[f]]) ? value[f] : types[value[f]];
                                }), "-")
                                :
                                types[value[th['field']]]
                              :
                              (_.size(th['field'].split("."))>1)?
                                _.reduce(th['field'].split("."),(val,th)=>{
                                    if(_.isEmpty(val)){
                                      val=value[th];
                                    }else{
                                      val=val[th]
                                    }
                                    return val;
                                },value)
                                : value[th['field']]

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
  total: PropTypes.number,
  Types: PropTypes.object,
  selected:PropTypes.object,
  onSelect: PropTypes.func
};

Table.defaultProps = {
  URL: "",
  Fields: [],
  Thead: <tbody><tr><td>header not found</td></tr></tbody>,
  Tbody: <tbody><tr><td>content not found</td></tr></tbody>,
  start: 0,
  rows: 30,
  total: 0,
  Types:{},
  selected:{},
  onSelect:(selected)=>console.log(selected)
};




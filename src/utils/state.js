export const State = (reference, value, state) => {
  const params = reference.split(".");
  //console.log(reference, value, state,params);
  if(params.length>0){
      let newParams=params.filter(((value1, index) => index !==0)).join(".");
      if(params.length===1){
          state[params[0]]=value;
      }else{
         state[params[0]]=State(newParams,value,state[params[0]]);
      }
  }
  return state;

};

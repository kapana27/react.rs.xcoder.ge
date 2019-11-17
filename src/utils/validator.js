import _ from 'lodash';
export const Validator = (fields, data) => {
    console.log(data)
    let errors = [];
  _.forEach(fields, (key) => {
      if (!_.isUndefined(data[key])){
        if(_.isObject(data[key]) && (_.isUndefined(data[key]['id']) || _.isNull(data[key]['id'])|| !_.isEmpty(data[key]['id']) )){
          errors.push(key);
        }else{
          if(_.isUndefined(data[key]) || _.isNull(data[key]) || data[key] ===''  ){
            errors.push(key)
          }
        }
      }else{
        errors.push(key);
      }
  });
  return errors;
};

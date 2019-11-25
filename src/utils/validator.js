import _ from 'lodash';
export const Validator = (fields, data, checkerKey=null) => {
    let errors = [];
  _.forEach(fields, (key) => {
      if (!_.isUndefined(data[key])){
        if(_.isObject(data[key]) && (_.isUndefined(data[key][checkerKey? checkerKey:'id']) || _.isNull(data[key][checkerKey? checkerKey:'id'])|| _.trim(data[key][checkerKey? checkerKey:'id']) === '' )){
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

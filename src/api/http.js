import axios from 'axios';

axios.create({
  baseURL: '/'
});

const get=(uri)=>{
  return new Promise((resolve, reject) => {
    axios.get(uri)
      .then(response => {
        resolve(response.data);
      })
      .catch(reason => {
        console.log(reason)
      });
  })
}
const post=(uri,params)=>{
  return new Promise((resolve, reject) => {
    axios.get(uri,params)
      .then(response => {
        resolve(response.data);
      })
      .catch(reason => {
        reject(reason)
      });
  })
}
export default {
  get,
  post
}

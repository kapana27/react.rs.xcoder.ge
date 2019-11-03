import axios from 'axios';

axios.create({
  baseURL: '/',

});

const get = (uri) => {
  return new Promise((resolve, reject) => {
    axios.get(uri)
      .then(response => {
        resolve(response.data);
      })
      .catch(reason => {
        console.log(reason)
      });
  })
};
const post = (uri, formData) => {
  return new Promise((resolve, reject) => {
    axios.post(uri, formData)
      .then(response => {
        resolve(response.data);
      })
      .catch(reason => {
        reject(reason)
      });
  })
};
export default {
  get,
  post
}

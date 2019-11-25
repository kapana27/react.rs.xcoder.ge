import axios from 'axios';

axios.create({
  baseURL: '/',
});

const get = (uri) => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(uri)
        .then(response => {
          resolve(response.data);
        })
        .catch(reason => {
          console.log(reason)
        });
    } catch (e) {
      console.log(e)
    }
  });
};
const post = (uri, formData) => {
  return new Promise((resolve, reject) => {
    try{
      axios.post(uri, formData)
        .then(response => {
          resolve(response.data);
        })
        .catch(reason => {
          reject(reason)
        });
    }catch (e) {
      console.log(e)
    }

  })
};
export default {
  get,
  post
}

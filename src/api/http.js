import axios from 'axios';
const PREFIX = '/rs';
axios.create({
  baseURL: '/',
});

const get = (uri) => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(PREFIX+uri)
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
      axios.post(PREFIX+uri, formData)
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

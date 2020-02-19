import axios from 'axios';
export const PREFIX = '/rs';
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
          if(reason.response.status===401){
            setTimeout(()=>{
              window.location.href="/#/login";
            },100)

          }
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
          console.log(reason.response.status)
          setTimeout(()=>{
            window.location.href="/#/login";
          },100)
          reject(reason)
        });
    }catch (e) {
      console.log(e)
    }

  })
};
const session=()=>{
  return new Promise((resolve, reject) => {
    get("/api/secured/ping")
      .then((response) => {
        resolve(response.data);
      })
      .catch(reason => {
        console.log(reason.response.status)
        setTimeout(() => {
          window.location.href = "/#/login";
        }, 100)
      });
  })
};
export default {
  get,
  post,
  session
}

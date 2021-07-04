import axios from 'axios';
export let PREFIX = '';

if(window.location.hostname === "rs.xcoder.ge"){
  PREFIX = '/rs';
}

axios.create({
  baseURL: '/',
});




const get = (uri) => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(PREFIX+uri)
        .then(response => {
          console.log('response',response);
          if (response?.data?.status !== 200){
            window.onError(response?.data?.error?.toString());
          }
          resolve(response.data);
        })
        .catch(reason => {
          if(reason?.response?.status===401){

            setTimeout(()=>{
              window.location.href="/#/login";
            },100)

          }
          window.onError(reason.toString());
          console.log(reason)
        });
    } catch (e) {
      window.onError(e.toString());
      console.log(e)
    }
  });
};

const post = (uri, formData) => {
  return new Promise((resolve, reject) => {
    try{
      axios.post(PREFIX+uri, formData)
        .then(response => {
          console.log('response',response);
          if (response?.data?.status !== 200){
            window.onError(response?.data?.error?.toString());
          }
          resolve(response.data);
        })
        .catch(reason => {
          console.log('reason',reason)
          //console.log(reason.response.status);
          window.onError(reason.toString());
          if(reason?.response?.status===401){

            setTimeout(()=>{
              window.location.href="/#/login";
            },100)

          }
          reject(reason)
        });
    }catch (e) {
      window.onError(e.toString());
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
        //console.log(reason.response.status)
        if(reason?.response?.status===401){

          setTimeout(()=>{
            window.location.href="/#/login";
          },100)

        }
      });
  })
};

export default {
  get,
  post,
  session
}

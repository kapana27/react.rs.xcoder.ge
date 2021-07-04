import axios from 'axios';

const request =  axios.create({
  baseURL: '/'
})
let loaders = new Map();
class Http {
  loader=null;
  setLoader(loader){
    this.loader=loader;
    return this;
  }
  dispatchLoader(loader='global',status=false){
    //console.log('kapo',loaders.get(loader))
    if(!loaders.has(loader)) return;
    loaders.get(loader).forEach(callback=>callback(status))
    return this;
  }
  static subscribeLoader(loader,callback) {

    if(!loaders.has(loader)) loaders.set(loader,[]);
    loaders.get(loader).push(callback)
    return this;
  }

  static unsubscribeLoader(loader){
    if(loaders.has(loader))  loaders.delete(loader);
    return this;
  }

  get(url){
    return new Promise((resolve,reject ) => {
      if(this.loader){
        //console.log('this.loader',this.loader);
        this.dispatchLoader(this.loader,true)
      }
      request.get(url).then(response=>{
        //console.log('response',response);
        if (response?.data?.status !== 200){
          window.onError(response?.data?.error?.toString());
        }
        resolve(response.data);
      }).catch(reason => {
        if(reason?.response?.status===401){

          setTimeout(()=>{
            window.location.href="/#/login";
          },100)

        }
        window.onError(reason.toString());
        console.log(reason)
      }).finally(()=>{
        if(this.loader){
          this.dispatchLoader(this.loader,false)
        }
      })
    })
  }
  post(url,data){
    return new Promise((resolve,reject ) => {
      if(this.loader){
        this.dispatchLoader(this.loader,true)
      }


      request.post
      (url,data).then(response=>{
        //console.log('response',response);
        if (response?.data?.status !== 200){
          window.onError(response?.data?.error?.toString());
        }
        resolve(response.data);
      }).catch(reason => {
        //console.log('reason',reason)
        //console.log(reason.response.status);
        window.onError(reason.toString());
        if(reason?.response?.status===401){

          setTimeout(()=>{
            window.location.href="/#/login";
          },100)

        }
        reject(reason)
      }).finally(()=>{
        if(this.loader){
          this.dispatchLoader(this.loader,false)
        }
      })
    })
  }
}

export default Http;

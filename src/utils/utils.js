import http from "../api/http";
import {Config} from "../config/Config";

export const putInCart = (props) => {
  console.log(props)
};
export const getCartItems = (props) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append('globalKey', props.key);
    return http.post(Config.cart.post.getAll, formData,{ 'Sec-Fetch-Mode': 'no-cors'})
      .then(result => resolve(result.data))
      .catch(reason => reject(reason))
  })
};




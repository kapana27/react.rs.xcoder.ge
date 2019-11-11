import http from "../api/http";
import {Config} from "../config/Config";

export const putInCart = (props) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append('globalKey', props.globalKey);
    formData.append('key', props.key);
    formData.append('value', props.value);
    return http.post(Config.cart.post.put, formData)
      .then(result => resolve(result.data))
      .catch(reason => reject(reason))
  })
};
export const getCartItems = (props) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append('globalKey', props.globalKey);
    return http.post(Config.cart.post.getAll, formData)
      .then(result => resolve(result.data))
      .catch(reason => reject(reason))
  })
};
export const removeCartItem = (props) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append('globalKey', props.globalKey);
    formData.append('key', props.key);
    formData.append('value', props.value);
    return http.post(Config.cart.post.remove, formData)
      .then(result => resolve(result.data))
      .catch(reason => reject(reason))
  })
};
export const clearCartItem = (props) => {
  return new Promise((resolve, reject) => {
    let formData = new FormData();
    formData.append('globalKey', props.key);
    return http.post(Config.cart.post.clear, formData)
      .then(result => resolve(result.data))
      .catch(reason => reject(reason))
  })
};




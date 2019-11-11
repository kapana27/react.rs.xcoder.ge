import React from 'react';
import {Button} from 'primereact/button';
import './CardCellRenderer.css'
export const CardCellRenderer = (params)=>{
  try {
    if (params['data']['tmpAmount'] === params['data']['amount']) {
      return  '';
    }
  } catch (e) {}
  if (params['data'] !== undefined && params['data']['inCart']) {
    return '<button class="icon" ><i class="fas fa-shopping-cart red-icon" size="30" </i></button>';
  } else {
    return '<button class="icon"><i class="fas fa-shopping-cart " size="30"></i></button>';
  }
}

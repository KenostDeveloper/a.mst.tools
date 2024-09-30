import { YM_ID } from '../constants/metrika'

export const sendMetrik = (action) => {
  console.log(process.env.NODE_ENV)
  // console.log(window.ym)
  // console.log(YM_ID)
  if (typeof window !== 'undefined' && typeof window.ym !== 'undefined'){
    if(process.env.NODE_ENV === 'production'){
      window.ym(YM_ID, 'reachGoal', action);
    }else{
      console.log('sendMetrik', action);
      // window.ym(YM_ID, 'reachGoal', action);
    }
  }
}

/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-unused-vars */
import {SET_ALERT,REMOVE_ALERT} from '../actions/types';

const initialState=[];
 function alertReducer(state = initialState,action){
    const {type,payload}=action;
    switch(type){
case SET_ALERT:
    return [...state,payload]
case REMOVE_ALERT:
    return state.filter((alert)=>alert.id!== payload)   
default:   
    return state 
    }
}; 
export default alertReducer;
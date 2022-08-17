import  Loading  from '@/components/Loading'
import { createApp } from 'vue'
export default{
  mounted(el,binding){
    let loadApp = createApp(Loading);
    // console.log(loadApp);
    let instance = loadApp.mount(document.createElement("div"));
    // console.log(instance);
    el.instance = instance.$el;
    if(binding.value) append(el);
  },
  updated(el, binding){
    binding.value ? append(el) : removeChild(el)
  }
}

function append(el){
  let allStyle = getComputedStyle(el)
  let arr = ['absoult' ,'fixed' ,'relative']
  if(arr.indexOf(allStyle.position) === -1) el.style.posion = 'relative'
  el.appendChild(el.instance);
}
function removeChild(el){
  el.removeChild(el.instance);
}
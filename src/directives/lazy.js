import defaultImg from "@/assets/lazy.jpg"
import { useIntersectionObserver } from "@vueuse/core"
export default{
  /**
   * 
   * @param {*} el 
   * @param {*} binding 
   */
  mounted(el,binding){
    el.src = defaultImg;

    let {stop} = useIntersectionObserver(el,([{isIntersecting}])=>{
      if(isIntersecting){
        el.src=binding.value;
        el.onerror = ()=>{
          el.src = defaultImg;
        }
        stop()
      }
    })
    /*
            let {stop} = useIntersectionObserver(el, ([{isIntersecting}]) => {
            if(isIntersecting){
                // 将实际的图片地址赋值给元素的src
                el.src = binding.value
                // 当图片加载失败时
                el.onerror = () => {
                    el.src = defaultImg
                }
                // 在可视区域里了, 停止对该元素的监听
                stop()
            }
        })  */
  },
  updated(el,binding){

  }
}
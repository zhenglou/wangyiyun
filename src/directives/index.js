import Loading  from "@/directives/loading"
import Lazy from "@/directives/lazy"

export default {
   install(app){
    app.directive('loading', Loading)
    app.directive('img-lazy',Lazy)
   }
}
const request = require.context("./svg",false,/\.svg$/);
// console.log(request.keys());
request.keys().forEach( src => {
  request(src)
});
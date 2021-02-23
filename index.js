// Fill in your client ID and client secret that you obtained
// while registering the application
const clientID = '7e015d8ce32370079895'
const clientSecret = '2b976af0e6b6ceea2b1554aa31d1fe94ea692cd9'

const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const axios = require('axios');

const app = new Koa();

const main = serve(path.join(__dirname + '/public'));

const oauth = async ctx => {
  const requestToken = ctx.request.query.code;
  console.log('authorization code:', requestToken);
  
  /*
  Axios 是一个基于 promise 的 HTTP 库,可以用在浏览器和 node.js 中。
  简单的讲就是可以发送get、post请求。
  
  还有个工具叫 JQuery 也可以干这个事情。
  */
  const tokenResponse = await axios({
    method: 'post',
    url: 'https://github.com/login/oauth/access_token?' +
      `client_id=${clientID}&` +
      `client_secret=${clientSecret}&` +
      `code=${requestToken}`,
    headers: {
      accept: 'application/json'
    }
  });

  const accessToken = tokenResponse.data.access_token;
  console.log(`access token: ${accessToken}`);

  const result = await axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      accept: 'application/json',
      Authorization: `token ${accessToken}`
    }
  });
  console.log(result.data);
  const name = result.data.name;

  ctx.response.redirect(`/welcome.html?name=${name}`);
};

app.use(main);
/* 
这里叫 /oauth/redirect 很棒，
因为真的对应于这行代码 ctx.response.redirect(`/welcome.html?name=${name}`);
*/
app.use(route.get('/oauth/redirect', oauth)); 

app.listen(8080);

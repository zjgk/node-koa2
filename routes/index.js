const router = require('koa-router')();
let  DB=require('../module/db.js');


router.get('/', async (ctx, next) => {
  let result =await DB.find("cats");
  ctx.body = result;

})

router.get('/home', async (ctx, next) => {
  ctx.body = 'koa2 honme'
})

router.get('/login', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 login'
  }
})

module.exports = router

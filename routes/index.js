const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  ctx.body = "<div>Hello6666</div>"
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

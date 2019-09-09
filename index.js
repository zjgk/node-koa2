const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors')
const app = new Koa();
const Koa_Session = require('koa-session');
const router = require('./routes/index.js');


// 配置session
const session_signed_key = ["some secret hurr"];  // 这个是配合signed属性的签名key
const session_config = {
    key: 'koa:sess', /**  cookie的key。 (默认是 koa:sess) */
    maxAge: 1000*60*30,   /**  session 过期时间，以毫秒ms为单位计算 。*/
    autoCommit: true, /** 自动提交到响应头。(默认是 true) */
    overwrite: true, /** 是否允许重写 。(默认是 true) */
    httpOnly: true, /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */
    signed: true, /** 是否签名。(默认是 true) */
    rolling: true, /** 是否每次响应时刷新Session的有效期。(默认是 false) */
    renew: false, /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */
};
const session = Koa_Session(session_config, app)
app.keys = session_signed_key;
// 使用中间件，注意有先后顺序
app.use(session);
app.use(bodyParser());  // 解析request的body
app.keys = session_signed_key;
// 使用中间件，注意有先后顺序
app.use(session);
app.use(bodyParser());  // 解析request的body

// 处理跨域的配置
app.use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));

app.use(async(ctx ,next)=> {
    const databaseUserName = "testSession";
    const databaseUserPasswd = "noDatabaseTest";
    // 对/favicon.ico网站图标请求忽略
    if (ctx.path === '/favicon.ico') return;
    if (!ctx.session.logged) {  // 如果登录属性为undefined或者false，对应未登录和登录失败
        // 设置登录属性为false
        ctx.session.logged = false;
        // 取请求url解析后的参数对象，方便比对
        let query = ctx.request.query;
        // 判断用户名密码是否为空
        if (query.nickname && query.passwd) {
            // 比对并分情况返回结果  
            if (databaseUserName == query.nickname) {  // 如果存在该用户名
                // 进行密码比对并返回结果 
                ctx.body = (databaseUserPasswd == query.passwd) ? "登录成功" : "用户名或密码错误";
                ctx.session.logged = true;
            } else {                                                              //  如果用户名不存在
				ctx.body = "用户名不存在";
				console.log("用户名不存在")
            }
        } else {
			ctx.body = "用户名密码不能为空";
			console.log("用户名密码不能为空")
			
        }
    } else {
		ctx.body = "已登录";
		console.log("已经登陆")
		await next();
    }

}
);

app.use(router.routes());

app.listen(3000);
console.log('app startedeee at port 3000...');


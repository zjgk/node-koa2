const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const cors = require('koa2-cors')
const app = new Koa();
app.use(bodyParser());  // 解析request的body
// import router from './routes/index.js'
const router = require('./routes/index.js');


// 处理跨域的配置
app.use(cors({
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));



const db = mongoose.connect("mongodb://localhost/test")

var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
	email:String,
	name:String
});
var User = mongoose.model('user',UserSchema);
const Cat = mongoose.model('Cat', { name: String });


router.get('/', async (ctx, next) => {
	let val = null
	const data = await User.findOne({name:'zhangnushi'})
	const data2 = await Cat.findOne({name:'Zildjian'})
	console.log('data', data,data2)
	const result = {
		code:200,
		response: data2,
		ts: 12345
	}
	ctx.response.body = result
	return result
})

app.use(router.routes());

app.listen(3000);
console.log('app startedeee at port 3000...');


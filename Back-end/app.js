var express = require('express');
var app = express();
var cors = require('cors');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));


// import Routes
const productsRoute = require('./routes/product');
const usersRoute = require('./routes/user');
const orderRoute = require('./routes/order');


//use routes
app.use('/api/products',productsRoute);
app.use('/api/orders',orderRoute);
//app.use('/api/users',usersRoute);


app.get('/',(req,res)=>{
    res.send("welcome");
})


app.listen(3000,() => {
    console.log("app running on port 3000");
})
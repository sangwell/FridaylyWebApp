var express = require('express');
var mysql = require('mysql');
var http = require('http');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var uuid = require('uuid/v1');
var CryptoJS = require("crypto-js");//密码加密

var app =express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const dataBaseConnectionString={
  host     : 'hdm-105.hichina.com',
  user     : 'hdm1050779',
  password : 'aqstrep123',
  database : 'hdm1050779_db',
  insecureAuth: true
};
/*const dataBaseConnectionString={
  host     : 'localhost',
  user     : 'root',
  password : 'cba@12345',
  database : 'Fund'
};*/
const DB=dataBaseConnectionString.database;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
  next();
});

app.get('/',function(req,res) {
  res.send('Hello World');
});

// app.get('/GetAllFundType',function(req,res) {
//     res.set({
//         'Content-Type': 'text/html; charset=utf8',
//         'Access-Control-Allow-Origin':'*'});
//     var connection = mysql.createConnection({
//         host     : 'localhost',
//         user     : 'root',
//         password : 'cba@12345',
//         database : 'Fund'
//     });
//     connection.connect();
//     var sql = 'call Fund.sp_fundtype_getAllFundType()';
//     connection.query(sql,function(err,result) {
//         if(err){
//             console.log('【SELECT ERROR】- ',err.message);
//             return;
//         }
//         res.send(result[0]);
//
//     });
//     connection.end();
// });

// app.get('/GetAllFunds',function(req,res) {
//     res.set({
//         'Content-Type': 'text/html; charset=utf8',
//         'Access-Control-Allow-Origin':'*'});
//     var connection = mysql.createConnection({
//         host     : 'localhost',
//         user     : 'root',
//         password : 'cba@12345',
//         database : 'Fund'
//     });
//     connection.connect();
//     var sql = 'call Fund.sp_fundbrief_getAllFund();';
//     connection.query(sql,function(err,result) {
//         if(err){
//             console.log('【SELECT ERROR】- ',err.message);
//             return;
//         }
//         res.send(result[0]);
//
//     });
//     connection.end();
// });

// app.post('/AddFundType',urlencodedParser,function(req,res) {
//     res.set({
//         'Content-Type': 'text/html; charset=utf8',
//         'Access-Control-Allow-Origin':'*'});
//     var connection = mysql.createConnection({
//         host     : 'localhost',
//         user     : 'root',
//         password : 'cba@12345',
//         database : 'Fund'
//     });
//     connection.connect();
//     var p_Name=req.body.Name;
//     var sql = 'call Fund.sp_fundtype_addFundType("'+p_Name+'")';
//     connection.query(sql,function(err,result) {
//         if(err){
//             console.log('【SELECT ERROR】- ',err.message);
//             return;
//         }
//         res.send(result[0]);
//
//     });
//
//     connection.end();
// });

// app.post('/AddFund',urlencodedParser,function(req,res) {
//     res.set({
//         'Content-Type': 'text/html; charset=utf8',
//         'Access-Control-Allow-Origin':'*'});
//     var connection = mysql.createConnection({
//         host     : 'localhost',
//         user     : 'root',
//         password : 'cba@12345',
//         database : 'Fund'
//     });
//     connection.connect();
//     var p_Id=req.body.Id;
//     var p_Name=req.body.Name;
//     var p_ServiceCharge=req.body.ServiceCharge;
//     var p_Type=req.body.Type;
//     var sql = 'call Fund.sp_fundtype_addFund("'+p_Id+'", "'+p_Name+'", "'+p_ServiceCharge+'", "'+p_Type+'");';
//     connection.query(sql,function(err,result) {
//         if(err){
//             console.log('【SELECT ERROR】- ',err.message);
//             return;
//         }
//         res.send(result[0]);
//
//     });
//
//     connection.end();
// });

app.post('/GetFundData',urlencodedParser,function(req,res) {
  res.set({
    'Content-Type': 'text/html; charset=utf8',
    'Access-Control-Allow-Origin':'*'});
  ValidateAuthorization(req,res);
  var fund=req.body.FundNo;
  var start=req.body.StartDate;
  var end=req.body.EndDate;
  var url = "http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&code="+fund+"&page=1&per=1000&sdate="+start+"&edate="+end;
  http.get(url,function(response){
    var html = '';
    response.on('data',function(data){
      html += data;
    });

    response.on('end',function(){
      eval(html);
      var content=apidata.content;
      res.send(content);
    });
  }).on('error',function(){
    console.log('获取数据错误');
  });

});

app.post('/SearchFund',urlencodedParser,function(req,res) {
  res.set({
    'Content-Type': 'text/html; charset=utf8',
    'Access-Control-Allow-Origin':'*'});
  ValidateAuthorization(req,res);
  var fund=req.body.FundCode;
  var url = "http://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?callback=GetSearchResult&m=1&key="+fund;
  http.get(url,function(response){
    var html = '';
    response.on('data',function(data){
      html += data;
    });

    response.on('end',function(){
      var result=eval(html);
      // var content=apidata.content;
      res.send(result);
    });
  }).on('error',function(){
    console.log('获取数据错误');
  });

});

//获取上证指数
app.post('/GetSHStockIndex',urlencodedParser,function(req,res) {
  res.set({
    'Content-Type': 'text/html; charset=utf8',
    'Access-Control-Allow-Origin':'*'});
  ValidateAuthorization(req,res);
  var startDate=req.body.StartDate;
  var endDate=req.body.EndDate;
  var url = "http://q.stock.sohu.com/hisHq?code=zs_000001&start="+startDate+"&end="+endDate;
  http.get(url,function(response){
    var html = '';
    response.on('data',function(data){
      html += data;
    });

    response.on('end',function(){
      // var result=eval(html);
      // var content=apidata.content;
      res.send(html);
    });
  }).on('error',function(){
    console.log('获取数据错误');
  });

});

//基金管理-get
app.get('/GetMyFunds',function(req,res) {
  ValidateAuthorization(req,res);
  var connection = mysql.createConnection(dataBaseConnectionString);
  connection.connect();
  var token=req.headers.authorization;
  var de = jwt.verify(token, 'LoginToken');
  var UserName=de.UserName;
  var sql = 'call '+DB+'.sp_fund_get("'+UserName+'");';
  connection.query(sql,function(err,result) {
    if(err){
      console.log('【SELECT ERROR】- ',err.message);
      return;
    }
    res.send(result[0]);

  });
  connection.end();
});
//基金管理-add
app.post('/AddMyFunds',function(req,res) {
  ValidateAuthorization(req,res);
  var connection = mysql.createConnection(dataBaseConnectionString);
  connection.connect();
  var Id=uuid();
  var FundCode=req.body.FundCode;
  var FundName=req.body.FundName;
  var TimeStamp=new Date().getTime();
  var token=req.headers.authorization;
  var decoded = jwt.verify(token, 'LoginToken');
  var UserName=decoded.UserName;

  var sql = 'call '+DB+'.sp_fund_add("'+Id+'", "'+UserName+'", "'+FundCode+'","'+FundName+'","'+TimeStamp+'");';
  connection.query(sql,function(err,result) {
    if(err){
      console.log('【SELECT ERROR】- ',err.message);
      return;
    }
    res.send(result[0]);

  });
  connection.end();
});
//基金管理-update
app.post('/UpdateMyFunds',function(req,res) {

  ValidateAuthorization(req,res);
  var connection = mysql.createConnection(dataBaseConnectionString);
  connection.connect();
  var Id=req.body.Id;
  var FundCode=req.body.FundCode;
  var FundName=req.body.FundName;
  var TimeStamp=new Date().getTime();

  var sql = 'call '+DB+'.sp_fund_update("'+Id+'", "'+FundCode+'","'+FundName+'","'+TimeStamp+'");';
  connection.query(sql,function(err,result) {
    if(err){
      console.log('【SELECT ERROR】- ',err.message);
      return;
    }
    res.send(result[0]);

  });
  connection.end();
});
//基金管理-delete
app.post('/DeleteMyFunds',function(req,res) {

  ValidateAuthorization(req,res);
  var connection = mysql.createConnection(dataBaseConnectionString);
  connection.connect();
  var Id=req.body.Id;

  var sql = 'call '+DB+'.sp_fund_delete("'+Id+'");';
  connection.query(sql,function(err,result) {
    if(err){
      console.log('【SELECT ERROR】- ',err.message);
      return;
    }
    res.send(result[0]);

  });
  connection.end();
});
//用户注册
app.post('/Register',function(req,res) {
  var connection = mysql.createConnection(dataBaseConnectionString);
  connection.connect();
  var Id=uuid();
  var UserName=req.body.UserName;
  var Password=CryptoJS.MD5(req.body.Password).toString();
  var userValid=false;
  var userCountSql = 'call '+DB+'.sp_user_getUserCount("'+UserName+'");';
  connection.query(userCountSql,function(err,result) {
      if(err){
        console.log('【SELECT ERROR】- ',err.message);
        return;
      }
      var count=result[0][0].count;
      if(count === 0){
        var connection2 = mysql.createConnection(dataBaseConnectionString);
        connection2.connect();
        var sql = 'call '+DB+'.sp_user_register("'+Id+'", "'+UserName+'","'+Password+'");';
        connection2.query(sql,function(err) {
          if(err){
            console.log('【SELECT ERROR】- ',err.message);
            return;
          }
          res.json({success:true});

        });
        connection2.end();
      }else {
        res.json({success:false,message:'用户名已存在'});
      }
    });
  connection.end();
});
//登录
app.post('/Login',function(req,res,next) {
  var connection = mysql.createConnection(dataBaseConnectionString);
  connection.connect();
  var UserName=req.body.UserName;
  var MD5Password=CryptoJS.MD5(req.body.Password).toString();
  var userCountSql = 'call '+DB+'.sp_user_getUserCount("'+UserName+'");';
  connection.query(userCountSql,function(err,result) {
    if(err){
      console.log('【SELECT ERROR】- ',err.message);
      return;
    }
    var count=result[0][0].count;
    if(count === 0){
      res.json({success:false,message:'用户名不存在'});
    }else{
      var connection2 = mysql.createConnection(dataBaseConnectionString);
      connection2.connect();
      var userPasswordSql = 'call '+DB+'.sp_user_getPasswordByUserName("'+UserName+'");';
      connection2.query(userPasswordSql,function(err,result) {
        if(err){
          console.log('【SELECT ERROR】- ',err.message);
          return;
        }
        var pswInDb=result[0][0].Password;
        var isInitFunds=result[0][0].IsInitFunds;
        if(pswInDb!==MD5Password){
          res.json({success:false,message:'密码不正确'});
        }else {
          var token = jwt.sign(req.body, 'LoginToken',{ expiresIn: '7d' });
          res.json({
            success: true,
            message: '登录成功！',
            isInitFunds:isInitFunds,
            token: token
          });
        }
      });
    }
  });








  //
  // if(req.body.UserName!=='a'){
  //   res.json({success:false,message:'用户名不存在'});
  // }else if(req.body.Password!=='a'){
  //   res.json({success:false,message:'密码不正确'});
  // }else {
  //   var token = jwt.sign(req.body, 'LoginToken',{ expiresIn: '24h' });
  //   res.json({
  //     success: true,
  //     message: '登录成功！',
  //     token: token
  //   });
  // }


  // var decoded = jwt.decode(req.body.Token);
  // res.json(decoded);

});
//api带token测试
app.get('/ApiWithToken',function(req,res,next) {

  ValidateAuthorization(req,res);
  res.json({mes:'OKOKOK'});

});


function ValidateAuthorization(req,res) {
  var token=req.headers.authorization;
  var decoded = jwt.verify(token, 'LoginToken',function(err, decoded){
    if(err){
      error = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
        expiredAt: 1408621000
      };
      res.status(401);
      res.render('error', { error: error });
    }
  });
}
function GetSearchResult(data) {
  return data;
}

var server = app.listen(8081,function() {

});



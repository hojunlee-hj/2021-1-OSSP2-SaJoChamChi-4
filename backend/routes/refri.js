var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var config = require("../config/database");
var db = mysql.createConnection(config.mysql);


router.post("/getList",(req,res)=>{
    var usr_Id = req.body.usr_id;
    db.query('SELECT * FROM refrigerator WHERE rf_usr=?',[usr_Id], (err,rows)=>{
        if(err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);}
    });
});

router.post("/Insert",(req,res)=>{
    var rf_Pname = req.body.rf_Pname;
    var rf_Number = req.body.rf_Number;
    var rf_EPdate = req.body.rf_EPdate;
    var rf_Indate = req.body.rf_Indate;
    var rf_Frozen = req.body.rf_Frozen;
    var rf_Foodid = req.body.rf_Foodid;
    var rf_FKind = req.body.rf_FKind;
    var rf_usr = req.body.rf_usr;
    var sql = 'INSERT into refrigerator(rf_Pname, rf_Number, rf_EPdate,rf_Indate, rf_Frozen, rf_Foodid,rf_FKind, rf_usr) Values(?,?,?,?,?,?,?,?);'
    db.query(sql,[ rf_Pname,rf_Number,rf_EPdate, rf_Indate, rf_Frozen, rf_Foodid, rf_FKind, rf_usr], (err,rows)=>{
        if(err) console.log(err);
        else {
            console.log("Refri insert log :", rows);
            res.json(rows);}
    });
});



router.post("/Update",(req,res)=>{
    var rf_Pname = req.body.rf_Pname;
    var rf_Number = req.body.rf_Number;
    var rf_Epdate = req.body.rf_Epdate;
    var rf_Indate = req.body.rf_Indate;
    var rf_Frozen = req.body.rf_Frozen;
    var rf_Foodid = req.body.rf_Foodid;
    var rf_FKind = req.body.rf_FKind;
    var rf_usr = req.body.rf_usr;
    var sql = 'UPDATE refrigerator SET rf_Number=?, rf_Epdate=?,rf_Indate=?, rf_Frozen=?, rf_Foodid=?,rf_FKind=? WHERE rf_Pname=?;'
    db.query(sql,[rf_Number,rf_Epdate.substring(0,10), rf_Indate.substring(0,10), rf_Frozen, rf_Foodid, rf_FKind, rf_Pname], (err,rows)=>{
        if(err) console.log(err);
        else {
            console.log("Refri update log :", rows);
            res.json(rows);}
    });
});

router.post("/getEpFood",(req,res)=>{
    var rf_usr = req.body.rf_usr;
    var sql = 'SELECT * FROM refrigerator.refrigerator WHERE DATEDIFF(rf_EPdate,now())<=5 AND rf_usr=?;'
    db.query(sql,[rf_usr], (err,rows)=>{
        if(err) console.log(err);
        else {
            console.log("유통기한안남은 data :", rows);
            res.json(rows);}
    });
});

router.post("/getRefriFood",(req,res)=>{
    var rf_usr = req.body.rf_usr;
    var sql = 'SELECT * FROM refrigerator.refrigerator WHERE rf_usr=? ORDER BY rf_Fkind ASC, rf_Epdate ASC limit 5;'
    db.query(sql,[rf_usr], (err,rows)=>{
        if(err) console.log(err);
        else {
            console.log("냉장고 안의 data :", rows);
            res.json(rows);}
    });
});

router.post("/deleteRefriItem",(req,res)=>{
    var item = req.body.Pname;
    var usr = req.body.usr_Id;

    var sql = 'Delete FROM refrigerator WHERE rf_Pname=? AND rf_usr=?;'
    db.query(sql,[item, usr], (err,rows)=>{
        if(err) console.log(err);
        else {
            console.log("냉장고 안의 data :", usr,item);
            res.json(rows);}
    });
});
module.exports = router;
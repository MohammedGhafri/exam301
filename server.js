'use strict';
require('dotenv').config();

const express=require('express');
const cors=require('cors');
const methodOverride=require('method-override');
const pg=require('pg');
const superagent=require('superagent');

const server=express();
const PORT=process.env.PORT;




server.use(express.static('./public'));
server.use(methodOverride('metho'));
server.use(express.json());
server.use(express.urlencoded({extended:true}));

server.set('view engine', 'ejs');


const client=new pg.Client(process.env.DATABASE_URL);


//---------------------------------------routes---------------------//
server.get('/',homefunc);
server.get('/favouritPage',favPage);
server.post('/fav',addtoFav);
server.delete('/del/:delId',delJoke);
server.put('/update/:updId',updateJoke)
server.get('/randomJokes',randomlyJoke)






//----------------functions--------------------//
function randomlyJoke(req,res){
    const URL=`https://official-joke-api.appspot.com/jokes/programming/random`;
    superagent.get(URL)
    .then(data=>res.render('pages/rand',{rand:data.body}))
    .then(data=>res.send(data.body))
    // console.log('rand')
}

function updateJoke(req,res){
    console.log(req.body)
    const {topic,title,content}=req.body;
    const id=req.params.updId;
    const values=[topic,title,content]
    const SQL=`update joke set lineone=$1,linetwo=$2,linethree=$3 where id=${id};`
    client.query(SQL,values)
    // .then(data=>console.log("update"))
    .then(()=>res.redirect('/favouritPage'))
}


function delJoke(req,res){
   const id= req.params.delId;
   const SQL=`delete from joke where id=${id};`
   client.query(SQL)
   .then(()=>res.redirect('/favouritPage'))
}



function favPage(req,res){
    const SQL=`select * from joke;`
    client.query(SQL)
    .then(data=>res.render('pages/fav',{fav:data.rows}))
    // .then(data=>console.log(data))
}





function addtoFav(req,res){
const {topic,title,content}=req.body;
const SQL=`insert into joke (lineone,linetwo,linethree) values($1,$2,$3);`;
const safeVAlues=[topic,title,content];
client.query(SQL,safeVAlues)
.then(data=>res.redirect('/favouritPage'))

    
}

function Joke(item){
    this.type=item.type;
    this.setup=item.setup;
    this.punchline=item.punchline;
}
function homefunc(req,res){
    console.log('home')
    const URL=`https://official-joke-api.appspot.com/jokes/programming/ten`;
    superagent.get(URL)
    .then(data=>data.body.map(item=>new Joke(item)))
    .then(result=>res.render('index',{joke:result}))
    .catch(error=>res.status(500).errorhandler(error))
    // .then(data=>res.send(data.body))
    // res.render('index')
}







function errorhandler(error,req,res){
    res.send(error)
}

client.connect()
.then(data=>{
    server.listen(PORT,()=>console.log("You are listening on PORT:",PORT))
})

server.get('*',(req,res)=>{
    res.status(404).send('Wrong Routes ♥♠♦♥☻☺☻♥♠♦♥')
})



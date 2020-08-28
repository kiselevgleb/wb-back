const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const path = require('path');
// const fs = require('fs');
// const public = path.join(__dirname, './public')
const app = new Koa();
// const uuid = require('uuid');

const mongoose = require('mongoose');
const Item = require('./model');

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({
      ...headers
    });
    try {
      return await next();
    } catch (e) {
      e.headers = {
        ...e.headers,
        ...headers
      };
      throw e;
    }
  }
  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUD, DELETE, PATCH',
    });
    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }
    ctx.response.status = 204;
  }
});

app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

let f = [];

const serve = require('koa-static');
app.use(serve('public'));

app.use(async (ctx) => {
  const {
    method,
  } = ctx.request.query;
  const {
    art,
  } = ctx.request.query;
  const {
    dateSt,
  } = ctx.request.query;
  const {
    dateEnd,
  } = ctx.request.query;
  ctx.response.set({
    'Access-Control-Allow-Origin': '*',
  });
  switch (method) {
    case 'allArt':
      console.log("All");
      let MongoKey = 'mongodb+srv://wb:454545@cluster0.hxynp.mongodb.net/wbdata';
      mongoose.connect(MongoKey);
      // Item.insertMany(resolve);
      // let art = ctx.request.body.art;
      // let dateSt = ctx.request.body.dateSt;
      // let dateEnd = ctx.request.body.dateEnd;

      // if(dateSt!=="0"&&dateEnd!=="0"){
        console.log(dateSt);
        console.log(dateEnd);
        console.log(art);
        ctx.response.body = await Item.find({
          article: art,
          date: {$gte: dateSt, $lte: dateEnd},
        });
      // }else{
      //   ctx.response.body = await Item.find({
      //   article: art
      // });
      // console.log(await Item.find({
      //   article: art
      // }));
      // }
      mongoose.connection.close();
      return;
      // fs.readdir(public, (err, files) => {
      //   console.log(files);
      //   f = [];
      //   files.forEach(file => {
      //     //           let path = public + "//" + file;
      //     //           let size = fs.statSync(path)["size"];
      //     //           if (size > 0) {
      //     //             console.log("2");
      //     f.push({
      //       path: "https://back-image-manager.herokuapp.com/" + file
      //     });
      //     //           }

      //   });
      // });
      // console.log(f);
      // ctx.response.body = f;
      // return;

      // case 'delById':
      //   const js = JSON.parse(ctx.request.body);
      //   console.log(js.num);
      //   console.log(public);
      //   fs.readdir(public, (err, files) => {
      //     files.forEach(file => {
      //       let path = public + "//" + file;
      //       console.log(path);
      //       // console.log(fs.statSync(path)["size"]);
      //       if (fs.statSync(path)["size"].toString() === js.num) {
      //         console.log(111);
      //         fs.unlink(path, (err) => {
      //           if (err) {
      //             console.log(err);
      //           } else {
      //             console.log("file was del");
      //           }
      //         });
      //       }
      //     });
      //   });

      //   return;
      //   case 'create':
      //     console.log("create");
      //     console.log(ctx.request.files.file.size);
      //     if(ctx.request.files.file.size>0){
      //     const reader = fs.createReadStream(ctx.request.files.file.path);
      //     const stream = fs.createWriteStream(path.join(public, ctx.request.files.file.size + ".png"));
      //     reader.pipe(stream);}
      //     return;
  }
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
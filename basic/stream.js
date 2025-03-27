const fs = require('fs');

const ourreadStream = fs.createReadStream(`${__dirname}/write.txt`);
const orWriteStream = fs.createWriteStream(`${__dirname}/hola.txt`);

/*
ourreadStream.on('data',(chunk)=>{

    orWriteStream.write(chunk);

}); */

ourreadStream.pipe(orWriteStream);
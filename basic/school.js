
const fromIndex = require('./index');

const objSchool =  new  fromIndex()

objSchool.on('bellRing',({period,second})=>{

        console.log(`hell world ${period} ${second}`);
})

objSchool.startPeriod();
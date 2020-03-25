var express = require('express');
var axios = require('axios');
var router = express.Router();

const customDateString = date => {
  return `${date.toISOString().substring(0,10)} ${date.toISOString().substring(11,19)}`; 
}


router.get('/', function(req, res, next) {
  // const url = "https://code.junookyo.xyz/api/ncov-moh/data.json";
  const url = "https://ncov-data.herokuapp.com/api/corona";

  axios.get(url)
    .then(response => {
      const glbDate = new Date(response.data.data.global.update * 1000);
      const vnDate = new Date(response.data.data.vietnam.update * 1000);

      response.data.data.global.update = customDateString(glbDate);
      response.data.data.vietnam.update = customDateString(vnDate);

      response.data.data.vietnam.list.forEach(element => {
        let totalSeconds = (new Date()/1000 - element.update);
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const time = `${hours}h ${minutes}m ${seconds}s`;
        element['latest'] = { time, isNew: false }
        if (hours < 24) {
          element.latest.isNew = true;
        }
        
        const date = new Date(element.update * 1000);
        element.update = customDateString(date);
      })

      response.data.data.vietnam.list.forEach(e => console.log(e.latest));

      res.render("index", {coronaData: response.data})
    })
    .catch(error => {
      console.log(error);
    })
  
});



module.exports = router;

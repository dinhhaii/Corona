var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const url = "https://code.junookyo.xyz/api/ncov-moh/data.json";
  axios.get(url)
    .then(response => {
      // console.log(response.data);
      res.render("index", {coronaData: response.data})
    })
    .catch(error => {
      console.log(error);
    })
  
});

module.exports = router;

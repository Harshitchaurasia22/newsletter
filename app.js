const express = require("express");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

client.setConfig({
  apiKey: process.env.API_KEY,
  server: "us18"
})

app.post("/", function(req, res) {
  const phone = req.body.phoneNumber;
  const name = req.body.name;
  const email = req.body.email;

  const run = async () => {
    try{
      const response = await client.lists.addListMember("8ff52b1a28", {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name,
          PHONE: phone
        }
      });
      res.sendFile(__dirname + "/success.html");
    }
    catch(err){
      res.sendFile(__dirname + "/failure.html")
    };
  }

  run();

})

app.post("/failure",function(req,res){
  res.sendFile(__dirname+"/signup.html");
})

app.listen(PORT, function() {
  console.log("server is runnig!!!!");
})

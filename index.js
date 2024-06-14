const app = require("./app/config.js");
require("./routes.js")

app.listen(3000, (err)=>{
    if(!err){
        console.log({
            message: "success"
        })
    }
})
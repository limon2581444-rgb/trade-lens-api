const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({limit:"10mb"}));


app.post("/analyze", async(req,res)=>{

try{

const image=req.body.image;

if(!image){
return res.status(400).json({
error:"No image"
});
}


const response = await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="+process.env.GEMINI_KEY,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

contents:[
{
parts:[
{
text:"Analyze this candlestick chart. Give only direction UP or DOWN with short reason."
},
{
inline_data:{
mime_type:"image/png",
data:image.split(",")[1]
}
}
]
}
]

})
});


const data=await response.json();


let result =
data.candidates?.[0]?.content?.parts?.[0]?.text 
|| "No result";


res.json({
prediction:result
});


}catch(error){

res.status(500).json({
error:error.message
});

}

});


app.listen(3000,()=>{
console.log("TradeLens API Running");
});

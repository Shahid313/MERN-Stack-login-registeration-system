const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { urlencoded } = require('express');

const app = express();
app.use(express.json());
app.use(urlencoded({extended:false}));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/loginRegisterDB',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}, () => {
    console.log("DB connected");
});

const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const User = new mongoose.model('User', UserSchema);

//Routes

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    User.findOne({email:email}, (err, user) => {
        if(user){
            if(user.password === password){
                res.send({message:"Logged In Successfully", user:user, isLoggedIn:true})
            }else{
                res.send({message:"Password didn't match", isLoggedIn:false})
            }
        }else{
            res.send({message:"User doesn't exist", isLoggedIn:false})
        }
    })
});

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    User.findOne({email:email}, (err, user) => {
        if(user){
            res.send({message:"User already exists", isRegistered:false});
        }else{
            const user = new User({
                name,
                email,
                password
            });
        
            user.save(err => {
                if(err){
                    res.send(err)
                }else{
                    res.send({message:"User Registered Successfully", isRegistered:true})
                }
            });
        }
    })
    
});

app.listen(3000, () => {
    console.log("Server is running at 3000");
});
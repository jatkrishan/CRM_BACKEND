const constant = require("../units/constants")
const User = require("../model/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authConfig = require("../config/auth.config")

sigiup = async (req, res) => {
const userType = req.body.userType;
let userStatus = req.body.userStatus;
if(userType === constant.userType.customer || userType === constant.userType.admin){
    userStatus = constant.userStatus.approved
    
}else
 {

 userStatus = constant.userStatus.pending;

}
try{
    console.log(req.body)
    
    const createUser = await User.create({
        userName: req.body.userName,
        userId: req.body.userId,
        email: req.body.email,
        userStatus: userStatus,
        userType: req.body.userType,
        password: bcrypt.hashSync(req.body.password, 8)
      
    })
   
    const postResponce = {
        userName: createUser.userName,
        userId: createUser.userId,
        email: createUser.email,
        userStatus: createUser.userStatus,
        userType: createUser.userType,
        createdAt: createUser.createdAt,
        updatedAt: createUser.updatedAt

    }
    
  return res.status(200).send(postResponce);
 
}catch(e){
    return res.status(500).json({message: "Some intrnal error occured by user" , e})
}
}



sigin = async (req,res) => {
    const userId = await User.findOne({userId:req.body.userId})
    if(!userId){
        return res.status(400).send({message: "userId does'd exccit"})
    }
    if(!req.body.userId){
        res.status(400).send({massage: "Faild! usrId is required"})
   return;
    }
    if(!req.body.password){
        res.status(400).send({massage: "Faild! password is proviede"})
   return;
    }
    const isValidPassword = bcrypt.compareSync(req.body.password,userId.password)
    if(!isValidPassword){
       return res.status(400).send({message: "Faild! password is invalid"})
    }
   
 
    let token = jwt.sign({id: userId.userId}, authConfig.secretKey,{
        expiresIn: 86400
    })
 
    return  res.status(200).send({
        userName:  userId.userName,
        userType:  userId.userType,
        email:  userId.email,
        userStatus:  userId.userStatus,
        userId:  userId.userId,
        createdAt: userId.createdAt,
        updatedAt:  userId.updatedAt,
        token: token
    })

    }
        

   



let authController = {
    sigin  : sigin,
    sigiup : sigiup
}

module.exports = authController;
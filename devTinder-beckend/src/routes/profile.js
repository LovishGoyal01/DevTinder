const express = require("express");
const profileRouter = express.Router();

const {userAuth} = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bycrypt = require("bcrypt");
const validator = require("validator");
const openai = require("../utils/openai.js");

const USER_SAFE_DATA = ["firstName", "lastName", "photoURL", "age", "gender", "about", "skills"];

profileRouter.get("/view", userAuth, async (req,res)=>{
   try{
      const user = req.user;

      res.json({success:true, message:"Profile fetched successfully", user});
   }catch(error){
      res.json({success:false, message: error.message}); 
   }
});

profileRouter.patch("/edit", userAuth, async (req,res)=>{
 
   try{
       validateEditProfileData(req)

       const loggedInUser = req.user;

       USER_SAFE_DATA.forEach((key) => {
         if (req.body[key] !== undefined) {
            loggedInUser[key] = req.body[key];
         }
       });
       
       await loggedInUser.save({ runValidators: true });
   
       res.json({success:true ,message : `${loggedInUser.firstName} your profile was updated successfully`, user: loggedInUser});
     }catch(error){
       res.json({success:false, message: error.message});
     }
});  


profileRouter.get("/gptAbout", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const gptResult = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You generate concise, professional developer bios for DevTinder."
        },
        {
          role: "user",
          content: `Write a single About section with these rules:
                   - Maximum 150 characters and Minimum 100 characters
                   - Exactly one sentence
                   - No emojis

                   User data: Gender: ${loggedInUser.gender} About: ${loggedInUser.about} Skills: ${loggedInUser.skills?.join(", ")}`
        }
      ],
      max_tokens: 80
    });

    const generatedAbout = gptResult.choices[0].message.content.trim();

    res.json({ success: true, message: `${loggedInUser.firstName}, your GPT profile was generated successfully`, about: generatedAbout});
    } catch (error) {
      res.status(500).json({ success: false, message: error.message});
    }
});


profileRouter.patch("/editpassword", userAuth, async (req,res) =>{
 
   try{
      if(!validator.isStrongPassword(req.body.password)){
         throw new Error("Create a Strong Password");
      }
      const newPassword = req.body.password;

      const passwordHash = await bycrypt.hash(newPassword,10);

      const user = req.user;

      user.password = passwordHash;

      await user.save();
      res.json({success:true ,message: "Your password updated successfully"});

   }catch(error){
      res.json({success:false, message: error.message});
   }
});


module.exports = profileRouter;


const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored" , "interested" , "accepted" , "rejected"],
            message: `{Value} is incorrect status type`,
        }
    }
},{
    timestamps:true,
});

connectionRequestSchema.pre("save", function(next) {
 
   const connectionRequest = this;
   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send user request to yourself!!!");
   } 
  next();
});

connectionRequestSchema.index({fromUserId:1 , toUserId:1});

const ConnectionRequest = new mongoose.model("Connection Request", connectionRequestSchema);

module.exports = ConnectionRequest;
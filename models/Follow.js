// const followsCollection = require('../db').db().collection('follows')
// const usersCollection = require('../db').db().collection('users')
// const ObjectID = require('mongodb').ObjectID
// const User = require('./User')

// let Follow = function(followedUsername, authorId){
//     this.followedUsername = followedUsername
//     this.authorId = authorId
//     this.errors = []
// }

// Follow.prototype.cleanUp = function(){
//     if(typeof(this.followedUsername) != "string"){this.followedUsername=""}
// }

// Follow.prototype.validate = async function(action){
//     let followedAccount = await usersCollection.findOne({username:this.followedUsername})
//     if(followedAccount){
//         this.follwedId = followedAccount._id
//     }else{
//         this.errors.push("Cannot follow a user that doesn't exist'")
//     }

//     let doesFollowAlreadyExist = await followsCollection.findOne({followedId: this.follwedId, authorId: new ObjectID(this.authorId)})
//     if(action == "follow"){
//         if(doesFollowAlreadyExist){this.errors.push("You are already following")}
//     }
//     if(action == "unfollow"){
//         if(!doesFollowAlreadyExist){this.errors.push("You are already not following")}
//     }

//     if(this.follwedId.equals(this.authorId)) {this.errors.push("You cannot follow yourself")}
// }

// Follow.prototype.create = function(){
//     return new Promise(async (resolve, reject)=>{
//         this.cleanUp()
//         await this.validate("follow")
//         if(!this.errors.length){
//             await followsCollection.insertOne({followedId: this.follwedId, authorId: new ObjectID(this.authorId)})
//             resolve()
//         }else{
//             reject(this.errors)
//         }
//     })
// }

// Follow.isVisitorFollowing = async function(followedId, visitorId) {
//     let followDoc = await followsCollection.findOne({followedId: followedId, authorId: new ObjectID(visitorId)})
//     if(followDoc){
//         return true
//     }else{
//         return false
//     }
// }

// Follow.prototype.delete = function(){
//     return new Promise(async (resolve, reject)=>{
//         this.cleanUp()
//         await this.validate("unfollow")
//         if(!this.errors.length){
//             await followsCollection.deleteOne({followedId: this.follwedId, authorId: new ObjectID(this.authorId)})
//             resolve()
//         }else{
//             reject(this.errors)
//         }
//     })
// }

// Follow.getFollowersById = function(id){
//     return new Promise(async(resolve, reject)=>{
//         try{
//             let followers = await followsCollection.aggregate([
//                 {$match: {followedId: id}},
//                 {$lookup: {from: "users", localField: "authorId", foreignField: "_id", as: "userDoc"}},
//                 {$project:{
//                     username: {$arrayElemAt: ["$userDoc.username", 0]},
//                     email: {$arrayElemAt: ["$userDoc.email", 0]}
//                 }}
//             ]).toArray()
//             followers = followers.map(follower=>{
//                 let user = new User(follower, true)
//                 return {username: follower.username, avatar: user.avatar}
//             })

//             resolve(followers)
//         }catch{
//             reject("errors in follow model")
//         }
//     })
// }

// Follow.getFollowingById = function(id){
//     return new Promise(async (resolve, reject) =>{
//       try{
//         let followers = await followsCollection.aggregate([
//             {$match: {authorId: id}},
//             {$lookup: {from: "users", localField: "followedId", foreignField: "_id", as: "userDoc"}},
//             {$project: {
//                 username: {$arrayElemAt: ["$userDoc.username", 0]},
//                 email: {$arrayElemAt: ["$userDoc.email", 0]}
//             }}
//         ]).toArray()
//         followers = followers.map(function(follower) {
//             //create a user
//             let user = new User(follower, true)
//             return {username: follower.username, avatar: user.avatar}
//         })
//         resolve(followers)
  
//       }  catch{
//         reject()
//       }
//     })
//   }

//   Follow.countFollowersById = function(id){
//     return new Promise(async (resolve, reject) => {
//       let followerCount = await followsCollection.countDocuments({followedId: id})
//       resolve(followerCount)
//     })
//   }
//   Follow.countFollowingById = function(id){
//     return new Promise(async (resolve, reject) => {
//       let count = await followsCollection.countDocuments({authorId: id})
//       resolve(count)
//     })
//   }

// module.exports = Follow




// Follow.js

const { getDb } = require('../db');
const { ObjectId } = require("mongodb"); // Use ObjectID directly from mongodb package

const followsCollection = getDb().collection("follows");

let Follow = function (followedUsername, authorId) {
    this.followedUsername = followedUsername;
    this.authorId = authorId;
    this.errors = [];
};

Follow.prototype.cleanUp = function () {
    if (typeof (this.followedUsername) != "string") { this.followedUsername = ""; }
};

Follow.prototype.validate = async function (action) {
    // followedUsername must exist in the database
    let followedAccount = await followsCollection.findOne({ username: this.followedUsername });
    if (followedAccount) {
        this.followedId = followedAccount._id;
    } else {
        this.errors.push("You cannot follow a user that does not exist.");
    }

    let doesFollowAlreadyExist = await followsCollection.findOne({ followedId: this.followedId, authorId: new ObjectId(this.authorId) });
    if (action == "create") {
        if (doesFollowAlreadyExist) { this.errors.push("You are already following this user."); }
    }
    if (action == "delete") {
        if (!doesFollowAlreadyExist) { this.errors.push("You cannot stop following someone you do not already follow."); }
    }

    // should not be able to follow yourself
    if (this.followedId.equals(this.authorId)) { this.errors.push("You cannot follow yourself."); }
};

Follow.prototype.create = function () {
    return new Promise(async (resolve, reject) => {
        this.cleanUp();
        await this.validate("create");
        if (!this.errors.length) {
            await followsCollection.insertOne({ followedId: this.followedId, authorId: new ObjectId(this.authorId) });
            resolve();
        } else {
            reject(this.errors);
        }
    });
};

Follow.prototype.delete = function () {
    return new Promise(async (resolve, reject) => {
        this.cleanUp();
        await this.validate("delete");
        if (!this.errors.length) {
            await followsCollection.deleteOne({ followedId: this.followedId, authorId: new ObjectId(this.authorId) });
            resolve();
        } else {
            reject(this.errors);
        }
    });
};

Follow.isVisitorFollowing = async function (followedId, authorId) {
    let followDoc = await followsCollection.findOne({ followedId: new ObjectId(followedId), authorId: new ObjectId(authorId) });

    return followDoc ? true : false;
};

Follow.countFollowersById = function (userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const followerCount = await followsCollection.countDocuments({ followedId: new ObjectId(userId) });
            resolve(followerCount);
        } catch (error) {
            reject(error);
        }
    });
};

Follow.countFollowingById = function (userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const followingCount = await followsCollection.countDocuments({ authorId: new ObjectId(userId) });
            resolve(followingCount);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = Follow;



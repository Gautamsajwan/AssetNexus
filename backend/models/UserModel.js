import mongoose from 'mongoose';

const UserModel = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    brandName:{
        type: String,
        required: true,
    }
})

 const User = mongoose.model('User', UserModel);
 export default User;
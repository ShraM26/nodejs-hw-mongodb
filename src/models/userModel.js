import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /.+\@.+\..+/ // Валідація формату електронної пошти
  },
  password: { 
    type: String, 
    required: true 
  },
}, {
  timestamps: true, // Додає createdAt та updatedAt автоматично
  versionKey: false,
});

const User = mongoose.model('User', userSchema);

export default User;

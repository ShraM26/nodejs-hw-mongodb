import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Перевірка на валідність email
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Додає поля createdAt і updatedAt автоматично
    versionKey: false,
  }
);

const User = mongoose.model('user', userSchema);

export default User;
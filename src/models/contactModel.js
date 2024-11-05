import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phoneNumber: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    photo: { type: String, default: null },  // Поле для зберігання посилання на фото
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, enum: ['work', 'home', 'personal'], required: true },
  },
  {
    timestamps: true,
    toJSON: { versionKey: false },
  }
);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
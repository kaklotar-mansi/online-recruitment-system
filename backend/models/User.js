import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["admin", "applicant"],
      default: "applicant",
    },
    phone: { type: String, default: "" },
  },
  { timestamps: true }
);

// Plain-text comparison (no hashing) — for local testing/learning only.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return enteredPassword === this.password;
};

export default mongoose.model("User", userSchema);
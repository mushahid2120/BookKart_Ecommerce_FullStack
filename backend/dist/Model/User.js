import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, default: null, unique: true },
    password: { type: String, default: null },
    googleId: { type: String, default: null },
    profilePicture: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    isVerified: { type: Boolean, required: true, default: false },
    verificationToken: { type: String, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPaswordExpires: { type: Date, default: new Date(Date.now() + 10000 * 60 * 60) },
    agreeTerms: { type: Boolean, required: true, default: false },
    address: [{ type: Schema.Types.ObjectId, default: [], ref: "Address" }],
}, {
    timestamps: true,
    strict: "throw",
});
UserSchema.pre('save', async function () {
    if (!this.isModified("password"))
        return;
    try {
        if (this.password)
            this.password = await bcrypt.hash(this.password, 12);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
UserSchema.methods.comparePassword = async function (enterPassword) {
    return bcrypt.compare(enterPassword, this.password);
};
const User = model('User', UserSchema);
export default User;

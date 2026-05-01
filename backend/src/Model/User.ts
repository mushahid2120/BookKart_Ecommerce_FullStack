import { model, Schema } from "mongoose";
import bcrypt from "bcrypt"

export interface  IUser extends Document{
    name:string;
    email:string | null;
    password:string | null;
    googleId:string | null;
    profilePicture:string | null;
    phoneNumber:string | null;
    isVerified:boolean;
    verificationToken:string | null;
    resetPasswordToken:string | null;
    resetPaswordExpires:Date | null;
    agreeTerms:boolean;
    address:Schema.Types.ObjectId[]
    comparePassword(candidatePassword:string):Promise<boolean>
}

const UserSchema=new Schema<IUser>({
    name:{type:String,required:true},
    email:{type:String,default:null,unique:true},
    password:{type:String,default:null},
    googleId:{type:String,default:null},
    profilePicture:{type:String,default:null},
    phoneNumber:{type:String,default:null},
    isVerified:{type:Boolean,required:true,default:false},
    verificationToken:{type:String,default:null},
    resetPasswordToken:{type:String,default:null},
    resetPaswordExpires:{type:Date,default:new Date(Date.now()+10000*60*60)},
    agreeTerms:{type:Boolean,required:true,default:false},
    address:[{type:Schema.Types.ObjectId,default:[],ref:"Address"}],
},{
    timestamps:true,
    strict: "throw",
}
)

UserSchema.pre('save', async function () {
  if (!this.isModified("password")) return ;

  try {
    if(this.password)
        this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    console.log(error);
    throw error
  }
});

UserSchema.methods.comparePassword = async function (enterPassword:string) {
  return bcrypt.compare(enterPassword, this.password);
};


const User = model<IUser>('User',UserSchema)

export default User;
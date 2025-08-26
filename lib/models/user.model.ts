// 导入所有需要的类型：mongoose, Document, Model, Schema
import mongoose, { Document, Model } from "mongoose";

// 1. 定义文档的 TypeScript 接口
export interface IUser extends Document {
    id: string;
    username: string;
    name: string;
    image?: string;
    bio?: string;
    threads: mongoose.Schema.Types.ObjectId[];
    onboarded: boolean;
    communities: mongoose.Schema.Types.ObjectId[];
}

const userSchema = new mongoose.Schema({
    id: {type: String, required: true},
    username: { type: String, required: true , unique: true},
    name: { type: String, required: true },
    image: String,
    bio: String,
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread"
        }
    ],
    onboarded: {
        type: Boolean,
        default: false,
    },
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community"
        }
    ]

});

// 使用 Schema 创建 Model，如果数据库中没有 "users" 集合，Mongoose 会自动创建
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
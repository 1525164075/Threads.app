// 导入所有需要的类型：mongoose, Document, Model, Schema
import mongoose, { Document, Model } from "mongoose";

// 1. 定义文档的 TypeScript 接口
export interface ICommunity extends Document {
    id: string;
    username: string;
    name: string;
    image?: string;
    bio?: string;
    createdBy: mongoose.Schema.Types.ObjectId[];
    members: mongoose.Schema.Types.ObjectId[];
    threads: mongoose.Schema.Types.ObjectId[];
}

const communitySchema = new mongoose.Schema({
    id: {type: String, required: true},
    username: { type: String, required: true , unique: true},
    name: { type: String, required: true },
    image: String,
    bio: String,
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Community'
    },
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread"
        }
    ],
    members:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community"
        }
    ]

});

const Community: Model<ICommunity> = mongoose.models.Community || mongoose.model<ICommunity>("Community", communitySchema);

export default Community;
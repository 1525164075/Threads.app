// 导入所有需要的类型：mongoose, Document, Model, Schema
import mongoose, { Document, Model } from "mongoose";
import { string } from "zod";

// 1. 定义文档的 TypeScript 接口
export interface IThread extends Document {
    text: string;
    author: mongoose.Schema.Types.ObjectId[];
    createdAt: Date;
    communities: mongoose.Schema.Types.ObjectId[];
    parentId: string;
    children: mongoose.Schema.Types.ObjectId[];
}

const threadSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId: {
        type: String
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread"
        }
    ]


});

// 使用 Schema 创建 Model，如果数据库中没有 "Thread" 集合，Mongoose 会自动创建
const Thread: Model<IThread> = mongoose.models.Thread || mongoose.model<IThread>("Thread", threadSchema);

export default Thread;

import mongoose, { Document, Model, Schema } from "mongoose";

// 1. 修正后的 TypeScript 接口
export interface IThread extends Document {
    text: string;
    author: mongoose.Schema.Types.ObjectId; // 修正：author 是单个对象，不是数组
    community?: mongoose.Schema.Types.ObjectId; // 修正：字段名为 community (单数)，且是可选的
    createdAt: Date;
    parentId?: string;
    children: mongoose.Schema.Types.ObjectId[];
}

// 2. Mongoose Schema (你的这部分是正确的)
const threadSchema = new Schema<IThread>({
    text: { type: String, required: true },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: "Community",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    parentId: {
        type: String,
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: "Thread",
        },
    ],
});

// 3. 创建并导出 Model
const Thread: Model<IThread> = mongoose.models.Thread || mongoose.model<IThread>("Thread", threadSchema);

export default Thread;
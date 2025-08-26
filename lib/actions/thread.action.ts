"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createThread({ text, author, communityId, path }: Params) {
    try {
        connectToDB();
        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

        //update User model
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating thread: ${error.message}`)
    }


};

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    //pagnation
    const skipAmount = (pageNumber - 1) * pageSize
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createAt: 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: 'User' })
        .populate({
            path: "children", // 1. 查找帖子的所有子评论
            populate: [      // 2. 对于每一个子评论，我们想做两件事，所以这里用数组
                {
                    // 3. 第一件事：查找这个子评论的作者
                    path: 'author',
                    model: User,
                    select: "_id name parentId image"
                },
                // 你可以根据需要在 fetchPosts 中决定是否需要查询评论的回复
                // 如果在首页列表不需要显示评论的回复，可以省略下面这个对象
                {
                    // 4. 第二件事：查找这个子评论自己的子评论（即对评论的回复）
                    path: 'children',
                    model: Thread,
                    populate: { // 5. 对于“评论的回复”，再查找它的作者
                        path: 'author',
                        model: User,
                        select: "_id name image"
                    }
                }
            ]
        });

    const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
}

export async function fetchThreadById(threadId: string) {
    connectToDB();
    try {
        const thread = await Thread.findById(threadId)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image",
            })
            .populate({
                path: "children", // 1. 查找帖子的所有子评论
                populate: [      // 2. 对于每一个子评论，我们想做两件事，所以这里用数组
                    {
                        // 3. 第一件事：查找这个子评论的作者
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        // 4. 第二件事：查找这个子评论自己的子评论（即对评论的回复）
                        path: 'children',
                        model: Thread,
                        populate: { // 5. 对于“评论的回复”，再查找它的作者
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            })
            .exec();
        return thread;
    } catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }


}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
) {
    //1. 数据库连接
    connectToDB();
    try {

        //2. 查找原始 Thread
        const originalThread = await Thread.findById(threadId);

        if (!originalThread) {
            throw new Error("Thread not found")
        }

        //3.创建评论 Thread
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })

        //4. 保存评论
        const savedCommentThread = await commentThread.save();


        //5. 更新原始线程
        originalThread.children.push(savedCommentThread._id as any);

        await originalThread.save();

        //6. 重新验证缓存
        revalidatePath(path);

    } catch (error: any) {
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }
}
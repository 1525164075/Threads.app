import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser, fetchUserPosts, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import Link from "next/link";

const Page = async () => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    //get Acitivty
    const activity = await getActivity(userInfo.id)

    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>
            <section className="mt-10 flex flex-col gap-5">
                {activity.length > 0 ? (
                    <>
                    {activity.map((activity: any) => (
                        <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                           <article className="activity-card">
                            <Image
                                src={activity.author.image}
                                alt="Profile Picture"
                                width={30}
                                height={30}
                                className="rounded-full object-cover"/>
                            <p className="!text-small-regular text-light-1">
                                <span className="mr-1 text-primary-500">
                                    {activity.author.name}
                                </span>{""}
                                repiled to your thread.
                            </p>
                            
                            </article>  
                        </Link>
                    ))}
                        </>
                ): <p className="!text-base-regular text-light-3">No activity yet</p>}
            </section>
        </section>
    )

}
export default Page
"use client";

import Profile from "@components/Profile";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function UserProfile() {
  const router = useRouter();
  const profileId = usePathname().replace("/profile/", "");

  const { data: session } = useSession();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // if (session?.user.id === profileId) {
    //   console.log(session?.user.id);
    //   router.push("/profile");
    // }
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${profileId}/posts`);
      const data = await response.json();

      setPosts(data.filter((post) => post.creator._id === profileId));
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post) => {
    console.log("fuck");
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure want to delete this prompt?");
    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });
        const filteredPosts = posts.filter((p) => p._id !== post._id);

        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name={`${profileId}'s`}
      desc={`Welcome to ${profileId}'s personalized profile page`}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
}

export default UserProfile;

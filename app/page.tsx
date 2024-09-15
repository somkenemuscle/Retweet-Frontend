'use client'
import CreateInteractionForm from "@/components/shared/createTweetForm";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";


export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setUsername(username);
    }

  }, []);

  const handleLogout = async () => {
    try {
      // Send request to backend to invalidate the session or token
      const res = await axiosInstance.post('/auth/logout', {}, { withCredentials: true });

      const { message } = res.data;
      // Clear any local storage or session data
      localStorage.removeItem('token');
      localStorage.removeItem('username');

      // Redirect user to login or home page
      router.push('/sign-in');

      // Show success message
      toast({
        className: "shadcn-toast-success",
        description: message
      });
    } catch (error) {
      console.error('Error occurred during logout:', error);
      toast({
        className: "shadcn-toast-failure",
        description: 'An error occurred during logout. Please try again.'
      });
    }
  };

  return (
    <div>
      <CreateInteractionForm
        action="Add"
      />

      {username ? (
        <div>
          <p>{username} is logged in currently</p>
          <button onClick={() => handleLogout()}>
            Logout
          </button>
        </div>

      ) : (
        <div>
          <p>No one is logged in currently</p>
          <Link href={'/sign-in'}>
            <button>
              Sign In
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

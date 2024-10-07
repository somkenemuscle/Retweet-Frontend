interface Tweet {
   _id: string;
   text?: string;
   image?: string;
   author: {
      username: string;
      verification: boolean;
   }
   comments: [
      {
         _id: string;
         comment: string;
         author: {
            _id: string;
            username: string;
            verification: boolean;
         }
      }
   ];
   createdAt: string;
   updatedAt: string;
   likes: {
      username: string;
   }[];
}




interface TweetCardProps {
   id: string;
   username: string;
   text?: string;
   image?: string; // optional
   createdAt: string; // include createdAt prop
   likes: {
      username: string;
   }[];
   verification: boolean;
   handleLikes: (id: string) => void;
}

interface CommentCardProps {
   username: string;
   text: string;
   createdAt: string; // include createdAt prop
   verification: boolean;
}



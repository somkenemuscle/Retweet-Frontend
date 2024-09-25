interface Tweet {
   _id: string;
   text?: string;
   image?: string;
   author: {
      username: string;
   }// Assuming `author` is just the ObjectId as a string
   comments: [
      {
         _id: string;
         comment: string;
         author: {
            _id: string;
            username: string;
         }
      }
   ];
   createdAt: string;
   updatedAt: string;
}



interface TweetCardProps {
   id: string;
   username: string;
   text?: string;
   image?: string; // optional
   createdAt: string; // include createdAt prop
}

interface CommentCardProps {
   username: string;
   text: string;
   createdAt: string; // include createdAt prop
}



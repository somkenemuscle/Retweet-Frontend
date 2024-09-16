interface Tweet {
    _id: string;
    text?: string;
    image?: string;
    author: {
       username: string; 
    }// Assuming `author` is just the ObjectId as a string
    comments: string[]; // Assuming `comments` are ObjectIds stored as strings
    createdAt: string; // createdAt and updatedAt will be Date strings in JSON format
    updatedAt: string;
  }
  
// appwrite.js
import { Client, Databases, Storage, Functions } from "appwrite";

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)  
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); 

// Export SDK services
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Database + Bucket IDs
export const DATABASE_ID = "bytebao_db";      
export const BUCKET_ID = "bytebao_storage";     

// Collections
export const COLLECTIONS = {
  TRANSCRIPTS: "transcripts",       // transcripts collection
  BLOG_POSTS: "blog_posts",         // blog posts collection
  SNIPPETS: "snippets",             // social snippets collection
  PUBLISH_QUEUE: "publish_queue",   // publishing queue collection
};

// Functions
export const FUNCTIONS = {
  TRANSCRIBE: "transcribe_func", 
  BLOG_GEN: "blog_gen_func",       
  SNIPPETS: "snippets_func",       
}
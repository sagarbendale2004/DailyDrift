import config from "../config/config";
import { Client, Databases, Storage, ID, Query } from "appwrite";

class Service {
  client;
  databases;
  bucket;

  constructor() {
    this.client = new Client()
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredimage, status, userId }) {
    try {
      const documentId = slug || ID.unique();

      if (!title || !slug || !content || !featuredimage || !status || !userId) {
        throw new Error("Missing required fields");
      }

      return await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        documentId,
        {
          title,
          content,
          slug,
          featuredimage,
          status,
          userId,
        }
      );
    } catch (error) {
      console.error("Appwrite service :: createPost :: error", error);
      throw error;
    }
  }

  async updatePost(slug, { title, content, featuredimage, status }) {
    try {
      const response = await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredimage,
          status,
        }
      );

      return response;
    } catch (error) {
      console.error("Appwrite service :: updatePost :: error", error);
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.error("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      const document = await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      );

      if (!document || !document.$id) {
        throw new Error(`Document not found for slug: ${slug}`);
      }

      return document;
    } catch (error) {
      console.error("Appwrite service :: getPost :: error", error);
      throw error;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      const response = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        queries
      );

      return response;
    } catch (error) {
      console.error("Appwrite service :: getPosts :: error", error);
      return null;
    }
  }

  async uploadFile(file) {
    try {
      const response = await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );

      return response;
    } catch (error) {
      console.error("Appwrite service :: uploadFile :: error", error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(config.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(config.appwriteBucketId, fileId);
  }
}

const service = new Service();
export default service;

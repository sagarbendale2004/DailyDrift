import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  Databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.Databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredimage, status, userId }) {
    try {
      return await this.Databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredimage,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("error in createPost", error);
      throw error;
    }
  }

  async updatePost(slug, { title, content, featuredimage, status }) {
    try {
      return await this.Databases.updateDocument(
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
    } catch (error) {
      console.log("error in updatePost", error);
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      await this.Databases.deleteDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("error in deletePost", error);
      throw error;
    }
  }

  async getPost(slug) {
    try {
      return await this.Databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("error in getPost", error);
      throw error;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.Databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("error in getPosts", error);
      throw error;
    }
  }

  // file upload service

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("error in uploadFile", error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.bucket.deleteFile(config.appwriteBucketId, fileId);
    } catch (error) {
      console.log("error in deleteFile", error);
      throw error;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(config.appwriteBucketId, fileId);
  }
}

const service = new Service();
export default service;

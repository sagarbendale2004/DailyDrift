import config from "../config/config";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.account = new Account(this.client);
  }

  // Create a new account and log in the user
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        // If account creation is successful, log in the user
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  // Log in the user
  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  // Get the current logged-in user's information
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      if (
        error.message.includes("User (role: guests) missing scope (account)")
      ) {
        console.error("User is not authenticated. Please log in.");
      } else {
        console.error("Error getting current user:", error);
      }
      throw error;
    }
  }

  // Log out the current user
  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;

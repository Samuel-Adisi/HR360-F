import api from "./api";

/**
 * Face Authentication Service
 * Handles face registration, login, status check, and deletion
 */

const faceAuthService = {
  /**
   * Check if user has face authentication enabled
   * @returns {Promise} Face auth status
   */
  checkFaceStatus: async () => {
    try {
      const response = await api.get("/api/face/status/");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Check face status error:", error.response?.data);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to check face status",
      };
    }
  },

  /**
   * Register face for authenticated user
   * @param {string} username - Username
   * @param {object} imageUri - Image URI from camera/gallery
   * @returns {Promise} Registration result
   */
  registerFace: async (username, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("username", username);

      // Extract filename from URI
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("image", {
        uri: imageUri,
        name: filename,
        type: type,
      });

      const response = await api.post("/api/face/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Face registration error:", error.response?.data);
      return {
        success: false,
        error: error.response?.data?.error || "Face registration failed",
        details: error.response?.data,
      };
    }
  },

  /**
   * Login using face authentication
   * @param {string} username - Username
   * @param {object} imageUri - Image URI from camera
   * @returns {Promise} Login result with tokens
   */
  loginWithFace: async (username, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("username", username);

      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("image", {
        uri: imageUri,
        name: filename,
        type: type,
      });

      const response = await api.post("/api/face/login/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data,
        tokens: {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
        },
        user: response.data.user,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Face login error:", error.response?.data);
      return {
        success: false,
        error: error.response?.data?.error || "Face login failed",
        attemptsRemaining: error.response?.data?.attempts_remaining,
        details: error.response?.data,
      };
    }
  },

  /**
   * Delete face registration
   * @returns {Promise} Deletion result
   */
  deleteFace: async () => {
    try {
      const response = await api.delete("/api/face/delete/", {
        data: { confirm: true },
      });

      return {
        success: true,
        data: response.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Face deletion error:", error.response?.data);
      return {
        success: false,
        error: error.response?.data?.error || "Failed to delete face",
      };
    }
  },
};

export default faceAuthService;

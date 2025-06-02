// src/services/authService.ts
export const API_URL = "https://intership-project3-3.onrender.com/api";

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    
    // Ensure we're storing the correct user data
    const userData = {
      _id: data.user?._id || data._id,
      name: data.user?.name || data.name,
      email: data.user?.email || data.email,
      role: data.user?.role || data.role || 'volunteer',
      token: data.token
    };

    // Store token and user data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const getUserId = (): string | null => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData._id;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }
  return null;
};

export const authHeader = (): { Authorization: string } | {} => {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

export const isAdmin = (): boolean => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      // Comprehensive role check
      console.log('Current user role:', userData.role);
      return userData.role === "admin";
    } catch (error) {
      console.error("Error parsing user data:", error);
      return false;
    }
  }
  return false;
};

export const mockLogin = (userRole: 'admin' | 'volunteer' = 'admin') => {
  const mockUser = {
    _id: "mock-user-id",
    name: userRole === 'admin' ? "Admin User" : "Volunteer User",
    email: userRole === 'admin' ? "admin@example.com" : "volunteer@example.com",
    role: userRole,
    token: "mock-jwt-token"
  };

  localStorage.setItem("token", mockUser.token);
  localStorage.setItem("user", JSON.stringify(mockUser));
  return mockUser;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return true;
};
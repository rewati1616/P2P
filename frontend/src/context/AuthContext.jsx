const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      email,
      password
    });

    // Save token & user
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return true;

  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);

    const msg = error.response?.data?.message || "Invalid credentials";
    // You can show this msg in your UI instead of hard-coded "Invalid credentials"
    alert(msg);        // temporary
    // or setError(msg) if you have error state in component

    return false;
  }
};
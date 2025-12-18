import axios from "axios";

// Default to local backend during development. Override with REACT_APP_API_URL for prod.
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
	baseURL: BASE_URL,
});

export default api;

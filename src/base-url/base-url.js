import axios from "axios";

const BASE_URL = axios.create({
  baseURL: `https://vue-firebase-todo-a11bc-default-rtdb.firebaseio.com`,
});

export default BASE_URL;

import { API_URL } from "../redux/constants/Constants";
import axios from "axios";

const token = JSON.parse(localStorage.getItem('token'))
const headers = {
  Authorization: `Live ${token}`,
};

const getFactoryNameById = async (factory_id) => {
  try {
    const response = await axios.get(
      `${API_URL}wp-json/custom-factory-fetch/v1/fetch-factory/${factory_id}`,{headers}
    );
    const factory = response.data;
    return factory ? factory.factory_name : "Factory Not Found";
  } catch (error) {
    console.error("Error fetching factories:", error);
    return "Error fetching factory";
  }
};

export default getFactoryNameById;

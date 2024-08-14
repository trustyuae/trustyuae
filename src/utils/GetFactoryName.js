import { API_URL } from "../redux/constants/Constants";
import axiosInstance from "../utils/AxiosInstance";

const getFactoryNameById = async (factory_id) => {
  try {
    const response = await axiosInstance.get(
      `${API_URL}wp-json/custom-factory-fetch/v1/fetch-factory/${factory_id}`
    );
    const factory = response.data;
    return factory ? factory.factory_name : "Factory Not Found";
  } catch (error) {
    console.error("Error fetching factories:", error);
    return "Error fetching factory";
  }
};

export default getFactoryNameById;

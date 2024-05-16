import { API_URL } from "../redux/constants/Constants";
import axios from "axios";

const getFactoryNameById = async (factoryId) => {
  try {
    const response = await axios.get(
      `${API_URL}wp-json/custom-factory/v1/fetch-factories`
    );
    const factories = response.data;
    const factory = factories.find((factory) => factory.id === factoryId);
    return factory ? factory.factory_name : "Factory Not Found";
  } catch (error) {
    console.error("Error fetching factories:", error);
    return "Error fetching factory";
  }
};

export default getFactoryNameById;

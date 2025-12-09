import {
  responseRESTError,
} from "../../common/functions.js";
import { getPackagesService } from "../services/package.service.js";

export const getPackages = async (req, res) => {
  try {
    return await getPackagesService(req, res);
  } catch (error) {
    return responseRESTError(req, res, error);
  }
};

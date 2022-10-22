import cors from "cors";
import { projectConfig } from "../../../medusa-config";
// import authenticate from "@medusajs/medusa/dist/api/middlewares/authenticate";

const adminCorsOptions = {
  origin: projectConfig.admin_cors.split(","),
  credentials: true,
};

export default (router) => {
  router.get("/admin/brand", cors(adminCorsOptions), (req, res) => {
    res.json({
      message: "Welcome to Aurore Store!",
    });
  });
};

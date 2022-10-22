import cors from "cors";
import { projectConfig } from "../../medusa-config";
import authenticate from "@medusajs/medusa/dist/api/middlewares/authenticate";

const storeCorsOptions = {
  origin: projectConfig.store_cors.split(","),
  credentials: true,
};

const adminCorsOptions = {
  origin: projectConfig.admin_cors.split(","),
  credentials: true,
};

export default (router) => {
  router.get("/hello", cors(storeCorsOptions), (req, res) => {
    res.json({
      message: "Welcome to Aurore Store!",
    });
  });
  router.get(
    "/hello/auth",
    cors(adminCorsOptions),
    authenticate(),
    async (req, res) => {
      const id = req.user.userId;
      const userService = req.scope.resolve("userService");

      const user = await userService.retrieve(id);
      res.json({
        message: "Welcome to Aurore Store!",
        user: user,
      });
    }
  );
};

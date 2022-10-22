import { Router } from "express";
import bodyParser from "body-parser";
import brandStore from "./brand/store";
import brandAdmin from "./brand/admin";
import hello from "./hello";

export default () => {
  const router = Router();
  router.use(bodyParser.json());

  hello(router);
  brandStore(router);
  brandAdmin(router);

  return router;
};

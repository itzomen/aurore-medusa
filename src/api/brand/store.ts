import cors from "cors";
import { projectConfig } from "../../../medusa-config";

import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsObject,
  IsArray,
} from "class-validator";

import BrandService from "../../services/brand";
import { EntityManager } from "typeorm";
import { BrandSelector } from "../../types/brand";

const storeCorsOptions = {
  origin: projectConfig.store_cors.split(","),
  credentials: true,
};

export default async (router) => {
  /*
   * Get Brands
   * GET
   */
  router.get("/store/brand", cors(storeCorsOptions), async (req, res) => {
    const brandService: BrandService = req.scope.resolve("brandService");

    const selector: BrandSelector = {};

    if (req.query.followers) {
      selector.followers = req.query.followers;
    }
    if (req.query.brand_collection) {
      selector.brand_collections = req.query.brand_collections;
    }

    const { offset, limit } = req.query;

    const brands = await brandService.list(selector, {
      skip: offset,
      take: limit,
    });
    res.json({
      brands,
      count: brands.length,
      offset: offset,
      limit: limit,
    });
  });
  /*
   * Get Brand
   * GET
   */
  router.get("/store/brand/:id", cors(storeCorsOptions), async (req, res) => {
    const brandService: BrandService = req.scope.resolve("brandService");

    const brand = await brandService.retrieve(req.params.id, req.query);
    res.json({ brand });
  });
  /*
   * Get Brand by handle
   * GET
   */
  router.get(
    "/store/brand/:handle",
    cors(storeCorsOptions),
    async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService");

      const brand = await brandService.handle(req.params.handle, req.query);
      res.json({ brand });
    }
  );
  /*
   * Creates a Brand
   * POST
   */
  router.post("/store/brand", cors(storeCorsOptions), async (req, res) => {
    const brandService: BrandService = req.scope.resolve("brandService");

    const manager: EntityManager = req.scope.resolve("manager");
    const result = await manager.transaction(async (transactionManager) => {
      return await brandService
        .withTransaction(transactionManager)
        .create(req.body);
    });

    res.json({
      message: "Brand Created",
      brand: result,
    });
  });
  /*
   * Updates a Brand
   * PUT
   */
  router.put("/store/brand/:id/", cors(storeCorsOptions), async (req, res) => {
    const brandService: BrandService = req.scope.resolve("brandService");

    const manager: EntityManager = req.scope.resolve("manager");
    const result = manager.transaction(async (transactionManager) => {
      return await brandService
        .withTransaction(transactionManager)
        .update(req.params.id, req.body);
    });

    result
      .then((data) => {
        res.json({
          message: "Brand Updated",
          brand: data,
        });
      })
      .catch((err) => {
        res.json({
          message: "Brand Not Updated",
          error: err,
        });
      });
  });
  /*
   * Delete Brand
   * DELETE
   */
  router.delete(
    "/store/brand/:id",
    cors(storeCorsOptions),
    async (req, res) => {
      const { id } = req.params;
      const brandService: BrandService = req.scope.resolve("brandService");

      const manager: EntityManager = req.scope.resolve("manager");
      await manager.transaction(async (transactionManager) => {
        return await brandService
          .withTransaction(transactionManager)
          .delete(id);
      });
      res.status(200).json({ id, object: "brand", deleted: true });
    }
  );
};

export class BrandPostReq {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  handle?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  brand_collections?: string[];

  @IsArray()
  @IsOptional()
  followers?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

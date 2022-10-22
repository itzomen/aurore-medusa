import { TransactionBaseService } from "@medusajs/medusa";
import { Brand } from "../models/brand";
import { EntityManager } from "typeorm";
import { buildQuery, setMetadata } from "@medusajs/medusa/dist/utils";
import { formatException } from "@medusajs/medusa/dist/utils/exception-formatter";
import { MedusaError } from "medusa-core-utils";
import { EventBusService } from "@medusajs/medusa";
import { FindConfig, Selector } from "@medusajs/medusa/dist/types/common";
import { BrandRepository } from "../repositories/brand";
// import { TransactionBaseService } from "medusa-interfaces";
import { CreateBrandInput, FilterableBrandProps } from "../types/brand";
import { UserRepository } from "@medusajs/medusa/dist/repositories/user";
import { ImageRepository } from "@medusajs/medusa/dist/repositories/image";
import { ProductCollectionRepository } from "@medusajs/medusa/dist/repositories/product-collection";

type InjectedDependencies = {
  manager: EntityManager;
  userRepository: typeof UserRepository;
  imageRepository: typeof ImageRepository;
  productCollectionRepository: typeof ProductCollectionRepository;
  brandRepository: typeof BrandRepository;
  eventBusService: EventBusService;
};

class BrandService extends TransactionBaseService {
  static readonly Events = {
    CREATED: "brand.created",
    UPDATED: "brand.updated",
    DELETED: "brand.deleted",
  };

  protected manager_: EntityManager;
  protected transactionManager_: EntityManager | undefined;
  protected readonly brandRepository_: typeof BrandRepository;
  protected readonly imageRepository_: typeof ImageRepository;
  protected readonly productCollectionRepository_: typeof ProductCollectionRepository;
  protected readonly userRepository_: typeof UserRepository;
  protected readonly eventBus_: EventBusService;

  constructor({
    manager,
    eventBusService,
    brandRepository,
    imageRepository,
    productCollectionRepository,
    userRepository,
  }: InjectedDependencies) {
    super(arguments[0]);

    this.manager_ = manager;
    this.eventBus_ = eventBusService;
    this.brandRepository_ = brandRepository;
    this.imageRepository_ = imageRepository;
    this.productCollectionRepository_ = productCollectionRepository;
    this.userRepository_ = userRepository;
  }

  /**
   * Retrieves a specific brand.
   * @param id - the id of the brand to retrieve.
   * @param config - any options needed to query for the result.
   * @return which resolves to the requested brand.
   */
  async retrieve(
    id: string,
    config: FindConfig<Brand> = {}
  ): Promise<Brand | never> {
    const brandRepo = this.manager_.getCustomRepository(this.brandRepository_);

    const query = buildQuery({ id }, config);
    console.log("IDD", id);

    const brand = await brandRepo.findOne(query);

    if (!brand) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Brand with id: ${id} was not found.`
      );
    }

    return brand;
  }

  /** Fetches all brands related to the given selector
   * @param selector - the query object for find
   * @param config - the configuration used to find the objects. contains relations, skip, and take.
   * @param config.relations - Which relations to include in the resulting list of Brands.
   * @param config.take - How many Brands to take in the resulting list of Brands.
   * @param config.skip - How many Brands to skip in the resulting list of Brands.
   * @return brands related to the given search.
   */
  async list(
    selector: FilterableBrandProps | Selector<Brand> = {},
    config: FindConfig<Brand> = {
      skip: 0,
      take: 30,
      // relations: [],
    }
  ): Promise<Brand[]> {
    const brandRepo = this.manager_.getCustomRepository(this.brandRepository_);

    const query = buildQuery(selector, config);

    return brandRepo.find(query);
  }

  /**
   * Creates a brand associated with a given author
   * @param data - the brand to create
   * @param config - any configurations if needed, including meta data
   * @return resolves to the creation result
   */
  async create(data: CreateBrandInput): Promise<Brand> {
    return await this.atomicPhase_(async (manager) => {
      const brandRepo = manager.getCustomRepository(this.brandRepository_);
      const imageRepo = manager.getCustomRepository(this.imageRepository_);
      const productCollectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      );
      const userRepo = manager.getCustomRepository(this.userRepository_);

      const { images, brand_collections, followers, ...rest } = data;

      try {
        const brand = brandRepo.create(rest);
        if (images?.length) {
          brand.images = await imageRepo.upsertImages(images);
        }
        if (brand_collections?.length) {
          brand.brand_collections = await productCollectionRepo.findByIds(
            brand_collections
          );
        }
        if (followers?.length) {
          brand.followers = await userRepo.findByIds(followers);
        }

        const result = await brandRepo.save(brand);

        await this.eventBus_
          .withTransaction(manager)
          .emit(BrandService.Events.UPDATED, { id: result.id });

        return result;
      } catch (error) {
        throw formatException(error);
      }
    });
  }

  /**
   * Updates a given brand with a new value
   * @param brandId - the id of the brand to update
   * @param value - the new value
   * @return resolves to the updated element
   */
  async update(brandId: string, data: CreateBrandInput): Promise<Brand> {
    return await this.atomicPhase_(async (manager) => {
      const brandRepo = manager.getCustomRepository(this.brandRepository_);
      const imageRepo = manager.getCustomRepository(this.imageRepository_);
      const productCollectionRepo = manager.getCustomRepository(
        this.productCollectionRepository_
      );
      const userRepo = manager.getCustomRepository(this.userRepository_);

      const brand = await this.retrieve(brandId, {
        relations: ["images", "brand_collections", "followers"],
      });

      const {
        name,
        handle,
        description,
        images,
        brand_collections,
        followers,
        metadata,
      } = data;

      if (images) {
        brand.images = await imageRepo.upsertImages(images);
      }
      if (brand_collections) {
        brand.brand_collections = await productCollectionRepo.findByIds(
          brand_collections
        );
      }
      if (followers) {
        brand.followers = await userRepo.findByIds(followers);
      }
      brand.name = name;
      brand.handle = handle;
      brand.description = description;

      if (metadata) {
        brand.metadata = setMetadata(brand, metadata);
      }

      const result = await brandRepo.save(brand);

      await this.eventBus_
        .withTransaction(manager)
        .emit(BrandService.Events.UPDATED, { id: result.id });

      return result;
    });
  }

  /**
   * Deletes a given brand
   * @param brandId - id of the brand to delete
   */
  async delete(brandId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const brandRepo = manager.getCustomRepository(this.brandRepository_);

      const brand = await brandRepo.findOne(
        { id: brandId },
        { relations: ["images", "brand_collections", "followers"] }
      );

      if (!brand) {
        return;
      }

      await brandRepo.remove(brand);

      await this.eventBus_
        .withTransaction(manager)
        .emit(BrandService.Events.DELETED, { id: brandId });
    });
  }
}

export default BrandService;

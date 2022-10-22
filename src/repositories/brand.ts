import { EntityRepository, Repository } from "typeorm";

import { Brand } from "../models/brand";

@EntityRepository(Brand)
export class BrandRepository extends Repository<Brand> {}

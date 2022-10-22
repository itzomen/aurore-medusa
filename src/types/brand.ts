import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  ValidateNested,
} from "class-validator";
import { IsType } from "@medusajs/medusa/dist/utils/validators/is-type";

export interface CreateBrandInput {
  name: string;
  handle?: string;
  description?: string;
  images?: string[];
  brand_collections?: string[];
  followers?: string[];
  metadata?: Record<string, unknown>;
}

export type BrandSelector = {
  followers?: string[];
  brand_collections?: string[];
};

export class FilterableBrandProps {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[];

  @IsString()
  @IsOptional()
  q?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  handle?: string;

  @IsArray()
  @IsOptional()
  followers?: string[];

  @IsArray()
  @IsOptional()
  brand_collections?: string[];
}

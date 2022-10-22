import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedBrand1661113828421 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // create the brand table
    await queryRunner.query(
      `CREATE TABLE "brand" ("id" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying, "handle" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_bran9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e8a9f8d8f9c8f25f9c8f25f9c8" ON "brand" ("handle")`
    );
    await queryRunner.query(
      `CREATE TABLE "brand_images" ("brand_id" character varying NOT NULL, "image_id" character varying NOT NULL, CONSTRAINT "PK_20de97980da2e939c4c0e8423f2" PRIMARY KEY ("brand_id", "image_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "brand_product_collections" ("brand_id" character varying NOT NULL, "collection_id" character varying NOT NULL, CONSTRAINT "PK_12b1e69914d3dd752de6b1da407" PRIMARY KEY ("brand_id", "collection_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "brand_users" ("brand_id" character varying NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "PK_21ue97980da2e939c4c0e8423f2" PRIMARY KEY ("brand_id", "user_id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "brand_users"`);
    await queryRunner.query(`DROP TABLE "brand_product_collections"`);
    await queryRunner.query(`DROP TABLE "brand_images"`);
    await queryRunner.query(`DROP INDEX "IDX_e8a9f8d8f9c8f25f9c8f25f9c8"`);
    await queryRunner.query(`DROP TABLE "brand"`);
  }
}

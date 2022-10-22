import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ManyToMany,
  JoinTable,
} from "typeorm";
import _ from "lodash";
import { BaseEntity, Image, ProductCollection, User } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { DbAwareColumn } from "@medusajs/medusa/dist/utils/db-aware-column";

@Entity()
export class Brand extends BaseEntity {
  @Index({ unique: true })
  @Column()
  name: string;

  // creator

  @Column({ type: "text", nullable: true })
  description: string | null;

  @Index({ unique: true, where: "deleted_at IS NULL" })
  @Column({ type: "text", nullable: true })
  handle: string;

  @ManyToMany(() => Image, { cascade: ["insert"] })
  @JoinTable({
    name: "brand_images",
    joinColumn: {
      name: "brand_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "image_id",
      referencedColumnName: "id",
    },
  })
  images: Image[];

  @ManyToMany(() => ProductCollection, {
    eager: true,
    cascade: ["insert", "update"],
  })
  @JoinTable({
    name: "brand_product_collections",
    joinColumn: {
      name: "brand_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "collection_id",
      referencedColumnName: "id",
    },
  })
  brand_collections: ProductCollection[];

  // following is for the relationship between brand and user
  @ManyToMany(() => User, { cascade: ["insert"] })
  @JoinTable({
    name: "brand_users",
    joinColumn: {
      name: "brand_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
  })
  followers: User[];

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null;

  @BeforeInsert()
  private beforeInsert(): void {
    if (this.id) return;
    this.id = generateEntityId(this.id, "brand");
    if (!this.handle) {
      this.handle = _.kebabCase(this.name);
    }
  }
}

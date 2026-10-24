import { EntitySchema } from 'typeorm';

export const ProductEntity = new EntitySchema({
  name: 'Product',
  tableName: 'products',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    title: {
      type: 'varchar',
      length: 255
    },
    category: {
      type: 'varchar',
      length: 100
    },
    price: {
      type: 'int'
    },
    rating: {
      type: 'float',
      default: 5.0
    },
    reviewsCount: {
      type: 'int',
      default: 0
    },
    stock: {
      type: 'int',
      default: 0
    },
    description: {
      type: 'text',
      nullable: true
    },
    imageUrl: {
      type: 'varchar',
      length: 500,
      nullable: true
    }
  }
});

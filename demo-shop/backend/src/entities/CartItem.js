import { EntitySchema } from 'typeorm';

export const CartItemEntity = new EntitySchema({
  name: 'CartItem',
  tableName: 'cart_items',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    productId: {
      type: 'int'
    },
    quantity: {
      type: 'int',
      default: 1
    }
  }
});

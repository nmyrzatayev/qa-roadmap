import { EntitySchema } from 'typeorm';

export const OrderEntity = new EntitySchema({
  name: 'Order',
  tableName: 'orders',
  columns: {
    id: {
      primary: true,
      type: 'varchar',
      length: 50
    },
    customerName: {
      type: 'varchar',
      length: 255
    },
    customerEmail: {
      type: 'varchar',
      length: 255
    },
    customerPhone: {
      type: 'varchar',
      length: 50
    },
    customerAddress: {
      type: 'text'
    },
    paymentMethod: {
      type: 'varchar',
      length: 20,
      default: 'CARD'
    },
    itemsJson: {
      type: 'json'
    },
    subtotal: {
      type: 'int'
    },
    discount: {
      type: 'int',
      default: 0
    },
    shipping: {
      type: 'int',
      default: 0
    },
    total: {
      type: 'int'
    },
    status: {
      type: 'varchar',
      length: 50,
      default: 'PAID'
    },
    createdAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
    }
  }
});

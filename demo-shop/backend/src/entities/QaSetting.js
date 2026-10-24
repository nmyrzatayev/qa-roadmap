import { EntitySchema } from 'typeorm';

export const QaSettingEntity = new EntitySchema({
  name: 'QaSetting',
  tableName: 'qa_settings',
  columns: {
    id: {
      primary: true,
      type: 'int',
      default: 1
    },
    artificialDelayMs: {
      type: 'int',
      default: 0
    },
    forceErrorStatus: {
      type: 'int',
      nullable: true
    },
    isBuggyMode: {
      type: 'boolean',
      default: false
    }
  }
});

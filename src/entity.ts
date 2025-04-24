import { ObjectLiteral, getMetadataArgsStorage } from 'typeorm';
import { EncryptionOptions, ExtendedColumnOptions } from './options';
import { decryptData, encryptData } from './crypto';

/**
 * Encrypt fields on entity.
 */
export function encrypt<T extends ObjectLiteral>(entity: any): any {
  if (!entity) {
    return entity;
  }

  for (let columnMetadata of getMetadataArgsStorage().columns) {
    let { propertyName, mode, target } = columnMetadata;
    let options: ExtendedColumnOptions = columnMetadata.options;
    let encrypt = options.encrypt;
    if (
      encrypt &&
      !(
        encrypt?.encryptionPredicate && !encrypt?.encryptionPredicate(entity)
      ) &&
      mode === 'regular' &&
      (encrypt.looseMatching || entity.constructor === target)
    ) {
      if (entity[propertyName]) {
        entity[propertyName] = encryptData(
          Buffer.from(entity[propertyName], 'utf8'),
          encrypt
        ).toString('base64');
      }
    }
  }
  return entity;
}

const getDecryptedValue = (value: string, options: EncryptionOptions) => {
  try {
    return decryptData(Buffer.from(value, 'base64'), options).toString('utf8');
  } catch {
    return value;
  }
};

/**
 * Decrypt fields on entity.
 */
export function decrypt<T extends ObjectLiteral>(entity: any): any {
  if (!entity) {
    return entity;
  }

  for (let columnMetadata of getMetadataArgsStorage().columns) {
    let { propertyName, mode, target } = columnMetadata;
    let options: ExtendedColumnOptions = columnMetadata.options;
    let encrypt = options.encrypt;
    if (
      encrypt &&
      !(
        encrypt?.encryptionPredicate && !encrypt?.encryptionPredicate(entity)
      ) &&
      mode === 'regular' &&
      (encrypt.looseMatching || entity.constructor === target)
    ) {
      if (entity[propertyName]) {
        entity[propertyName] = getDecryptedValue(entity[propertyName], encrypt);
      }
    }
  }
  return entity;
}

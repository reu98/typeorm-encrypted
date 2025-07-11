export interface EncryptionOptions {
    key: string;
    algorithm: string;
    ivLength: number;
    iv?: string;
    authTagLength?: number;
    looseMatching?: boolean;
    encryptionPredicate?: (entity: any) => boolean;
}

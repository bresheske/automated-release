import { IStorageProvider } from "./IStorageProvider";

export class UpdateService {
    private provider: IStorageProvider;

    constructor(provider: IStorageProvider) {
        this.provider = provider;
    }

    update() {
        
    }
}
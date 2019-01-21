export interface IStorageProvider {
    /**
     * gets the latest version from the storage provider.
     */
    getLatestVersion(): Promise<string|null>;

    /**
     * downloads a particular version from the storage provider to the specified location
     */
    downloadVersion(version: string, location: string): Promise<boolean>;
}
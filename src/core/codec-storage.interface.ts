namespace codec {

  /**
   * Codec storage interface
   */
  export interface CodecStorage {

    /**
     * Get item
     * @param key key
     */
    getItem(key: string): string | null;

    /**
     * Remove item
     * @param key key
     */
    removeItem(key: string): void;

    /**
     * Set item
     * @param key key
     * @param value value
     */
    setItem(key: string, value: string): void;

  }

}

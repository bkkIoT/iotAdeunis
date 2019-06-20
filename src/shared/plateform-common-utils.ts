namespace codec {

  export class PlateformCommonUtils {

    /**
     * Get Product Mode text
     * @param value value
     */
    public static getProductModeText(value: number) {
      switch (value) {
        case 0:
          return 'PARK';
        case 1:
          return 'PRODUCTION';
        case 2:
          return 'TEST';
        case 3:
          return 'DEAD';
        default:
          return '';
      }
    }

  }

}

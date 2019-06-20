namespace codec {

    /**
     * Comfort 0x52 (TOR configuration) frame parser
     */
    export class Comfort0x52Parser implements FrameParser {

      readonly deviceType = 'comfort';
      readonly frameCode = 0x52;

      private sb0x52Parser = new Sb0x52Parser();

      public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
        const appContent = this.sb0x52Parser.parseFrame(payload, configuration, network);

        appContent['type'] = '0x52 Comfort TOR2 alarm';

        return appContent;
      }

    }

}


namespace codec {

    /**
     * Motion 0x1f (TOR configuration) frame parser
     */
    export class Motion0x1fParser implements FrameParser {

      readonly deviceType = 'motion';
      readonly frameCode = 0x1f;

      private sb0x1fParser = new Sb0x1fParser();

      public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
        const appContent = this.sb0x1fParser.parseFrame(payload, configuration, network);

        appContent['type'] = '0x1f Motion channels configuration';

        return appContent;
      }

    }

}


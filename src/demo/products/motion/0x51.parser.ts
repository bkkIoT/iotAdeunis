namespace codec {

    /**
     * Motion 0x51 (TOR configuration) frame parser
     */
    export class Motion0x51Parser implements FrameParser {

      readonly deviceType = 'motion';
      readonly frameCode = 0x51;

      private sb0x51Parser = new Sb0x51Parser();

      public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
        const appContent = this.sb0x51Parser.parseFrame(payload, configuration, network);

        appContent['type'] = '0x51 Motion TOR1 alarm';

        return appContent;
      }

    }

}


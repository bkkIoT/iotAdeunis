namespace codec {

    /**
     * Motion 0x52 (TOR configuration) frame parser
     */
    export class Motion0x52Parser implements FrameParser {

      readonly deviceType = 'motion';
      readonly frameCode = 0x52;

      private sb0x52Parser = new Sb0x52Parser();

      public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
        const appContent = this.sb0x52Parser.parseFrame(payload, configuration, network);

        appContent['type'] = '0x52 Motion TOR2 alarm';

        return appContent;
      }

    }

}


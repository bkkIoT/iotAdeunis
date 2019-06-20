namespace codec {

  /**
   * Pulse 0x48 (historic data) frame parser
   */
  export class Pulse0x48Parser implements FrameParser {

    readonly deviceType = 'pulse';
    readonly frameCode = 0x48;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      let appContent: Content = { type: '0x48 Pulse historic data' };

      // Frame index
      const frameIndex = payload[2];
      appContent['frame_index'] = frameIndex;

      // Infer network and historic configuration from frame
      const { inferredNetwork, inferredHistoricCfg } = this.inferNetworkAndHistoricCfg(frameIndex, payload.byteLength);

      // Resolve known netowrk
      const knownNetwork = network === 'unknown' ? inferredNetwork : network;

      let historicConfiguration: number;
      if (configuration[6]) {
        // Configuration is known, read historic configuration
        historicConfiguration = (configuration[6] & 0x03);
      } else {
        // Configuration is not known, use inferred historic configuration
        historicConfiguration = inferredHistoricCfg;
      }

      if (historicConfiguration < 0) {
        // Historic configuration could not be inferred
        appContent.partialDecoding = PartialDecodingReason.MISSING_CONFIGURATION;
        return appContent;
      }

      // Parse indexes
      appContent = { ...appContent, ...this.parseIndexes(payload, frameIndex, historicConfiguration) };

      if (knownNetwork === 'unknown') {
        // Network could not be inferred
        appContent.partialDecoding = PartialDecodingReason.MISSING_NETWORK;
        return appContent;
      }

      // Parse deltas
      appContent = { ...appContent, ...this.parseDeltas(payload, knownNetwork, frameIndex, historicConfiguration) };

      return appContent;
    }

    /**
     * Parse indexes
     * @param payload payload
     * @param frameIndex frame index
     * @param historicConfiguration historic configuration
     */
    private parseIndexes(payload: Buffer, frameIndex: number, historicConfiguration: number) {
      const appContent: Content = {};

      if (frameIndex !== 0) {
        // Indexes are not in this frame
        return appContent;
      }

      // Index values
      const time = historicConfiguration === 0x1 ? '10min' : '1h';
      appContent[`channelA_index_${time}_after_previous_frame`] = payload.readUInt32BE(3);
      appContent[`channelB_index_${time}_after_previous_frame`] = payload.readUInt32BE(7);

      return appContent;
    }

    /**
     * Parse deltas
     * @param payload payload
     * @param network network: lora868 or sigfox
     * @param frameIndex frame index
     * @param historicConfiguration historic configuration
     */
    private parseDeltas(payload: Buffer, network: Network, frameIndex: number, historicConfiguration: number) {
      const appContent: Content = {};

      // Example for 1h history (frame 1/1)
      // +----------------------------------------------------+---------------+
      // |                        Key                         | Data location |
      // +----------------------------------------------------+---------------+
      // | channelA_delta_10min_to_20min_after_previous_frame | bytes 11-12   |
      // | channelB_delta_10min_to_20min_after_previous_frame | bytes 13-14   |
      // | channelA_delta_20min_to_30min_after_previous_frame | bytes 15-16   |
      // | ...                                                | ...           |
      // | channelA_delta_50min_to_60min_after_previous_frame | bytes 27-28   |
      // | channelB_delta_50min_to_60min_after_previous_frame | bytes 29-30   |
      // +----------------------------------------------------+---------------+

      // Example for 1d history (frame 2/3)
      // +------------------------------------------------+---------------+
      // |                      Key                       | Data location |
      // +------------------------------------------------+---------------+
      // | channelA_delta_11h_to_12h_after_previous_frame | bytes 3-4     |
      // | channelB_delta_11h_to_12h_after_previous_frame | bytes 5-6     |
      // | channelA_delta_12h_to_13h_after_previous_frame | bytes 7-8     |
      // | ...                                            | ...           |
      // | channelA_delta_22h_to_23h_after_previous_frame | bytes 47-48   |
      // | channelB_delta_22h_to_23h_after_previous_frame | bytes 49-50   |
      // +------------------------------------------------+---------------+

      // Delta values
      const start = frameIndex === 0 ? 11 : 3;
      for (let offset = start; offset < payload.byteLength; offset += 4) {
        let intervalText = '';
        if (historicConfiguration === 0x1) {
          // Step is 10min
          const base = this.getBaseFor1hHistory(network, frameIndex);
          const intervalStart = base + (offset - start) / 4 * 10;
          intervalText = `${intervalStart}min_to_${(intervalStart + 10)}min`;
        } else {
          // Step is 1h
          const base = this.getBaseFor1dHistory(network, frameIndex);
          const intervalStart = base + (offset - start) / 4;
          intervalText = `${intervalStart}h_to_${(intervalStart + 1)}h`;
        }
        appContent[`channelA_delta_${intervalText}_after_previous_frame`] = payload.readUInt16BE(offset);
        appContent[`channelB_delta_${intervalText}_after_previous_frame`] = payload.readUInt16BE(offset + 2);
      }

      return appContent;
    }

    /**
     * Infer network and historic configuration
     * @param payload payload
     * @param configuration configuration
     */
    private inferNetworkAndHistoricCfg(frameIndex: number, byteLength: number) {
      // +-----------------------+-------------------+-----------------------------+
      // | Frame count [lengths] | 1h history (0x1)  |      1d history (0x2)       |
      // +-----------------------+-------------------+-----------------------------+
      // | LoRa 868              | 1 [31]            | 3  [51, 51, 7]              |
      // | Sigfox                | 4 [11, 11, 11, 7] | 13 [11, 11, 11, ..., 11, 7] |
      // +-----------------------+-------------------+-----------------------------+
      if (byteLength === 31) {
        // LoRa 868 1h history
        return { inferredNetwork: 'lora868' as Network, inferredHistoricCfg: 0x1 };
      } else if (byteLength === 51 || (frameIndex === 2 && byteLength === 7)) {
        // LoRa 868 1d history
        return { inferredNetwork: 'lora868' as Network, inferredHistoricCfg: 0x2 };
      } else if (frameIndex === 3 && byteLength === 7) {
        // Sigfox 1h history
        return { inferredNetwork: 'sigfox' as Network, inferredHistoricCfg: 0x1 };
      } else if (frameIndex >= 3) {
        // Sigfox 1d history
        return { inferredNetwork: 'sigfox' as Network, inferredHistoricCfg: 0x2 };
      } else if (byteLength === 11) {
        // Sigfox
        return { inferredNetwork: 'sigfox' as Network, inferredHistoricCfg: -1 };
      } else {
        // Unknown
        return { inferredNetwork: 'unknown' as Network, inferredHistoricCfg: -1 };
      }
    }

    /**
     * Get base for 1h history
     * @param frameIndex frame index
     * @param network network: lora868 or sigfox
     */
    private getBaseFor1hHistory(network: Network, frameIndex: number) {
      // +---------------------------+----+----+----+----+
      // | Base for 1h history (0x1) | 0  | 1  | 2  | 3  |
      // +---------------------------+----+----+----+----+
      // | LoRa 868                  | 10 |    |    |    |
      // | Sigfox                    | 10 | 10 | 30 | 50 |
      // +---------------------------+----+----+----+----+
      switch (network) {
        case 'sigfox':
          return [10, 10, 30, 50][frameIndex];
        // case 'lora868':
        default:
          return 10;
      }
    }

    /**
     * Get base for 1d history
     * @param frameIndex frame index
     * @param network network: lora868 or sigfox
     */
    private getBaseFor1dHistory(network: Network, frameIndex: number) {
      // +---------------------------+---+----+----+---+---+---+----+----+----+----+----+----+----+
      // | Base for 1d history (0x2) | 0 | 1  | 2  | 3 | 4 | 5 | 6  | 7  | 8  | 9  | 10 | 11 | 12 |
      // +---------------------------+---+----+----+---+---+---+----+----+----+----+----+----+----+
      // | LoRa 868                  | 1 | 11 | 23 |   |   |   |    |    |    |    |    |    |    |
      // | Sigfox                    | 1 |  1 |  3 | 5 | 7 | 9 | 11 | 13 | 15 | 17 | 19 | 21 | 23 |
      // +---------------------------+---+----+----+---+---+---+----+----+----+----+----+----+----+
      switch (network) {
        case 'sigfox':
          return [1, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23][frameIndex];
        // case 'lora868':
        default:
          return [1, 11, 13][frameIndex];
      }
    }

  }

}

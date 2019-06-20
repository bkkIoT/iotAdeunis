namespace codec {

  /**
   * Pulse 0x30 (keep alive) frame parser
   */
  export class Pulse0x30Parser implements FrameParser {

    readonly deviceType = 'pulse';
    readonly frameCode = 0x30;

    public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
      const appContent: Content = { type: '0x30 Pulse keep alive' };

      // Alarm states
      appContent['channelA_flow_alarm'] = Boolean(payload[2] & 0x01);
      appContent['channelB_flow_alarm'] = Boolean(payload[2] & 0x02);
      appContent['channelA_fraud_alarm'] = Boolean(payload[2] & 0x04);
      appContent['channelB_fraud_alarm'] = Boolean(payload[2] & 0x08);
      appContent['channelA_leakage_alarm'] = Boolean(payload[2] & 0x10);
      appContent['channelB_leakage_alarm'] = Boolean(payload[2] & 0x20);

      // Max/min measured flows
      appContent['channelA_last_24h_max_flow'] = payload.readUInt16BE(3);
      appContent['channelB_last_24h_max_flow'] = payload.readUInt16BE(5);
      appContent['channelA_last_24h_min_flow'] = payload.readUInt16BE(7);
      appContent['channelB_last_24h_min_flow'] = payload.readUInt16BE(9);

      return appContent;
    }

  }

}

namespace codec {

    /**
     * Motion 0x50 (luminosity alarm) frame parser
     */
    export class Motion0x50Parser implements FrameParser {

        readonly deviceType = 'motion';
        readonly frameCode = 0x50;

        public parseFrame(payload: Buffer, configuration: Buffer, network: Network) {
            const appContent: Content = {
                type: '0x50 Motion luminosity alarm',
                'luminosity_alarm_status': this.getAlarmStatusText(Boolean(payload[2])),
                'luminosity_percentage': payload[3]
            };

            return appContent;
        }

        /**
         * Get alarm status text
         * @param status status
         */
        public getAlarmStatusText(status: boolean) {
            return status ? 'active' : 'inactive';
        }

    }

}


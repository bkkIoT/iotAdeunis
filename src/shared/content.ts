namespace codec {

    export interface Content {

        [key: string]: any;

        type?: string;

        partialDecoding?: PartialDecodingReason;

    }

    export class ContentImpl implements Content {

        [key: string]: any;

        partialDecoding = PartialDecodingReason.NONE;

        static merge(...contents: Content[]) {
            if (!contents || contents.length === 0) {
                return null;
            }

            return Object.assign(new ContentImpl(contents[0].type), ...contents) as Content;
        }

        constructor(public type: string = 'Unknown') { }

        public merge(...contents: Content[]) {
            return ContentImpl.merge(this, ...contents);
        }

    }

}

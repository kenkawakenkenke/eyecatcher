import { RESPONSE_BOOK_1 } from './TestResponse.js';
import { getFunctions, httpsCallable } from 'firebase/functions';

export class TextSummarizer {
    constructor() {

    }

    async summarize(image, skipAll = false, lang = "ja") {
        if (skipAll) {
            return RESPONSE_BOOK_1;
        }

        var response = await httpsCallable(getFunctions(undefined), 'processImage')({
            image,
            skipOCR: false,
            skipGPT: false,
            lang,
        });

        console.log(response);
        if (!response || response.data.status !== "ok") {
            throw new Error("Failed to query image")
        }
        return response;
    }
}
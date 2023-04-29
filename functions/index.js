const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const vision = require("@google-cloud/vision");
const { Configuration, OpenAIApi } = require("openai");

// http://127.0.0.1:5001/eyecatch-generator/asia-northeast1/helloWorld
exports.helloWorld = functions
    // .region('asia-northeast1')
    .https.onCall(async (data, context) => {
        functions.logger.info("Hello logs! " + data, { structuredData: true });
        // response.send("Hello from Firebase!");
        return "ok";
    });

exports.processImage = functions
    // Unfortunately, CORS seems to have issues when we set the region.
    // .region('asia-northeast1')
    .runWith({ secrets: ["OPENAI_API_KEY"] })
    .https.onCall(async (data, context) => {
        functions.logger.info("Process image! ", { structuredData: true });

        const img = data["image"];
        const croppedImage = img.substring("data:image/jpeg;base64,".length);

        var ocrResult = await doOCR(croppedImage, data["skipOCR"]);

        // const config = {};
        // if (process.env.PROJECT_ID) {
        //     config.projectId = process.env.PROJECT_ID;
        //     console.log("set project id", process.env.PROJECT_ID);
        // }
        // if (process.env.SERVICE_ACCOUNT_FILE) {
        //     config.keyFilename = process.env.SERVICE_ACCOUNT_FILE;
        //     console.log("set account file", process.env.SERVICE_ACCOUNT_FILE);
        // }
        // const client = new vision.ImageAnnotatorClient(config);
        // var request = {
        //     image: {
        //         content: croppedImage
        //     },
        // };
        // result = await client.textDetection(request);

        // const configuration = new Configuration({
        //     apiKey: process.env.OPENAI_API_KEY,
        // });
        // const openai = new OpenAIApi(configuration);
        // const completion = await openai.createChatCompletion({
        //     // model: "text-davinci-003",
        //     model: "gpt-3.5-turbo",
        //     // prompt: "How are you?",
        //     messages: [
        //         { "role": "system", "content": "You are a helpful assistant." },
        //         { "role": "user", "content": "Who won the world series in 2027?" },
        //         { "role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2027." },
        //         { "role": "user", "content": "Where was it played?" }
        //     ],
        //     // temperature: 0.6,
        // });
        // console.log(completion.data)
        // result = completion.data.choices;

        return {
            env: process.env.ENVIRONMENT,
            status: "ok",
            ocrResult,
        }
    });

async function doOCR(image, skip = false) {
    if (skip) {
        return {
            rawResult: {
                skipped: true,
            },
            fullText: "While Satya Nadella telling reporters that artificial intelligence was creating a new day in search. Microsoft's much-maligned Bing was integrating Open Al's ChatGPT technology to generate information directly for users, not just links. And in doing so, it was directly challenging Google, the undisputed champion of search, by trying to out innovate Google on its home turf. This wasn't supposed to happen, especially not to Google. Already burned in 2014 by Amazon's Al-enabled Alexa voice assistant, Google announced in 2016 that it would become an Al - first company. Google's problem certainly wasn't engineering. The company had made fundamental advances in AI. Notwithstanding Google's costly flawed demo earlier this month, its LaMDA chatbot ad ne the ChatGPT3 SPERMAIN AGEN PENGEMEN",
        }
    }

    const config = {};
    if (process.env.PROJECT_ID) {
        config.projectId = process.env.PROJECT_ID;
        console.log("set project id", process.env.PROJECT_ID);
    }
    if (process.env.SERVICE_ACCOUNT_FILE) {
        config.keyFilename = process.env.SERVICE_ACCOUNT_FILE;
        console.log("set account file", process.env.SERVICE_ACCOUNT_FILE);
    }
    const client = new vision.ImageAnnotatorClient(config);
    var request = {
        image: {
            content: image
        },
    };
    const rawResult = await client.textDetection(request);
    var fullTexts = [];
    for (var document of rawResult) {
        if (document?.fullTextAnnotation?.text) {
            console.log("text: ", document.fullTextAnnotation.text);
            fullTexts.push(document.fullTextAnnotation.text);
        }
    }
    const fullText = fullTexts.join("\n");
    return {
        rawResult,
        fullText,
    }
}

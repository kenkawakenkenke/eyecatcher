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
        // const result = await client.textDetection(request);

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const completion = await openai.createChatCompletion({
            // model: "text-davinci-003",
            model: "gpt-3.5-turbo",
            // prompt: "How are you?",
            messages: [
                { "role": "system", "content": "You are a helpful assistant." },
                { "role": "user", "content": "Who won the world series in 2027?" },
                { "role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2027." },
                { "role": "user", "content": "Where was it played?" }
            ],
            // temperature: 0.6,
        });
        console.log(completion.data)

        return {
            env: process.env.ENVIRONMENT,
            status: "ok",
            result: completion.data.choices,
        }
    });

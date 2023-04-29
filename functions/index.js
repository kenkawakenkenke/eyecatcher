const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });
const vision = require("@google-cloud/vision");

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
    .https.onCall(async (data, context) => {
        console.log("hey");

        functions.logger.info("Process image! ", { structuredData: true });

        const img = data["image"];
        const croppedImage = img.substring("data:image/jpeg;base64,".length);

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
                content: croppedImage
            },
        };
        const result = await client.textDetection(request);

        return {
            env: process.env.ENVIRONMENT,
            status: "ok",
            result: result,
        }
    });

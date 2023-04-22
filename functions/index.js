const functions = require("firebase-functions");
const cors = require('cors')({ origin: true });

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
        functions.logger.info("Process image! " + data, { structuredData: true });
        const img = data["image"];
        console.log(img);

        return {
            status: "ok",
            result: img.substring(0, 100),
            image: img,
        }
    });

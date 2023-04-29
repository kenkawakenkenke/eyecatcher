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

        var gptResult = await summarizeText(ocrResult.fullText, data["skipGPT"]);

        return {
            env: process.env.ENVIRONMENT,
            status: "ok",
            ocrResult,
            gptResult,
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
            // console.log("text: ", document.fullTextAnnotation.text);
            fullTexts.push(document.fullTextAnnotation.text);
        }
    }
    const fullText = fullTexts.join("\n");
    return {
        rawResult,
        fullText,
    }
}

async function askGPT(messages) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
        // model: "gpt-3.5-turbo",
        // model: "gpt-4",
        model: "gpt-3.5-turbo-0301",
        messages,
        // { "role": "user", "content": ocredText },
        // { "role": "user", "content": "Who won the world series in 2027?" },
        // { "role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2027." },
        // { "role": "user", "content": "Where was it played?" }
    });
    return completion.data.choices;
}

async function summarizeText(ocredText, skip) {
    if (skip) {
        return {
            "questions": [
                "イラガやマダラガのとげは痛いけど、ナシイラガやクロシタアオイラガのとげはなぜ炎症を起こさないの？",
                "ウメスカシクロバの幼虫がウメの葉を食べつくす理由は？",
                "アカイラガの幼虫が落ち葉にまゆをつくる理由は？",
                "タケノホソクロバの幼虫がわざわざ集団生活をする理由は？",
                "イラガやマダラガのとげに比べ、クロシタアオイラガやナシイラガのとげの毒性はなぜ弱いの？"
            ],
            "rawResult": [
                {
                    "message": {
                        "role": "assistant",
                        "content": "「イラガやマダラガのとげは痛いけど、ナシイラガやクロシタアオイラガのとげはなぜ炎症を起こさないの？」\n「ウメスカシクロバの幼虫がウメの葉を食べつくす理由は？」\n「アカイラガの幼虫が落ち葉にまゆをつくる理由は？」\n「タケノホソクロバの幼虫がわざわざ集団生活をする理由は？」\n「イラガやマダラガのとげに比べ、クロシタアオイラガやナシイラガのとげの毒性はなぜ弱いの？」"
                    },
                    "finish_reason": "stop",
                    "index": 0
                }
            ]
        };
    }
    if (ocredText === "") {
        return {
            outputs: [],
        };
    }

    const messages = [
        {
            "role": "system", "content": `
今から提示する文章は本にOCRをかけた結果です。そのため言葉が断片的で欠けていますが、元の文章は本の1ページです。
子供がこの本を読んで答えを調べたくなるような煽り文句を作ってください。
・例えば：
「シマウマが縞々になった驚きの理由とは！？」
「イルカって脳みそを半分ずつ寝かせられるってしってた？」
「ドラゴンボールのスカウターがたまに爆発する驚きのメカニズム！！」
・文中の興味深い事実を選び、それが答えとなるような質問や紹介をしてください。
・モノや生物の名前が答えとなるような質問は避けてください。
・答えを知った子供が「へー」と言いたくなるような意外性のある事実やメカニズムを出題してください。
・質問の答えは必ず元の文章の中に含まれているものにしてください。
・小学三年生が理解できる日本語で書いてください。
・バラエティ番組のように、読む人が盛り上がる文章の形式にしてください。
・例えば「！！」をたくさん使い、難しい専門用語を避けてください。
・文はなるべく短く簡潔に、10文字程度で書いてください。
・10個作ってください
・文は「」で囲い、それぞれ新しい行で書いてください。

本文：
${ocredText}
` },
    ];
    const gptResult = await askGPT(messages);
    const questions = [];
    for (var result of gptResult) {
        for (var line of result.message.content.split("\n")) {
            questions.push(extractOuterQuotes(line));
        }
    }

    return {
        questions,
        rawResult: gptResult,
    };
}

function extractOuterQuotes(str) {
    const firstQuoteIndex = str.indexOf('「');
    const lastQuoteIndex = str.lastIndexOf('」');

    if (firstQuoteIndex === -1 || lastQuoteIndex === -1) {
        // console.log("No matching quotes found.");
        // return "";
        return str;
    }

    return str.substring(firstQuoteIndex + 1, lastQuoteIndex);
}
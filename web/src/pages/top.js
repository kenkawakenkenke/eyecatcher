import React, { useState } from 'react';

import CapturePage from './capture';
import LoadingPage from './loading';
import DisplayPage from './display';
import { TextSummarizer } from '../components/capture/TextSummarizer.js';
import "./top.css";

const summarizer = new TextSummarizer();

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function TopPage() {
    const [image, setImage] = useState(null);
    const [summary, setSummary] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const searchParams = new URLSearchParams(window.location.search);
    const dev = searchParams.get("dev") === "true";
    const lang = searchParams.get("lang") || "ja";

    async function captureImage(image) {
        try {
            setImage(image);

            const response = await summarizer.summarize(image, dev, lang);
            if (dev) {
                await delay(3000);
            }
            console.log("response", response);

            if ((response?.data?.gptResult?.questions?.length || 0) == 0) {
                reset();
                setErrorMessage("文字が見つかりませんでした。もう一度写真を撮ってみてください。");
                return;
            }

            setSummary(response);
        } catch (exception) {
            console.log("error:", exception);
            reset();
            setErrorMessage("エラーがおきました。もう一度写真を撮ってみてください。");
        }
    }

    function reset() {
        setErrorMessage(null);
        setImage(null);
        setSummary(null);
    }

    var pagePhase;
    if (!image) {
        pagePhase = "capture";
    } else if (!summary) {
        pagePhase = "loading";
    } else {
        pagePhase = "display";
    }
    return <div>
        <div className="main-contents">
            {pagePhase === "capture" && <CapturePage captureCallback={captureImage} />}
            {pagePhase === "loading" && <LoadingPage image={image} resetCallback={reset} />}
            {pagePhase === "display" && <DisplayPage image={image} summary={summary} resetCallback={reset} timeout={dev ? 3000 : 10000} />}
        </div>
        {errorMessage && (
            <div className="error-modal">
                <div className="error-modal-content">
                    <p>{errorMessage}</p>
                    <button onClick={reset}>閉じる</button>
                </div>
            </div>
        )}
    </div>;
}

export default TopPage;

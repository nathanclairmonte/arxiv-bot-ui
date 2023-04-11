import { OpenAI } from "langchain/llms";
import { VectorDBQAChain } from "langchain/chains";

export default async function handler(req, res) {
    // if no vectorstore is given, alert user
    if (!req.body.vectorstore) {
        return res.status(500).json({
            result: {
                type: "error",
                message: "Please load a paper first!",
            },
        });
    }

    try {
        // load model
        const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });

        // create qa chain
        const chain = VectorDBQAChain.fromLLM(model, req.body.vectorstore);

        // get answer for query
        const answer = await chain.call({
            query: req.body.query,
            chatHistory: req.body.history,
        });

        return res.status(200).json({
            type: "success",
            message: answer.text,
        });
    } catch (error) {
        return res.status(500).json({
            result: {
                type: "error",
                message: `Something went wrong :(\n ${error}`,
            },
        });
    }
}

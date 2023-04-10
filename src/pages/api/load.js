import { PDFLoader } from "langchain/document_loaders";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores";

export default async function handler(req, res) {
    // arxiv link is already validated by the ArxivInput component
    // no need to validate here

    // load paper
    const arxivLink = `https://arxiv.org/pdf/${req.body.arxivId}.pdf`;
    const loader = new PDFLoader(arxivLink);
    const data = await loader.load();

    // split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 20,
    });
    const docs = await splitter.splitDocuments(data);

    // create vectorstore
    try {
        const vectorstore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
        return res.status(200).json({
            result: {
                type: "success",
                message: "Success! Paper loaded.",
                vectorstore: vectorstore,
            },
        });
    } catch (error) {
        return res.status(500).json({
            result: {
                type: "error",
                message: `Something went wrong :(\n${error}`,
                vectorstore: null,
            },
        });
    }
}

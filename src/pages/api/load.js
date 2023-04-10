import { PDFLoader } from "langchain/document_loaders";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores";

import fs from "fs";
import path from "path";

// download the paper from the given arxivId
// will overwrite "paper.pdf" if it already exists
const _downloadPaper = async (arxivId) => {
    // get arxiv link from ID
    const arxivLink = `https://arxiv.org/pdf/${arxivId}.pdf`;

    // download PDF file
    const response = await fetch(arxivLink, { method: "GET" });

    // define filepath to save it to
    const filePath = path.join(process.cwd(), "papers", "paper.pdf");

    // save PDF
    fs.writeFileSync(filePath, Buffer.from(await response.arrayBuffer()), "binary");

    return filePath;
};

export default async function handler(req, res) {
    // arxiv link is already validated by the ArxivInput component
    // no need to validate here

    try {
        // download paper and load it with langchain
        const filePath = await _downloadPaper(req.body.arxivId);
        const loader = new PDFLoader(filePath, {
            pdfjs: () => import("pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js"),
        });
        const data = await loader.load();

        // split into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 20,
        });
        const docs = await splitter.splitDocuments(data);

        // create vectorstore
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

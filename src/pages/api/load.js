import { PDFLoader } from "langchain/document_loaders";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// fetch the paper from the given arxivId and store it as a blob
const _fetchPaper = async (arxivId) => {
    // get arxiv link from ID
    const arxivLink = `https://arxiv.org/pdf/${arxivId}.pdf`;

    // fetch PDF file
    const response = await fetch(arxivLink, { method: "GET" });

    // save as blob
    const fileBlob = await response.blob();

    return fileBlob;
};

export default async function handler(req, res) {
    // arxiv link is already validated by the ArxivInput component
    // no need to validate here

    try {
        // fetch paper blob and load it with langchain
        const fileBlob = await _fetchPaper(req.body.arxivId);
        const loader = new PDFLoader(fileBlob, {
            pdfjs: () => import("pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js"),
        });
        const data = await loader.load();

        // split into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 20,
        });
        const docs = await splitter.splitDocuments(data);

        return res.status(200).json({
            result: {
                type: "success",
                message: "Success! Paper loaded.",
                docs: docs,
            },
        });
    } catch (error) {
        return res.status(500).json({
            result: {
                type: "error",
                message: `Something went wrong :(\n${error}`,
                docs: [],
            },
        });
    }
}

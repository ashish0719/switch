import { PDFParse } from 'pdf-parse';

export const parsePDF = async (buffer) => {
    let parser = null;
    try {
        parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        return result.text;
    } catch (error) {
        console.error("PDF Parse Error:", error);
        throw new Error("Failed to parse PDF file: " + error.message);
    } finally {
        if (parser) {
            await parser.destroy();
        }
    }
};

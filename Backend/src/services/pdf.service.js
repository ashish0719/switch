import puppeteer from 'puppeteer';
import { renderTemplateA } from './templates/templateA.js';
import { renderTemplateB } from './templates/templateB.js';

export const generatePDF = async (resumeData, templateId) => {
    let htmlContent;
    switch (templateId) {
        case 'templateA':
            htmlContent = renderTemplateA(resumeData);
            break;
        case 'templateB':
            htmlContent = renderTemplateB(resumeData);
            break;
        default:
            throw new Error("Invalid template ID");
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Often needed in containerized envs
    });
    const page = await browser.newPage();

    // Set content and wait for network idle to ensure styles allow loading usually
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
            top: '10mm',
            bottom: '10mm',
            left: '10mm',
            right: '10mm'
        }
    });

    await browser.close();
    return pdfBuffer;
};

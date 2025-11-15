import { jsPDF } from 'jspdf';

export function drawSquare(doc, x, y, w, h, c1, c2, c3) {
    doc.setDrawColor(0);
    doc.setFillColor(c1, c2, c3);
    doc.rect(x, y, w, h, 'F');
}

export function drawTitleSquare(doc, color = ["0.80"]) {
    drawSquare(doc, 5, 5, 200, 30, ...color);
    doc.addImage("/pinlounge.gif", "JPEG", 160, 10, 40, 20);
}

export function writeTitle(doc, title1, title2, fontSize1 = 20, fontSize2 = 16) {
    doc.setFontSize(fontSize1);
    doc.text(10, 15, title1);
    if (title2) {
        doc.setFontSize(fontSize2);
        doc.text(150 - doc.getTextWidth(title2), 15, title2);
    }
}

export function writeSubtitle(doc, strg1, strg2 = "") {
    doc.setFontSize(16);
    doc.text(10, 30, strg1);
    if (strg2) {
        //doc.setFontSize(12);
        doc.text(150 - doc.getTextWidth(strg2), 30, strg2);
    }
}

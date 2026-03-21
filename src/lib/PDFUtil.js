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

// Draw pin name with multi-match icon (two overlapping squares) if name starts with *
export function writePinText(doc, x, y, pinText, align = "left") {
    const isMulti = pinText.startsWith('*');
    const displayText = isMulti ? pinText.slice(1) : pinText;
    const textWidth = doc.getTextWidth(displayText);
    const iconSize = 2.5;
    const iconGap = 1;
    const totalWidth = isMulti ? iconSize + iconGap + textWidth : textWidth;

    let tx;
    if (align === "right") {
        tx = x - totalWidth;
    } else if (align === "center") {
        tx = x - totalWidth / 2;
    } else {
        tx = x;
    }

    if (isMulti) {
        const savedLineWidth = doc.getLineWidth();
        doc.setLineWidth(0.3);
        doc.setDrawColor(100);
        const iy = y - iconSize - 0.3;
        doc.rect(tx, iy, iconSize * 0.7, iconSize * 0.7, 'S');
        doc.rect(tx + iconSize * 0.3, iy + iconSize * 0.3, iconSize * 0.7, iconSize * 0.7, 'S');
        doc.setDrawColor(0);
        doc.setLineWidth(savedLineWidth);
        doc.text(tx + iconSize + iconGap, y, displayText);
    } else {
        doc.text(tx, y, displayText);
    }
}

import { jsPDF } from "jspdf";
import { getPlayerName } from "./PlayerUtil";
import { drawTitleSquare, writeTitle, writeSubtitle } from "./PDFUtil.js";

export function generatePlayersPDF(title, playerIDs, allPlayers) {

    const doc = new jsPDF();
    doc.setFont("times");

    let pageNum = 1;

    drawTitleSquare(doc);
    writeTitle(doc, title);
    writeSubtitle(doc, "Seite " + pageNum++);

    let x = 10;
    let y = 45;
    doc.setFontSize(14);

    playerIDs.forEach((id, i) => {
        const numStrg = (i + 1).toString() + ".";
        doc.text(x + 10 - doc.getTextWidth(numStrg), y, numStrg);
        const name = getPlayerName(id, allPlayers);
        doc.text(x + 15, y, name);
        const player = allPlayers.find((item) => item.id === id);
        const email = player ? player.email : "";
        if (email) {
            doc.text(x + 90, y, email);
        }
        y += 6;
        if (i + 1 > 0 && (i + 1) % 40 === 0) {
            // next page
            doc.addPage();
            drawTitleSquare(doc);
            writeTitle(doc, title);
            writeSubtitle(doc, "Seite " + pageNum++);
            y = 45;
            doc.setFontSize(14);
        }
    })

    doc.addPage();
    drawTitleSquare(doc);
    writeTitle(doc, title);
    writeSubtitle(doc, "E-Mail-Verteiler");

    x = 10;
    y = 45;
    doc.setFontSize(8);

    let nextEmailStrg = '';
    let num = 0;

    playerIDs.forEach((id) => {
        const player = allPlayers.find((item) => item.id === id);
        const email = player ? player.email : "";
        if (email) {
            if (num++ % 5 === 0) {
                doc.text(x, y, nextEmailStrg);
                y += 4;
                nextEmailStrg = "";
            }
            nextEmailStrg += (email + ";");
        }
    })
    if (nextEmailStrg) {
        doc.text(x, y, nextEmailStrg);
    }

    doc.save(title + '.pdf');
}


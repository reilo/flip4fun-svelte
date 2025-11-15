import jsPDF from "jspdf";
import { drawTitleSquare, writeTitle, writeSubtitle, drawSquare } from "./PDFUtil.js";  
import { formatDate } from "./TypeUtil.js";
import { getPinName } from "./PinUtil.js";

export function generateMatchCardsPDF(tourName, round, matches, pins) {

    const doc = new jsPDF({
        orientation: 'landscape',
        format: 'a5',
    });
    doc.setFont("times");

    matches.forEach((match, i) => {
        for (let j = 1; j <= match.count; j++) {

            drawTitleSquare(doc, ["0.90"]);
            writeTitle(doc, tourName, "");
            writeSubtitle(doc, "Ergebniszettel - " + formatDate(match.created));

            const xmin = 5;
            const xmax = 205;
            let y = 45;
            doc.setFontSize(18);
            doc.setLineWidth(0.1);

            // Header: Runde - Ebene - Gruppe
            drawSquare(doc, xmin, y - 8, xmax - xmin, 12, "0.90");
            const txtRunde = "Runde " + round.toString();
            //doc.text(xmin + (xmax - xmin) / 6 - doc.getTextWidth(txtRunde) / 2, y, txtRunde);
            const txtEbene = "Ebene " + match.level.toString();
            //doc.text(xmin + (xmax - xmin) / 2 - doc.getTextWidth(txtEbene) / 2, y, txtEbene);
            const txtGruppe = "Gruppe " + j.toString();
            //doc.text(xmin + 5 * (xmax - xmin) / 6 - doc.getTextWidth(txtGruppe) / 2, y, txtGruppe);
            const txtAll = txtRunde + "    -    " + txtEbene + "    -    " + txtGruppe
            doc.text(txtAll, xmin + 5, y);

            y += 16;
            const txtSpieler = "Spieler";
            doc.text(xmin + (xmax - xmin) / 6 - doc.getTextWidth(txtSpieler) / 2, y, txtSpieler);
            const txtPin1 = getPinName(match.pin1, pins);
            doc.text(xmin + (xmax - xmin) / 2 - doc.getTextWidth(txtPin1) / 2, y, txtPin1);
            const txtPin2 = getPinName(match.pin2, pins);
            doc.text(xmin + 5 * (xmax - xmin) / 6 - doc.getTextWidth(txtPin2) / 2, y, txtPin2);
            doc.line(xmin, y - 8, xmax, y - 8);
            doc.line(xmin, y + 4, xmax, y + 4);

            for (let k = 0; k < 4; k++) {
                y += 12;
                doc.line(xmin, y + 4, xmax, y + 4);
            }

            doc.line(xmin, y - 4 * 12 - 8, xmin, y + 4);
            doc.line(xmin + (xmax - xmin) / 3, y - 4 * 12 - 8, xmin + (xmax - xmin) / 3, y + 4);
            doc.line(xmin + 2 * (xmax - xmin) / 3, y - 4 * 12 - 8, xmin + 2 * (xmax - xmin) / 3, y + 4);
            doc.line(xmax, y - 4 * 12 - 8, xmax, y + 4);

            y += 12;
            doc.setFontSize(12);
            let line = "Ablauf einer Runde:";
            doc.text(xmin, y, line);
            doc.line(xmin, y + 1, xmin + doc.getTextWidth(line), y + 1);
            y += 6;
            doc.text(xmin, y, "1. Verteilt euch in ungefähr gleich großen Gruppen auf die beiden Flipper, wenn ihr mehr als drei Spieler seid.");
            y += 5;
            doc.text(xmin, y, "2. Spielt an dem ersten Flipper euer Spiel und tragt eure Namen und die Scores ein.");
            y += 5;
            doc.text(xmin, y, "3. Wechselt auf den anderen Flipper und erspielt euch auch dort eure Scores - diese ebenfalls notieren.");
            y += 5;
            doc.text(xmin, y, "4. Tragt die Scores im Liga-Programm ein - die Runden-Ergebnisse werden automatisch berechnet.");

            if (i < matches.length - 1 || j < match.count) {
                doc.addPage("a5", "landscape");
            }
        }
    });

    doc.save("Matchcards - " + "Runde " + round.toString() + '.pdf');
}
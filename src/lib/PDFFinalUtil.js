import jsPDF from "jspdf";
import { drawTitleSquare, writeTitle, writeSubtitle, drawSquare } from "./PDFUtil.js";
import { formatDate, mapDate } from "./TypeUtil.js";
import { getPinName } from "./PinUtil.js";
import { getPlayerName } from "./PlayerUtil.js";

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

const darkblue = [153, 181, 199];
const midblue = [204, 217, 227];
const liteblue = [227, 237, 240];
const litegreen = [180, 218, 180];

export function generateFinalResultsPDF(data, color = true) {
    const doc = new jsPDF();
    doc.setFont("times");

    const headerColor = color ? darkblue : ["0.80"];

    const round = data.round;
    const rankFinal = round && round.results ? round.results.rankFinal : null;

    // ---- Seite 1: Gesamtwertung ----
    drawTitleSquare(doc, headerColor);
    writeTitle(doc, data.tournament.name);
    const roundLabel = round ? 'nach ' + round.rid.toString() + ' Runden (' + mapDate(round.created) + ')' : '';
    writeSubtitle(doc, 'Gesamtwertung ' + roundLabel);

    let x = 10;
    let y = 45;

    if (rankFinal) {
        // rankFinal: index 0 = lowest level → reverse for display (1st place first)
        const levelsDesc = rankFinal.slice().reverse();
        let place = 1;
        levelsDesc.forEach((level, li) => {
            level.players.forEach((player, pi) => {
                const alternate = place % 2 === 0;
                if (alternate) {
                    if (color) {
                        drawSquare(doc, x, y - 5, 190, 6, ...liteblue);
                    } else {
                        drawSquare(doc, x, y - 5, 190, 6, "0.95");
                    }
                }
                doc.setFontSize(12);
                const placeStr = place.toString() + '.';
                doc.text(x, y, placeStr);
                doc.text(x + 20, y, getPlayerName(player.id, data.players));
                place++;
                y += 6;
                if (y > 280) {
                    doc.addPage();
                    drawTitleSquare(doc, headerColor);
                    writeTitle(doc, data.tournament.name);
                    writeSubtitle(doc, 'Gesamtwertung ' + roundLabel + ' (Fortsetzung)');
                    y = 45;
                }
            });
        });
    } else {
        doc.setFontSize(12);
        doc.text(x, y, 'Noch kein abgeschlossenes Ergebnis vorhanden.');
    }

    // ---- Seite pro Runde: Rundendetails ----
    if (data.rounds && data.rounds.length > 0) {
        data.rounds.forEach((r) => {
            doc.addPage();
            drawTitleSquare(doc, headerColor);
            writeTitle(doc, data.tournament.name);
            writeSubtitle(doc, 'Ergebnisse Runde ' + r.rid.toString());

            x = 10;
            y = 45;

            // Header
            doc.setFontSize(10);
            doc.setLineWidth(0.1);
            doc.text(x, y, 'Match');
            doc.text(x + 40, y, 'Spieler');
            doc.text(x + 130 - doc.getTextWidth('Score'), y, 'Score');
            doc.text(x + 140, y, 'Flipper');
            y += 3;
            doc.line(x, y, 200, y);
            y += 5;

            if (!r.frames || r.frames.length === 0) {
                doc.text(x, y, 'Keine Matches.');
            } else {
                // Sort frames by level then match
                const sortedFrames = r.frames.slice().sort((a, b) =>
                    a.lid !== b.lid ? a.lid - b.lid : a.mid - b.mid
                );
                // Collect sorted players per frame by score
                const sortByScore = (frame) => {
                    const items = frame.players.map((p, i) => ({
                        player: p,
                        score: frame.scores && frame.scores.length > i ? frame.scores[i] : 0
                    }));
                    items.sort((a, b) => b.score - a.score);
                    return items;
                };

                let alternate = false;
                sortedFrames.forEach((frame) => {
                    const frameName = frame.name ? frame.name.substring(frame.name.indexOf('Ebene')) : (frame.lid ? ('Ebene ' + frame.lid) : '');
                    const isBye = frame.players.length <= 1;
                    const pinText = isBye ? '(Freirunde)' : getPinName(frame.pin, data.pins);
                    const sorted = sortByScore(frame);
                    const rowHeight = sorted.length * 5 + 3;

                    if (y + rowHeight > 280) {
                        doc.addPage();
                        drawTitleSquare(doc, headerColor);
                        writeTitle(doc, data.tournament.name);
                        writeSubtitle(doc, 'Ergebnisse Runde ' + r.rid.toString() + ' (Fortsetzung)');
                        x = 10;
                        y = 45;
                        doc.setFontSize(10);
                        doc.setLineWidth(0.1);
                        doc.text(x, y, 'Match');
                        doc.text(x + 40, y, 'Spieler');
                        doc.text(x + 130 - doc.getTextWidth('Score'), y, 'Score');
                        doc.text(x + 140, y, 'Flipper');
                        y += 3;
                        doc.line(x, y, 200, y);
                        y += 5;
                    }

                    if (alternate) {
                        if (color) {
                            drawSquare(doc, x, y - 5, 190, rowHeight, ...liteblue);
                        } else {
                            drawSquare(doc, x, y - 5, 190, rowHeight, "0.95");
                        }
                    }
                    alternate = !alternate;

                    doc.setFontSize(10);
                    doc.text(x, y, frameName);
                    doc.text(x + 140, y, pinText);

                    sorted.forEach((item, idx) => {
                        const playerName = getPlayerName(item.player, data.players);
                        doc.text(x + 40, y, playerName);
                        if (!isBye && frame.scores && frame.scores.length === frame.players.length) {
                            const scoreStr = item.score.toLocaleString();
                            if (idx === 0 && color) {
                                drawSquare(doc, x + 130 - doc.getTextWidth(scoreStr) - 1, y - 4, doc.getTextWidth(scoreStr) + 2, 5, ...litegreen);
                            }
                            doc.text(x + 130 - doc.getTextWidth(scoreStr), y, scoreStr);
                        }
                        if (idx < sorted.length - 1) y += 5;
                    });
                    y += 8;
                });
            }
        });
    }

    doc.save(data.tournament.name + ' Ergebnisse' + (color ? '' : ' Print') + '.pdf');
}
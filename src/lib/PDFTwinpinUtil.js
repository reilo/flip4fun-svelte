import { jsPDF } from "jspdf";
import { drawSquare, drawTitleSquare, writeTitle, writeSubtitle } from "./PDFUtil.js";
import { mapDate } from "./TypeUtil.js";
import { getPinName } from "./PinUtil.js";
import { getPlayerName } from "./PlayerUtil.js";
import { calcTwinpinRanking } from "./TourUtil.js";

const darkblue = [153, 181, 199];
const midblue = [204, 217, 227];
const liteblue = [227, 237, 240];
const litegreen = [180, 218, 180];

export function generateTwinpinResultsPDF(data, color = true) {
    const doc = new jsPDF();
    doc.setFont("times");

    const headerColor = color ? darkblue : ["0.80"];
    const tournament = data.tournament;
    const rounds = data.rounds;
    const round = data.round;

    // ---- Seite 1: Gesamtwertung ----
    drawTitleSquare(doc, headerColor);
    writeTitle(doc, tournament.name);
    const roundLabel = round ? 'nach ' + round.rid.toString() + ' Runden' : '';
    writeSubtitle(doc, 'Gesamtwertung ' + roundLabel);

    const ranking = calcTwinpinRanking(rounds);

    let x = 10;
    let y = 45;

    // Header
    doc.setFontSize(10);
    doc.text(x, y, "#");
    doc.text(x + 15, y, "Spieler");
    const scoreLabel = "Punkte";
    doc.text(x + 175 - doc.getTextWidth(scoreLabel), y, scoreLabel);
    y += 3;
    doc.setLineWidth(0.1);
    doc.line(x, y, 200, y);
    y += 7;

    doc.setFontSize(13);
    let alternate = false;
    ranking.forEach((item, i) => {
        if (alternate) {
            if (color) {
                drawSquare(doc, x, y - 5, 190, 7, ...liteblue);
            } else {
                drawSquare(doc, x, y - 5, 190, 7, "0.95");
            }
        }
        alternate = !alternate;

        const placeStr = (i + 1).toString() + '.';
        doc.text(x, y, placeStr);
        doc.text(x + 15, y, getPlayerName(item.player, data.players));
        const scoreStr = item.score.toString();
        doc.text(x + 175 - doc.getTextWidth(scoreStr), y, scoreStr);
        y += 7;

        if (y > 280) {
            doc.addPage();
            drawTitleSquare(doc, headerColor);
            writeTitle(doc, tournament.name);
            writeSubtitle(doc, 'Gesamtwertung ' + roundLabel + ' (Fortsetzung)');
            y = 45;
        }
    });

    // ---- Seite pro Runde: Matches ----
    if (rounds && rounds.length > 0) {
        rounds.forEach((r) => {
            if (!r.matches || r.matches.length === 0) return;

            doc.addPage();
            drawTitleSquare(doc, headerColor);
            writeTitle(doc, tournament.name);
            writeSubtitle(doc, 'Matches Runde ' + r.rid.toString());

            x = 10;
            y = 45;

            // Header
            doc.setFontSize(10);
            doc.text(x, y, "#");
            doc.text(x + 10, y, "Team 1");
            doc.text(x + 60, y, "Team 2");
            doc.text(x + 110, y, "Ergebnis");
            doc.text(200 - doc.getTextWidth("Flipper"), y, "Flipper");
            y += 3;
            doc.setLineWidth(0.1);
            doc.line(x, y, 200, y);
            y += 7;

            doc.setFontSize(11);
            alternate = false;

            r.matches.forEach((match, mi) => {
                const team1List = match.team1 && match.team1.length > 0
                    ? match.team1.map((p) => getPlayerName(p, data.players))
                    : ['Freilos'];
                const team2List = match.team2 && match.team2.length > 0
                    ? match.team2.map((p) => getPlayerName(p, data.players))
                    : ['Freilos'];
                const pinText = match.pin ? getPinName(match.pin, data.pins) : '';

                // Row height: 5 per player line + 2 padding
                const maxLines = Math.max(team1List.length, team2List.length);
                const lineHeight = 5;
                const rowHeight = maxLines * lineHeight + 2;

                if (y + rowHeight > 280) {
                    doc.addPage();
                    drawTitleSquare(doc, headerColor);
                    writeTitle(doc, tournament.name);
                    writeSubtitle(doc, 'Matches Runde ' + r.rid.toString() + ' (Fortsetzung)');
                    x = 10;
                    y = 45;
                    doc.setFontSize(10);
                    doc.text(x, y, "#");
                    doc.text(x + 10, y, "Team 1");
                    doc.text(x + 60, y, "Team 2");
                    doc.text(x + 110, y, "Ergebnis");
                    doc.text(200 - doc.getTextWidth("Flipper"), y, "Flipper");
                    y += 3;
                    doc.setLineWidth(0.1);
                    doc.line(x, y, 200, y);
                    y += 7;
                    doc.setFontSize(11);
                }

                if (alternate) {
                    if (color) {
                        drawSquare(doc, x, y - 5, 190, rowHeight, ...liteblue);
                    } else {
                        drawSquare(doc, x, y - 5, 190, rowHeight, "0.95");
                    }
                }
                alternate = !alternate;

                // Match number
                doc.text(x, y, (mi + 1).toString());

                // Team 1 - highlight winner
                const winner = match.score1 != null && match.score2 != null
                    ? (match.score1 > match.score2 ? 1 : match.score2 > match.score1 ? 2 : 0)
                    : null;

                team1List.forEach((name, li) => {
                    if (winner === 1 && color) {
                        drawSquare(doc, x + 10, y + li * lineHeight - 4, doc.getTextWidth(name), 5, ...litegreen);
                    }
                    doc.text(x + 10, y + li * lineHeight, name);
                });

                // Team 2 - highlight winner
                team2List.forEach((name, li) => {
                    if (winner === 2 && color) {
                        drawSquare(doc, x + 60, y + li * lineHeight - 4, doc.getTextWidth(name), 5, ...litegreen);
                    }
                    doc.text(x + 60, y + li * lineHeight, name);
                });

                // Result
                if (match.score1 != null && match.score2 != null) {
                    const resultStr = match.score1.toString() + ' : ' + match.score2.toString();
                    doc.text(x + 110, y, resultStr);
                }

                // Pin (right-aligned)
                if (pinText) {
                    doc.text(200 - doc.getTextWidth(pinText), y, pinText);
                }

                y += rowHeight;
            });
        });
    }

    doc.save(tournament.name + ' Ergebnisse' + (color ? '' : ' Print') + '.pdf');
}

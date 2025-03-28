import { jsPDF } from 'jspdf';
import { sortPlayerIDs, getPlayerName } from "./PlayerUtil";
import { getPinName } from "./PinUtil";

export function generatePDF(data) {

    const drawHeaderSquare = () => {
        doc.setDrawColor(0);
        doc.setFillColor("0.80");
        doc.rect(5, 5, 200, 30, 'F');
    }

    const writeTitle = () => {
        doc.setFontSize(20);
        doc.text(10, 15, data.tournament.name);
    }

    const writeMatchSubTitle = () => {
        doc.setFontSize(16);
        doc.text(10, 30, "Tabelle nach Spieltag " + data.round.rid.toString());
    }

    const writePStatSubTitle = () => {
        doc.setFontSize(16);
        doc.text(10, 30, "Spielerstatistik Spieltag " + data.round.rid.toString());
    }

    const doc = new jsPDF();
    doc.setFont("times");

    drawHeaderSquare();
    writeTitle();
    writeMatchSubTitle();

    let x = 10;
    let y = 50;
    doc.setFontSize(12);

    data.round.results.rankFinal.forEach((item, i) => {
        doc.text(x, y, (i + 1).toString() + ".");
        doc.text(x + 10, y, getPlayerName(item.player, data.players));
        doc.text(x + 100, y, (Math.round(item.points * 10) / 10).toFixed(1).toString());
        y += 8;
    })
    doc.addPage();

    let players = data.tournament.players.slice();
    sortPlayerIDs(players, data.players);
    players.forEach((player) => {
        drawHeaderSquare();
        writeTitle();
        writePStatSubTitle();
        let matches = [];
        data.rounds.forEach((round, i) => {
            round.matches.forEach((match) => {
                if (match.player1 === player || match.player2 === player) {
                    matches.push(match);
                }
            })
        })
        y = 50;
        doc.setFontSize(16);
        doc.text(x, y, getPlayerName(player, data.players));
        y += 5;
        doc.setLineWidth(0.1);
        doc.line(x, y, 200, y);
        doc.setFontSize(12);
        y += 10;
        if (!matches.length) {
            doc.text(x, y, "noch keine Matches absolviert");
        } else {
            matches.forEach((match) => {
                doc.text(x, y, getPlayerName(match.player1, data.players) + " - " + getPlayerName(match.player2, data.players));
                doc.text(x + 100, y, match.score1.toString() + " : " + match.score2.toString());
                doc.text(x + 130, y, getPinName(match.pin, data.pins));
                y += 8;
            })
        }
        doc.addPage();
    })

    doc.save(data.tournament.name + " Spieltag " + data.round.rid + '.pdf');
}
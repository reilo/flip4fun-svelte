import { jsPDF } from 'jspdf';
import { sortPlayerIDs, getPlayerName } from "./PlayerUtil";
import { getPinName } from "./PinUtil";
import { mapDate } from './TypeUtil';

export function generatePDF(data) {

    const roundNum = data.round.rid.toString();
    const roundDate = mapDate(data.round.createdAt);

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
        doc.text(10, 30, "Tabelle nach Spieltag " + roundNum + " (" + roundDate + ")");
    }

    const writePStatSubTitle = () => {
        doc.setFontSize(16);
        doc.text(10, 30, "Spielerstatistik nach Spieltag " + roundNum + " (" + roundDate + ")");
    }

    const doc = new jsPDF();
    doc.setFont("times");

    drawHeaderSquare();
    writeTitle();
    writeMatchSubTitle();

    let x = 10;
    let y = 50;
    doc.setFontSize(12);

    const rankFinal = data.round.results.rankFinal;
    const rankInit = data.round.settings.rankInit;

    rankFinal.forEach((item, i) => {
        const initItem = rankInit.find((item2) => item2.player === item.player);
        doc.text(x, y, (i + 1).toString() + ".");
        doc.text(x + 10, y, getPlayerName(item.player, data.players));
        const diffPoints = item.points - initItem.points;
        const diffPointsStrg = diffPoints ? (Math.round((diffPoints) * 10) / 10).toFixed(1).toString() : "";
        doc.text(x + 80 - doc.getTextWidth(diffPointsStrg), y, diffPointsStrg);
        const pointsStrg = (Math.round(item.points * 10) / 10).toFixed(1).toString();
        doc.text(x + 100 - doc.getTextWidth(pointsStrg), y, pointsStrg);
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
        let totalMatches = 0;
        data.rounds.forEach((round, i) => {
            round.matches.forEach((match) => {
                if (match.player1 === player || match.player2 === player) {
                    let newMatch = JSON.parse(JSON.stringify(match));
                    newMatch.round = round.rid;
                    matches.push(newMatch);
                    totalMatches++;
                }
            })
        })
        let playerPoints = 0;
        let playerRanking = 0;
        rankFinal.forEach((item, i) => {
            if (item.player === player) {
                playerPoints = item.points;
                playerRanking = i + 1;
            }
        });
        y = 50;
        doc.setFontSize(16);
        doc.text(x, y, getPlayerName(player, data.players));
        doc.setFontSize(14);
        doc.text(x + 100, y, totalMatches + (totalMatches == 1 ? " Match" : " Matches"));
        doc.text(x + 135, y, (Math.round(playerPoints * 10) / 10).toFixed(1).toString() + " Punkte");
        const rankingText = playerRanking + ". Platz";
        doc.text(200 - doc.getTextWidth(rankingText), y, rankingText);
        y += 5;
        doc.setLineWidth(0.1);
        doc.line(x, y, 200, y);
        doc.setFontSize(12);
        y += 10;
        if (!matches.length) {
            doc.text(x, y, "noch keine Matches absolviert");
        } else {
            matches.forEach((match) => {
                doc.text(x + 0, y, "(" + match.round.toString() + ") " + mapDate(match.createdAt));
                const player1 = getPlayerName(match.player1, data.players)
                doc.text(x + 30, y, player1);
                if (match.score1 > match.score2) {
                    doc.line(x + 30, y + 1, x + 30 + doc.getTextWidth(player1), y + 1);
                }
                doc.text(x + 67, y, ":");
                const player2 = getPlayerName(match.player2, data.players);
                doc.text(x + 70, y, player2);
                if (match.score1 < match.score2) {
                    doc.line(x + 70, y + 1, x + 70 + doc.getTextWidth(player2), y + 1);
                }
                doc.text(x + 115, y, match.score1.toString() + " : " + match.score2.toString());
                const pinText = getPinName(match.pin, data.pins);
                doc.text(200 - doc.getTextWidth(pinText), y, pinText);
                y += 8;
            })
        }
        doc.addPage();
    })

    doc.save(data.tournament.name + " Spieltag " + data.round.rid + '.pdf');
}
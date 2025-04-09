import { jsPDF } from 'jspdf';
import { sortPlayerIDs, getPlayerName } from "./PlayerUtil";
import { getPinName } from "./PinUtil";
import { mapDate, roundNumberToStrg } from './TypeUtil';

export function generateLigaResultsPDF(data) {

    const roundNum = data.round.rid.toString();
    const roundDate = mapDate(data.round.created);

    const drawSquare = (x, y, w, h, color) => {
        doc.setDrawColor(0);
        doc.setFillColor(color);
        doc.rect(x, y, w, h, 'F');
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

    const rankFinal = data.round.results.rankFinal;
    const rankInit = data.round.settings.rankInit;

    // Seite 1 - aktueller Tabellenstand mit Details

    drawSquare(5, 5, 200, 30, "0.80");
    writeTitle();
    writeMatchSubTitle();

    let x = 10;
    let y = 45;

    // Titelzeile 1
    doc.setFontSize(10);
    // gained points
    doc.text(x + 105 - doc.getTextWidth("Punkte"), y, "Punkte");
    // total points
    doc.text(x + 135 - doc.getTextWidth("Punkte"), y, "Punkte");
    // matches in round
    doc.text(x + 160 - doc.getTextWidth("Spiele"), y, "Spiele");
    // total matches
    doc.text(x + 185 - doc.getTextWidth("Spiele"), y, "Spiele");

    // Titelzeile 2
    y += 4;
    // player name
    doc.text(x + 10, y, "Spieler");
    // rank change
    doc.text(x + 75 - doc.getTextWidth("Tendenz"), y, "Tendenz");
    // gained points
    doc.text(x + 105 - doc.getTextWidth("Spieltag"), y, "Spieltag");
    // total points
    doc.text(x + 135 - doc.getTextWidth("Gesamt"), y, "Gesamt");
    // matches in round
    doc.text(x + 160 - doc.getTextWidth("Spieltag"), y, "Spieltag");
    // total matches
    doc.text(x + 185 - doc.getTextWidth("Gesamt"), y, "Gesamt");

    y += 3;
    // Trennungslinie
    doc.setLineWidth(0.1);
    doc.line(x, y, 200, y);

    doc.setFontSize(13);
    y += 7;
    const highlight = [2, 3, 7, 8, 9, 10, 16, 17, 18, 19, 20, 21, 29, 30, 31, 32, 33, 34, 35, 36];
    let dy = 7;
    rankFinal.forEach((item, i) => {

        let initItem;
        let initItemIndex;
        rankInit.forEach((item2, i) => {
            if (item2.player === item.player) {
                initItem = item2;
                initItemIndex = i;
            }
        });
        // alternating background
        if (highlight.includes(i + 1)) {
            drawSquare(x, y - dy + 2, 190, dy, "0.90");
        }
        // current rank
        doc.text(x, y, (i + 1).toString() + ".");
        // player name
        doc.text(x + 10, y, getPlayerName(item.player, data.players));
        // rank change
        const diffRank = initItemIndex - i;
        const diffRankStrg = diffRank ? (diffRank > 0 ? "+" : "") + diffRank.toString() : "";
        doc.text(x + 75 - doc.getTextWidth(diffRankStrg), y, diffRankStrg);
        // gained points
        const diffPoints = roundNumberToStrg(item.points - initItem.points);
        const diffPointsStrg = diffPoints ? (diffPoints > 0 ? "+" : "") + diffPoints.toString() : "";
        doc.text(x + 105 - doc.getTextWidth(diffPointsStrg), y, diffPointsStrg);
        // current points
        const pointsStrg = roundNumberToStrg(item.points).toString();
        doc.text(x + 135 - doc.getTextWidth(pointsStrg), y, pointsStrg);
        // count matches round
        const diffMatchesStrg = (item.matches - initItem.matches).toString();
        doc.text(x + 160 - doc.getTextWidth(diffMatchesStrg), y, diffMatchesStrg);
        // total match count
        const matchesStrg = item.matches.toString();
        doc.text(x + 185 - doc.getTextWidth(matchesStrg), y, matchesStrg);
        y += dy;
    })

    // Seite 2 bis n+1 - Spieler-Statistiken

    let players = data.tournament.players.slice();
    sortPlayerIDs(players, data.players);

    players.forEach((player) => {
        doc.addPage();

        drawSquare(5, 5, 200, 30, "0.80");
        writeTitle();
        writePStatSubTitle();

        // alle Spieltag-Matches ermitteln
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

        // Spieler Gesamtpunkte und Ranking ermitteln
        let playerPoints = 0;
        let playerRanking = 0;
        let playerBonus = 0;
        let playerMismatch = 0;
        let playerPenalty = 0;
        rankFinal.forEach((item, i) => {
            if (item.player === player) {
                playerPoints = item.points;
                playerRanking = i + 1;
                playerBonus = item.bonus;
                playerMismatch = item.mismatch;
                playerPenalty = item.penalty;
            }
        });

        // Spielername
        y = 50;
        doc.setFontSize(16);
        doc.text(x, y, getPlayerName(player, data.players));

        // zusammenfassene Daten
        doc.setFontSize(12);
        const matchesStrg = "Matches: " + totalMatches;
        doc.text(x + 85 - doc.getTextWidth(matchesStrg), y, matchesStrg);
        const pointsStrg = "Punkte: " + roundNumberToStrg(playerPoints).toString();
        doc.text(x + 115 - doc.getTextWidth(pointsStrg), y, pointsStrg);
        //const rankingText = playerRanking + ". Platz";
        const bonusStrg = "Antrittsbonus: " + playerBonus.toString();
        doc.text(x + 150 - doc.getTextWidth(bonusStrg), y, bonusStrg);
        const penaltyStrg = "Passivitätsabzüge: " + playerPenalty.toString();
        doc.text(x + 190 - doc.getTextWidth(penaltyStrg), y, penaltyStrg);

        // Trennungslinie
        y += 5;
        doc.setLineWidth(0.1);
        doc.line(x, y, 200, y);

        // Liste der Matches
        doc.setFontSize(11);
        y += 10;
        if (!matches.length) {
            doc.text(x, y, "noch keine Matches absolviert");
        } else {
            matches.forEach((match) => {
                // Nummer des Spieltags + Spieldatum
                doc.text(x + 0, y, "(" + match.round.toString() + ") " + mapDate(match.created));
                // Spieler 1
                const player1 = getPlayerName(match.player1, data.players)
                doc.text(x + 30, y, player1);
                // Spieler 1 ggf. unterstreichen
                if (match.score1 > match.score2) {
                    doc.line(x + 30, y + 1, x + 30 + doc.getTextWidth(player1), y + 1);
                }
                // Match-Trenner
                doc.text(x + 67, y, ":");
                // Spieler 2
                const player2 = getPlayerName(match.player2, data.players);
                doc.text(x + 70, y, player2);
                // Spieler 2 ggf. unterstreichen
                if (match.score1 < match.score2) {
                    doc.line(x + 70, y + 1, x + 70 + doc.getTextWidth(player2), y + 1);
                }
                // Spielergebnis
                doc.text(x + 115, y, match.score1.toString() + " : " + match.score2.toString());
                // Flipper
                const pinText = getPinName(match.pin, data.pins);
                doc.text(200 - doc.getTextWidth(pinText), y, pinText);

                y += 6;
            })
        }
    })

    // Seite n+2 bis 2n+1
    // Verfügbare Gegener

    doc.save(data.tournament.name + " Spieltag " + data.round.rid + '.pdf');
}
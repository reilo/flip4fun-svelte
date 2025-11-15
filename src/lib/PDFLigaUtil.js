import { jsPDF } from "jspdf";
import { sortPlayerIDs, getPlayerName, getPyramidLayout } from "./PlayerUtil";
import { getPinName } from "./PinUtil";
import { mapDate, roundNumberToStrg } from "./TypeUtil";
import { calcPoints } from "./MatchUtil";
import { drawSquare, drawTitleSquare, writeTitle, writeSubtitle } from "./PDFUtil";

const darkblue = [153, 181, 199];
const midblue = [204, 217, 227];
const liteblue = [227, 237, 240];
const litegreen = [180, 218, 180];
const litered = [218, 180, 180];

const writePlayerSquare = (doc, color) => {
    if (color) {
        drawSquare(doc, 5, 37.5, 200, 12, ...midblue);
    } else {
        drawSquare(doc, 5, 37.5, 200, 12, "0.90");
    }
}

const getStrength = (player, round) => {
    const rank = round.settings.rankInit.find((item) => item.player === player);
    return rank != null ? rank.strength : 0;
};

const writePlayerMatchesHeader = (doc, x, y) => {
    doc.setFontSize(10);
    doc.text(x + 0, y, "Spieltag");
    doc.text(x + 28, y, "Spieler 1");
    doc.text(x + 68, y, "Spieler 2");
    doc.text(x + 110, y, "Sätze");
    doc.text(x + 130 - doc.getTextWidth("Punkte") / 2, y, "Punkte");
    doc.text(200 - doc.getTextWidth("Flipper"), y, "Flipper");

};

export function generateLigaResultsPDF(data, color = true) {

    const doc = new jsPDF();
    doc.setFont("times");

    const roundNum = data.round.rid.toString();
    const roundDate = mapDate(data.round.created);

    const rankFinal = data.round.results.rankFinal;
    const rankInit = data.round.settings.rankInit;

    let alternate = false;

    let x = 0;
    let y = 0;

    // Seite 0 - Spielstärken

    if (color) {
        drawTitleSquare(doc, darkblue);
        writeTitle(doc, data.tournament.name);
        writeSubtitle(doc, "Spielstärken nach Spieltag " + roundNum + " (" + roundDate + ")");

        const rowNum = 8;
        const layout = getPyramidLayout(rowNum, 170, 210, 1.5);
        if (layout.valid) {

            const imageWidth = layout.imageWidth;
            const imageHeight = layout.imageHeight;

            alternate = false;
            x = 5;
            y = 45;
            for (let idx = 0; idx < rowNum; ++idx) {
                doc.setFontSize(32);
                if (alternate) {
                    drawSquare(doc, x, y + layout.rpos[idx] - 1, 200, imageHeight + 2, ...liteblue);
                } else {
                    drawSquare(doc, x, y + layout.rpos[idx] - 1, 200, imageHeight + 2, ...midblue);

                }
                doc.text(x + 2, y + layout.rpos[idx] + imageHeight - 5, (rowNum - idx).toString());
                alternate = !alternate;
            }

            x = 25;
            rankFinal.forEach((item, i) => {
                const photo = "/photos/players/" + item.player + ".jpg";
                const xpos = x + layout.xpos[i];
                const ypos = y + layout.ypos[i];
                doc.addImage(photo, "JPEG", xpos, ypos, imageWidth, imageWidth * 1.25);
                doc.setFontSize(11);
                const playerName = getPlayerName(item.player, data.players, true);
                doc.text(xpos + (imageWidth - doc.getTextWidth(playerName)) / 2, ypos + imageHeight, playerName);
            });
        }

        doc.addPage();
    }

    // Seite 1 - aktueller Tabellenstand mit Details

    drawTitleSquare(doc, color ? darkblue : ["0.80"]);
    writeTitle(doc, data.tournament.name);
    writeSubtitle(doc, "Tabelle nach Spieltag " + roundNum + " (" + roundDate + ")");

    x = 10;
    y = 45;

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
    // rank change
    doc.text(x + 25 - doc.getTextWidth("Tendenz"), y, "Tendenz");
    // player name
    doc.text(x + 40, y, "Spieler");
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
    // numbers for alternating background color depending on player strength
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
            if (color) {
                drawSquare(doc, x, y - dy + 2, 190, dy, ...liteblue);
            } else {
                drawSquare(doc, x, y - dy + 2, 190, dy, "0.95");
            }
        }
        // current rank
        doc.text(x, y, (i + 1).toString() + ".");
        // rank change
        const diffRank = initItemIndex - i;
        if (color) {
            const bgWidth = doc.getTextWidth("234");
            if (diffRank > 0) {
                drawSquare(doc, x + 25 - bgWidth, y - 4, bgWidth, 5, ...litegreen);
            } else if (diffRank < 0) {
                drawSquare(doc, x + 25 - bgWidth, y - 4, bgWidth, 5, ...litered);
            }
        }
        const diffRankStrg = diffRank ? (diffRank > 0 ? "+" : "") + diffRank.toString() : "";
        doc.text(x + 25 - doc.getTextWidth(diffRankStrg), y, diffRankStrg);
        // player name
        doc.text(x + 40, y, getPlayerName(item.player, data.players));
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

    // Seite 2 - Matches aktueller Spieltag

    doc.addPage();

    drawTitleSquare(doc, color ? darkblue : ["0.80"]);
    writeTitle(doc, data.tournament.name);

    let totalMatches = 0;
    data.rounds.forEach((round) => {
        round.matches.forEach((match) => {
            totalMatches++;
        })
    });
    const subTitle1 = "Matches Spieltag " + roundNum + " (" + roundDate + ")";
    const subTitle2 = data.round.matches.length.toString() + " von " + totalMatches.toString() + " Gesamt";
    writeSubtitle(doc, subTitle1 + " - " + subTitle2);

    x = 10;
    y = 45;

    // Titelzeile
    doc.setFontSize(10);
    // Ergebnis
    doc.text(x + 0, y, "Sätze");
    // total points
    doc.text(x + 60 - doc.getTextWidth("Duell") / 2, y, "Duell");
    // matches in round
    doc.text(x + 125 - doc.getTextWidth("Punkte") / 2, y, "Punkte");
    // total matches
    doc.text(200 - doc.getTextWidth("Flipper"), y, "Flipper");

    y += 3;
    // Trennungslinie
    doc.setLineWidth(0.1);
    doc.line(x, y, 200, y);

    doc.setFontSize(12);
    y += 7;
    dy = 6;

    alternate = false;

    data.round.matches.forEach((match) => {
        const strength1 = getStrength(match.player1, data.round);
        const strength2 = getStrength(match.player2, data.round);
        const player1 = getPlayerName(match.player1, data.players) + " (" + strength1.toString() + ")";
        const player2 = getPlayerName(match.player2, data.players) + " (" + strength2.toString() + ")";;
        const result = calcPoints(match, strength1, strength2);
        const result1 = roundNumberToStrg(result.player1).toString();
        const result2 = roundNumberToStrg(result.player2).toString();
        const pinText = getPinName(match.pin, data.pins);
        if (alternate) {
            if (color) {
                drawSquare(doc, x, y - 4, 200 - x, 5, ...liteblue);
            } else {
                drawSquare(doc, x, y - 4, 200 - x, 5, "0.95");
            }
        }
        alternate = !alternate;
        doc.text(x + 0, y, match.score1.toString() + ":" + match.score2.toString());
        const xpos1 = x + 58 - doc.getTextWidth(player1);
        if (result.player1 > result.player2) {
            if (color) {
                drawSquare(doc, xpos1, y - 4, doc.getTextWidth(player1), 5, ...litegreen);
            } else {
                doc.line(xpos1, y + 1, xpos1 + doc.getTextWidth(player1), y + 1);
            }
        }
        doc.text(xpos1, y, player1);
        doc.text(x + 60 - doc.getTextWidth(":") / 2, y, ":");
        const xpos2 = x + 62;
        if (result.player1 < result.player2) {
            if (color) {
                drawSquare(doc, xpos2, y - 4, doc.getTextWidth(player2), 5, ...litegreen)
            } else {
                doc.line(xpos2, y + 1, xpos2 + doc.getTextWidth(player2), y + 1);
            }
        }
        doc.text(xpos2, y, player2);
        doc.text(x + 123 - doc.getTextWidth(result1), y, result1);
        doc.text(x + 125 - doc.getTextWidth(":") / 2, y, ":");
        doc.text(x + 127, y, result2);
        doc.text(200 - doc.getTextWidth(pinText), y, pinText);

        y += dy;
    })

    // Seite 3 bis n+1 - Spieler-Statistiken

    let players = data.tournament.players.slice();
    sortPlayerIDs(players, data.players);

    players.forEach((player) => {

        // alle Spieltag-Matches ermitteln
        let matches = [];
        let totalMatches = 0;
        data.rounds.forEach((round, i) => {
            round.matches.forEach((match) => {
                if (match.player1 === player || match.player2 === player) {
                    let newMatch = JSON.parse(JSON.stringify(match));
                    newMatch.round = round;
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

        doc.addPage();

        drawTitleSquare(doc, color ? darkblue : ["0.80"]);
        writeTitle(doc, data.tournament.name);
        writeSubtitle(doc, "Spielerstatistik nach Spieltag " + roundNum + " (" + roundDate + ")");

        writePlayerSquare(doc, color);

        // Spielername
        y = 45;
        doc.setFontSize(16);
        doc.text(x, y, getPlayerName(player, data.players));

        // zusammenfassende Daten
        doc.setFontSize(12);
        const matchesStrg = "Matches: " + totalMatches;
        doc.text(x + 87 - doc.getTextWidth(matchesStrg), y, matchesStrg);
        const pointsStrg = "Punkte: " + roundNumberToStrg(playerPoints).toString();
        doc.text(x + 115 - doc.getTextWidth(pointsStrg), y, pointsStrg);
        //const rankingText = playerRanking + ". Platz";
        const bonusStrg = "Antrittsbonus: " + playerBonus.toString();
        doc.text(x + 150 - doc.getTextWidth(bonusStrg), y, bonusStrg);
        const penaltyStrg = "Passivitätsabzüge: " + playerPenalty.toString();
        doc.text(x + 190 - doc.getTextWidth(penaltyStrg), y, penaltyStrg);

        // Titelzeile
        y += 10;
        writePlayerMatchesHeader(doc, x, y);

        // Trennungslinie
        y += 2;
        doc.setLineWidth(0.1);
        doc.line(x, y, 200, y);

        // Vorbereitung Matches
        doc.setFontSize(10);
        y += 6;

        // Liste der Matches
        if (!matches.length) {
            doc.text(x, y, "noch keine Matches absolviert");
        } else {
            let matchCount = 0;
            let pageCount = 0;
            alternate = false;
            matches.forEach((match) => {
                matchCount++;

                if (alternate) {
                    if (color) {
                        drawSquare(doc, x, y - 4, 200 - x, 5, ...liteblue);
                    } else {
                        drawSquare(doc, x, y - 4, 200 - x, 5, "0.95");
                    }
                }
                alternate = !alternate;
                if (color) {
                    if (player === match.player1 && match.score1 > match.score2 || player === match.player2 && match.score2 > match.score1) {
                        drawSquare(doc, x + 28, y - 3, 110, 4, ...litegreen);
                    } else {
                        drawSquare(doc, x + 28, y - 3, 110, 4, ...litered);
                    }
                }
                // Nummer des Spieltags + Spieldatum
                doc.text(x + 0, y, "(" + match.round.rid.toString() + ") " + mapDate(match.created));
                // Spieler 1
                const player1 = getPlayerName(match.player1, data.players)
                const strength1 = getStrength(match.player1, match.round);
                const suffix1 = "(" + strength1.toString() + ")";
                doc.text(x + 28, y, player1 + " " + suffix1);
                // Spieler 1 ggf. unterstreichen
                if (!color && match.score1 > match.score2) {
                    doc.line(x + 28, y + 1, x + 28 + doc.getTextWidth(player1), y + 1);
                }
                // Match-Trenner
                doc.text(x + 65, y, ":");
                // Spieler 2
                const player2 = getPlayerName(match.player2, data.players);
                const strength2 = getStrength(match.player2, match.round);
                const suffix2 = "(" + strength2.toString() + ")";
                doc.text(x + 68, y, player2 + " " + suffix2);
                // Spieler 2 ggf. unterstreichen
                if (!color && match.score1 < match.score2) {
                    doc.line(x + 68, y + 1, x + 68 + doc.getTextWidth(player2), y + 1);
                }
                // Spielergebnis
                doc.text(x + 110, y, match.score1.toString() + " : " + match.score2.toString());
                // Punkte
                const xpos = 130;
                const result = calcPoints(match, strength1, strength2);
                const result1 = roundNumberToStrg(result.player1).toString();
                const result2 = roundNumberToStrg(result.player2).toString();
                doc.text(x + xpos - 1 - doc.getTextWidth(result1), y, result1);
                doc.text(x + xpos, y, ":");
                doc.text(x + xpos + 7 - doc.getTextWidth(result2), y, result2);
                // Flipper
                const pinText = getPinName(match.pin, data.pins);
                doc.text(200 - doc.getTextWidth(pinText), y, pinText);

                y += 5.5;

                if (matchCount % 40 === 0) {
                    pageCount++;

                    doc.addPage();

                    drawTitleSquare(doc, color ? darkblue : ["0.80"]);
                    writeTitle(doc, data.tournament.name);
                    writeSubtitle(doc, "Spielerstatistik nach Spieltag " + roundNum + " (" + roundDate + ")");

                    writePlayerSquare(doc, color);

                    // Spielername
                    y = 45;
                    doc.setFontSize(16);
                    doc.text(x, y, getPlayerName(player, data.players));

                    // zusammenfassende Daten
                    doc.setFontSize(12);
                    const pageString = "Seite " + (pageCount + 1).toString()
                    doc.text(x + 190 - doc.getTextWidth(pageString), y, pageString);

                    // Titelzeile
                    y += 10;
                    writePlayerMatchesHeader(doc, x, y);

                    // Trennungslinie
                    y += 2;
                    doc.setLineWidth(0.1);
                    doc.line(x, y, 200, y);

                    // Vorbereitung Matches
                    doc.setFontSize(10);
                    y += 6;
                }
            })
        }
    })

    // Seite n+2 bis 2n+1
    // Verfügbare Gegner

    doc.save(data.tournament.name + " Spieltag " + data.round.rid + (color ? "" : " Print") + '.pdf');
}

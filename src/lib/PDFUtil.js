import { jsPDF } from 'jspdf';
import { sortPlayerIDs, getPlayerName, getPyramidLayout } from "./PlayerUtil";
import { getPinName, mapPinType } from "./PinUtil";
import { mapDate, formatDateNow, roundNumberToStrg } from './TypeUtil';
import { calcPoints } from './MatchUtil';

const darkblue = [153, 181, 199];
const midblue = [204, 217, 227];
const liteblue = [227, 237, 240];
const litegreen = [180, 218, 180];
const litered = [218, 180, 180];

const drawSquare = (doc, x, y, w, h, c1, c2, c3) => {
    doc.setDrawColor(0);
    doc.setFillColor(c1, c2, c3);
    doc.rect(x, y, w, h, 'F');
}

const drawTitleSquare = (doc, color = ["0.80"]) => {
    drawSquare(doc, 5, 5, 200, 30, ...color);
    doc.addImage("/pinlounge.gif", "JPEG", 160, 10, 40, 20);
}

const writeTitle = (doc, title1, title2, fontSize1 = 20, fontSize2 = 16) => {
    doc.setFontSize(fontSize1);
    doc.text(10, 15, title1);
    if (title2) {
        doc.setFontSize(fontSize2);
        doc.text(150 - doc.getTextWidth(title2), 15, title2);
    }
}

const writeSubtitle = (doc, strg1, strg2 = "") => {
    doc.setFontSize(16);
    doc.text(10, 30, strg1);
    if (strg2) {
        //doc.setFontSize(12);
        doc.text(150 - doc.getTextWidth(strg2), 30, strg2);
    }
}

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

export function generatePinsPDF(pins) {

    const doc = new jsPDF();
    doc.setFont("times");

    let pageNum = 1;

    drawTitleSquare(doc);
    writeTitle(doc, "Pinball Lounge - Flipperliste", "Stand: " + mapDate(new Date));
    writeSubtitle(doc, "alphabetisch - Seite " + pageNum++);

    let x = 10;
    let y = 45;
    let num = 0;

    let pinTypes = new Map();
    let pinOwners = new Map();
    let pinsByOwner = new Map();

    doc.setFontSize(12);
    pins.forEach((pin) => {
        if (!pin.deleted && pin.id !== 'muma') {
            num += 1;

            const numStrg = num.toString() + ".";
            doc.text(x + 10 - doc.getTextWidth(numStrg), y, numStrg);
            doc.text(x + 15, y, pin.name);
            doc.text(x + 80, y, mapPinType(pin.type));
            if (pin.owner) {
                doc.text(x + 110, y, pin.owner);
            }
            y += 6;

            pinTypes.set(pin.type, pinTypes.has(pin.type) ? pinTypes.get(pin.type) + 1 : 1);
            if (pin.owner) {
                pinOwners.set(pin.owner, pinOwners.has(pin.owner) ? pinOwners.get(pin.owner) + 1 : 1);
                pinsByOwner.set(pin.owner, pinsByOwner.has(pin.owner) ? [...pinsByOwner.get(pin.owner), pin.id] : [pin.id]);
            }
        }
        if (num > 0 && num % 40 === 0) {
            // next page
            doc.addPage();
            drawTitleSquare(doc);
            writeTitle(doc, "Pinball Lounge - Flipperliste", "Stand: " + mapDate(new Date));
            writeSubtitle(doc, "alphabetisch - Seite " + pageNum++);
            y = 45;
            doc.setFontSize(12);
        }
    })

    let owners = [];
    pinOwners.forEach((value, key) => owners.push(key));
    owners.sort();

    doc.addPage();
    pageNum = 1;
    drawTitleSquare(doc);
    writeTitle(doc, "Pinball Lounge - Flipperliste", "Stand: " + mapDate(new Date));
    writeSubtitle(doc, "nach Besitzer - Seite " + pageNum++);

    x = 10;
    y = 45;
    num = 0;
    let numByOwner = 0;
    let firstOwner = true;

    doc.setFontSize(12);
    owners.forEach((owner) => {
        numByOwner = 0;
        if (firstOwner) {
            firstOwner = false;
        } else {
            // Trennungslinie
            doc.setLineWidth(0.1);
            doc.line(x, y - 2, 200, y - 2);
            num++;
            y += 6;
            if (num > 0 && num % 40 === 0) {
                // next page
                doc.addPage();
                drawTitleSquare(doc);
                writeTitle(doc, "Pinball Lounge - Flipperliste", "Stand: " + mapDate(new Date));
                writeSubtitle(doc, "nach Besitzer - Seite " + pageNum++);
                y = 45;
                doc.setFontSize(12);
            }
        }
        pinsByOwner.get(owner).forEach((pinID) => {
            const pin = pins.find((pin) => pin.id === pinID);
            if (pin && !pin.deleted && pin.id !== 'muma') {
                num++;
                numByOwner += 1;
                const numStrg = numByOwner.toString() + ".";
                doc.text(x + 10 - doc.getTextWidth(numStrg), y, numStrg);
                doc.text(x + 15, y, pin.name);
                doc.text(x + 80, y, mapPinType(pin.type));
                if (pin.owner) {
                    doc.text(x + 110, y, pin.owner);
                }
                y += 6;
            }
            if (num > 0 && num % 40 === 0) {
                // next page
                doc.addPage();
                drawTitleSquare(doc);
                writeTitle(doc, "Pinball Lounge - Flipperliste", "Stand: " + mapDate(new Date));
                writeSubtitle(doc, "nach Besitzer - Seite " + pageNum++);
                y = 45;
                doc.setFontSize(12);
            }
        })
    })

    doc.addPage();
    drawTitleSquare(doc);
    writeTitle(doc, "Pinball Lounge - Flipperliste", "Stand: " + mapDate(new Date));
    writeSubtitle(doc, "Zusammenfassung");

    x = 10;
    y = 45;
    doc.setFontSize(14);

    owners.forEach((owner) => {
        doc.text(x, y, owner);
        const count = pinOwners.get(owner).toString();
        doc.text(x + 45 - doc.getTextWidth(count), y, count);
        y += 8
    })

    // Trennungslinie
    doc.setLineWidth(0.1);
    doc.line(x, y, 200, y);

    y += 10;

    let types = [];
    pinTypes.forEach((value, key) => types.push(key));
    types.sort((a, b) => (mapPinType(a) > mapPinType(b) ? 1 : mapPinType(a) < mapPinType(b) ? -1 : 0));
    types.forEach((item) => {
        doc.text(x, y, mapPinType(item));
        const count = pinTypes.get(item).toString();
        doc.text(x + 45 - doc.getTextWidth(count), y, count);
        y += 8
    })

    doc.save("Flipperliste " + mapDate(new Date) + '.pdf');
}

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

export function generateCertificatePDF(title, versions, lines, names) {

    const xmax = 210;
    const ymax = 297;
    let y = 0;

    const doc = new jsPDF();
    doc.setFont("times");

    versions.forEach((version, i) => {

        y = 0;
        doc.addImage("/photos/urkunde.jpg", "JPEG", 0, 0, xmax, ymax);

        y += 80;
        doc.addImage("/pinlounge.jpg", "JPEG", 60, y, xmax - 2 * 60, 45);

        y += 70;
        doc.setFontSize(36);
        doc.text((xmax - doc.getTextWidth(title)) / 2, y, title);

        y += 18;
        doc.setFontSize(32);
        doc.text((xmax - doc.getTextWidth(version)) / 2, y, version);

        doc.setFontSize(20);
        y += 15;
        lines.forEach((line) => {
            doc.text((xmax - doc.getTextWidth(line)) / 2, y, line);
            y += 8;
        })

        doc.setFontSize(32);
        y += 10;
        doc.text((xmax - doc.getTextWidth(names[i])) / 2, y, names[i]);

        doc.setFontSize(20);
        y += 24;
        const subtitle = "Puchheim, den " + mapDate(Date());
        doc.text((xmax - doc.getTextWidth(subtitle)) / 2, y, subtitle);

        doc.setLineWidth(0.1);
        y += 28;
        doc.line(40, y, xmax - 40, y);

        doc.setFontSize(20);
        y += 7;
        const team = "Pinball Lounge Team";
        doc.text((xmax - doc.getTextWidth(team)) / 2, y, team);

        if (names.length > i + 1) {
            doc.addPage();
        }
    })

    doc.save("Urkunden " + title + '.pdf');
}

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
            writeSubtitle(doc, "Ergebniszettel - " + formatDateNow());

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
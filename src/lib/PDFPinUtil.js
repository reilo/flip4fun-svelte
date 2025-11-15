import jsPDF from "jspdf";
import { drawTitleSquare, writeTitle, writeSubtitle } from "./PDFUtil.js";  
import { mapDate } from "./TypeUtil.js";
import { mapPinType } from "./PinUtil.js";

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


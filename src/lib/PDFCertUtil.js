import jsPDF from "jspdf";
import { mapDate } from "./TypeUtil.js";

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


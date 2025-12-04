
// FIX: Use relative path for import from other root-level directory.
import { FinancialRecord, Client, Invoice } from '../types';

// Inform TypeScript about the global jspdf object from the CDN script
declare const jspdf: any;

// The TFunction type from i18next is complex, so using a simpler function type for this util.
type TFunction = (key: string) => string;

const calculateTotal = (items: Invoice['items']) => {
  return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
};

export const generateInvoicePdf = (record: FinancialRecord, client: Client | undefined, t: TFunction) => {
  if (record.type !== 'Income' || !record.invoiceId) return;
  // Fallback for simple legacy financial records
  const { jsPDF } = jspdf;
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("IBRA Services", 20, 30);
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(t('pdf.invoice.title'), 170, 30);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  doc.setFontSize(10);
  doc.text("2374 Rue Royale, Trois-Rivières, QC G9A 4L5", 20, 42);
  doc.text("(819) 979-1017 | ibrahima02ndiaye@gmail.com", 20, 47);
  doc.text("https://servicesibra.ca/", 20, 52);

  doc.setFontSize(12);
  doc.text(`${t('pdf.invoice.number')}: ${record.invoiceId}`, 20, 65);
  doc.text(`${t('pdf.invoice.date')}: ${new Date(record.date).toLocaleDateString()}`, 20, 72);
  doc.text(t('pdf.invoice.bill_to'), 20, 85);
  if (client) {
    doc.setFont("helvetica", "bold");
    doc.text(client.name, 20, 92);
    doc.setFont("helvetica", "normal");
    doc.text(client.address, 20, 99);
  } else {
    doc.text("N/A", 20, 92);
  }
  doc.setDrawColor(203, 213, 225); 
  doc.setFillColor(248, 250, 252); 
  doc.rect(20, 115, 170, 10, 'F');
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text(t('pdf.invoice.description'), 25, 122);
  doc.text(t('pdf.invoice.amount'), 170, 122);
  doc.setTextColor(15, 23, 42); 
  doc.setFont("helvetica", "normal");
  const descriptionLines = doc.splitTextToSize(record.description, 130);
  doc.text(descriptionLines, 25, 135);
  doc.text(`$${record.amount.toFixed(2)}`, 170, 135);
  doc.setFont("helvetica", "bold");
  doc.text(t('pdf.invoice.total'), 140, 175);
  doc.text(`$${record.amount.toFixed(2)}`, 170, 175);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(t('pdf.invoice.thank_you'), 105, 280, { align: "center" });
  doc.text("IBRA Services - Mécanique, Taxi, Livraison, Climatisation", 105, 285, { align: "center" });
  doc.save(`Facture-${record.invoiceId}.pdf`);
};

export const generateFullInvoicePdf = (invoice: Invoice, client: Client | undefined, t: TFunction) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const total = calculateTotal(invoice.items);

  const primaryColor = invoice.template === 'modern' ? [37, 99, 235] : [0, 0, 0]; // Blue vs Black
  
  if (invoice.template === 'modern') {
    // --- MODERN TEMPLATE ---
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("IBRA Services", 20, 25);
    
    doc.setFontSize(14);
    doc.text(t('pdf.invoice.title').toUpperCase(), 190, 25, { align: "right" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`${t('pdf.invoice.number')}: ${invoice.number}`, 20, 55);
    doc.text(`${t('pdf.invoice.date')}: ${new Date(invoice.date).toLocaleDateString()}`, 20, 60);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, 65);
    
    // Company Info
    doc.setFontSize(9);
    doc.text("2374 Rue Royale, Trois-Rivières, QC G9A 4L5", 190, 55, { align: "right" });
    doc.text("(819) 979-1017", 190, 60, { align: "right" });
    doc.text("ibrahima02ndiaye@gmail.com", 190, 65, { align: "right" });
    doc.text("https://servicesibra.ca/", 190, 70, { align: "right" });

    if (client) {
      doc.setFont("helvetica", "bold");
      doc.text(t('pdf.invoice.bill_to'), 20, 80);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(client.name, 20, 87);
      doc.text(client.email, 20, 92);
      const addressLines = doc.splitTextToSize(client.address, 80);
      doc.text(addressLines, 20, 97);
    }

    let yPos = 115;
    // Header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 8, 170, 12, 'F');
    doc.setFont("helvetica", "bold");
    doc.text(t('pdf.invoice.description'), 25, yPos);
    doc.text("Qty", 120, yPos);
    doc.text("Price", 145, yPos);
    doc.text(t('pdf.invoice.amount'), 190, yPos, { align: "right" });

    yPos += 12;
    doc.setFont("helvetica", "normal");

    invoice.items.forEach(item => {
      const lineTotal = item.quantity * item.unitPrice;
      const descLines = doc.splitTextToSize(item.description, 90);
      doc.text(descLines, 25, yPos);
      doc.text(item.quantity.toString(), 125, yPos, { align: "center" });
      doc.text(`$${item.unitPrice.toFixed(2)}`, 155, yPos, { align: "right" });
      doc.text(`$${lineTotal.toFixed(2)}`, 190, yPos, { align: "right" });
      yPos += Math.max(10, descLines.length * 5);
    });

    // Total
    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(120, yPos, 190, yPos);
    yPos += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(t('pdf.invoice.total'), 155, yPos, { align: "right" });
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`$${total.toFixed(2)}`, 190, yPos, { align: "right" });

  } else if (invoice.template === 'minimal') {
    // --- MINIMAL TEMPLATE ---
    doc.setFont("courier", "bold");
    doc.setFontSize(22);
    doc.text("FACTURE", 20, 30);
    
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
    doc.text("IBRA Services", 20, 40);
    doc.text("2374 Rue Royale, Trois-Rivières", 20, 45);
    doc.text("(819) 979-1017", 20, 50);
    doc.text("https://servicesibra.ca/", 20, 55);

    doc.text(`ID: ${invoice.number}`, 140, 40);
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 140, 45);

    if (client) {
      let clientY = 70;
      doc.text(t('pdf.invoice.bill_to'), 20, clientY);
      doc.text(client.name.toUpperCase(), 20, clientY + 5);
      doc.text(client.email, 20, clientY + 10);
    }

    let yPos = 100;
    doc.setDrawColor(0, 0, 0);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    invoice.items.forEach(item => {
      const lineTotal = item.quantity * item.unitPrice;
      doc.text(item.description, 20, yPos);
      doc.text(`$${lineTotal.toFixed(2)}`, 190, yPos, { align: "right" });
      yPos += 8;
    });

    yPos += 5;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.setFont("courier", "bold");
    doc.text(`TOTAL: $${total.toFixed(2)}`, 190, yPos, { align: "right" });

  } else {
    // --- CLASSIC TEMPLATE (Default) ---
    doc.setFont("times", "bold");
    doc.setFontSize(28);
    doc.text("IBRA Services", 20, 30);
    
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(t('pdf.invoice.title'), 160, 30);
    doc.line(20, 35, 190, 35);
    
    doc.text("2374 Rue Royale, Trois-Rivières, QC G9A 4L5", 20, 42);
    doc.text("(819) 979-1017 | ibrahima02ndiaye@gmail.com", 20, 47);
    doc.text("https://servicesibra.ca/", 20, 52);

    doc.text(`${t('pdf.invoice.number')}: ${invoice.number}`, 150, 42);
    doc.text(`${t('pdf.invoice.date')}: ${new Date(invoice.date).toLocaleDateString()}`, 150, 47);

    if (client) {
      doc.text(t('pdf.invoice.bill_to'), 20, 75);
      doc.setFont("times", "bold");
      doc.text(client.name, 20, 82);
      doc.setFont("times", "normal");
      doc.text(client.address, 20, 89);
    }

    // Table
    let yPos = 110;
    doc.setFont("times", "bold");
    doc.text(t('pdf.invoice.description'), 20, yPos);
    doc.text("Amount", 190, yPos, { align: "right" });
    doc.line(20, yPos + 2, 190, yPos + 2);
    yPos += 10;
    
    doc.setFont("times", "normal");
    invoice.items.forEach(item => {
      const lineTotal = item.quantity * item.unitPrice;
      doc.text(`${item.description} (x${item.quantity})`, 20, yPos);
      doc.text(`$${lineTotal.toFixed(2)}`, 190, yPos, { align: "right" });
      yPos += 8;
    });

    yPos += 10;
    doc.line(130, yPos, 190, yPos);
    yPos += 10;
    doc.setFont("times", "bold");
    doc.text(`${t('pdf.invoice.total')}: $${total.toFixed(2)}`, 190, yPos, { align: "right" });
  }

  // Common Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Merci de faire affaire avec IBRA Services", 105, 280, { align: "center" });
  doc.text("Mécanique - Taxi - Livraison - Climatisation | servicesibra.ca", 105, 285, { align: "center" });

  doc.save(`Facture-${invoice.number}.pdf`);
};

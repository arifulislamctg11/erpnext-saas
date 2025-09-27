import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  customerName: string
  customerEmail: string
  companyName: string
  planName: string
  amount: string
  currency: string
  billingPeriod: string
  status: string
  sessionId: string
}

export interface ReceiptData {
  receiptNumber: string
  receiptDate: string
  customerName: string
  customerEmail: string
  planName: string
  amount: string
  currency: string
  paymentMethod: string
  sessionId: string
  status: string
}

export class PDFGenerator {
  static generateInvoice(data: InvoiceData): void {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', 20, 30)
    
    // Company Info
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Innovatun ERP Solutions', 20, 45)
    doc.text('123 Business Street', 20, 52)
    doc.text('City, State 12345', 20, 59)
    doc.text('Email: billing@innovatun.com', 20, 66)
    
    // Invoice Details
    doc.setFontSize(10)
    doc.text(`Invoice #: ${data.invoiceNumber}`, 140, 45)
    doc.text(`Date: ${data.invoiceDate}`, 140, 52)
    doc.text(`Due Date: ${data.dueDate}`, 140, 59)
    
    // Customer Info
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Bill To:', 20, 80)
    doc.setFont('helvetica', 'normal')
    doc.text(data.customerName, 20, 87)
    doc.text(data.customerEmail, 20, 94)
    doc.text(data.companyName, 20, 101)
    
    // Line separator
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 110, 190, 110)
    
    // Service Details
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Service Details', 20, 125)
    
    // Table headers
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Description', 20, 135)
    doc.text('Billing Period', 80, 135)
    doc.text('Amount', 150, 135)
    
    // Table content
    doc.setFont('helvetica', 'normal')
    doc.text(data.planName, 20, 145)
    doc.text(data.billingPeriod, 80, 145)
    doc.text(data.amount, 150, 145)
    
    // Line separator
    doc.line(20, 150, 190, 150)
    
    // Total
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total: ${data.amount}`, 150, 165)
    
    // Payment Info
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Payment Status:', 20, 180)
    doc.setFont('helvetica', 'bold')
    doc.text(data.status.toUpperCase(), 60, 180)
    
    doc.text('Session ID:', 20, 190)
    doc.text(data.sessionId, 60, 190)
    
    // Footer
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Thank you for your business!', 20, 280)
    doc.text('For support, contact us at support@innovatun.com', 20, 285)
    
    // Download
    doc.save(`invoice-${data.invoiceNumber}.pdf`)
  }
  
  static generateReceipt(data: ReceiptData): void {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYMENT RECEIPT', 20, 30)
    
    // Company Info
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Innovatun ERP Solutions', 20, 45)
    doc.text('123 Business Street', 20, 52)
    doc.text('City, State 12345', 20, 59)
    doc.text('Email: billing@innovatun.com', 20, 66)
    
    // Receipt Details
    doc.setFontSize(10)
    doc.text(`Receipt #: ${data.receiptNumber}`, 140, 45)
    doc.text(`Date: ${data.receiptDate}`, 140, 52)
    
    // Customer Info
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Customer:', 20, 80)
    doc.setFont('helvetica', 'normal')
    doc.text(data.customerName, 20, 87)
    doc.text(data.customerEmail, 20, 94)
    
    // Line separator
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 100, 190, 100)
    
    // Payment Details
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Payment Details', 20, 115)
    
    // Payment info table
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Service:', 20, 125)
    doc.text(data.planName, 60, 125)
    
    doc.text('Amount:', 20, 135)
    doc.text(data.amount, 60, 135)
    
    doc.text('Payment Method:', 20, 145)
    doc.text(data.paymentMethod, 60, 145)
    
    doc.text('Status:', 20, 155)
    doc.setFont('helvetica', 'bold')
    doc.text(data.status.toUpperCase(), 60, 155)
    
    doc.setFont('helvetica', 'normal')
    doc.text('Transaction ID:', 20, 165)
    doc.text(data.sessionId, 60, 165)
    
    // Line separator
    doc.line(20, 175, 190, 175)
    
    // Total
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Total Paid: ${data.amount}`, 20, 190)
    
    // Footer
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('This receipt confirms your payment has been processed successfully.', 20, 210)
    doc.text('Keep this receipt for your records.', 20, 220)
    doc.text('For support, contact us at support@innovatun.com', 20, 230)
    
    // Download
    doc.save(`receipt-${data.receiptNumber}.pdf`)
  }
  
  static generateInvoiceFromHTML(elementId: string, filename: string): void {
    const element = document.getElementById(elementId)
    if (!element) {
      console.error('Element not found for PDF generation')
      return
    }
    
    html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      pdf.save(filename)
    }).catch(error => {
      console.error('Error generating PDF:', error)
    })
  }
}

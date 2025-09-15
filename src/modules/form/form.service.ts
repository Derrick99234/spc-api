// src/form/form.service.ts
import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FormService {
  private filePath = path.join(process.cwd(), 'src/data/forms.xlsx');

  async saveFormData(createFormDto: CreateFormDto, sheetName: string) {
    const workbook = new ExcelJS.Workbook();

    // Ensure /data folder exists
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Load workbook if exists
    if (fs.existsSync(this.filePath)) {
      await workbook.xlsx.readFile(this.filePath);
    }

    // Get or create sheet
    let sheet = workbook.getWorksheet(sheetName);
    if (!sheet) {
      sheet = workbook.addWorksheet(sheetName);
      const headerRow = sheet.addRow([
        'Platform',
        'Service Type',
        'Post Type',
        'Amount Spent',
        'View Count',
        'Reach',
        'Date Submitted',
      ]);

      // ✅ Style the header row
      headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true, size: 14 };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFDDDDDD' },
        };

        // 🔥 Auto-set column width to fit header text length
        const textLength = cell.value ? cell.value.toString().length : 10;
        sheet.getColumn(colNumber).width = textLength + 5; // +5 padding so it’s not tight
      });

      // Optional: make row taller
      headerRow.height = 25;
    }

    // Add one row for each post (explicitly by index)
    createFormDto.post.forEach((p) => {
      sheet.addRow([
        createFormDto.platform,
        sheetName.replace(/-/g, ' ').toLowerCase(),
        p.postType,
        p.amountSpent,
        p.viewCount,
        p.reach,
        new Date().toLocaleString(),
      ]);
    });

    // Save back to file
    await workbook.xlsx.writeFile(this.filePath);

    console.log(`✅ Added rows. New total: ${sheet.rowCount}`);
    return { message: `Data saved to sheet "${sheetName}" successfully ✅` };
  }
}

import { Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FormService {
  private filePath = path.join(__dirname, '../../data/forms.xlsx');

  async saveFormData(dto: CreateFormDto) {
    const workbook = new ExcelJS.Workbook();

    // If file exists, load it, otherwise create a new one
    if (fs.existsSync(this.filePath)) {
      await workbook.xlsx.readFile(this.filePath);
    } else {
      const sheet = workbook.addWorksheet('Submissions');
      sheet.columns = [
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Age', key: 'age', width: 10 },
        { header: 'Date Submitted', key: 'date', width: 20 },
      ];
    }

    const sheet =
      workbook.getWorksheet('Submissions') ||
      workbook.addWorksheet('Submissions');

    sheet.addRow({
      name: dto.name,
      email: dto.email,
      age: dto.age,
      date: new Date().toLocaleString(),
    });

    await workbook.xlsx.writeFile(this.filePath);

    return { message: 'Form saved to Excel successfully ✅' };
  }
}

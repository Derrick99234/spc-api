import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}
  private filePath = path.join(process.cwd(), 'src/data/forms.xlsx');

  @Post(':sheetName')
  async saveForm(
    @Body() createFormDto: CreateFormDto,
    @Param('sheetName') sheetName: string,
  ) {
    return this.formService.saveFormData(createFormDto, sheetName);
  }

  @Get('download')
  async downloadFile(@Res() res: Response) {
    if (fs.existsSync(this.filePath)) {
      res.download(this.filePath, 'forms.xlsx'); // force download
    } else {
      res.status(404).send('File not found');
    }
  }
}

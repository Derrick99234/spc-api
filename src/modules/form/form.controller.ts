import { Body, Controller, Param, Post } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post(':sheetName')
  async saveForm(
    @Body() createFormDto: CreateFormDto,
    @Param('sheetName') sheetName: string,
  ) {
    return this.formService.saveFormData(createFormDto, sheetName);
  }
}

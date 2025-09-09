import { Body, Controller, Post } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  async submitForm(@Body() dto: CreateFormDto) {
    return this.formService.saveFormData(dto);
  }
}

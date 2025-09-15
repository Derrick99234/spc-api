import { IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class PostDto {
  @IsString()
  postType: string;

  @IsNumber()
  amountSpent: number;

  @IsNumber()
  viewCount: number;

  @IsNumber()
  reach: number;
}

export class CreateFormDto {
  @IsString()
  platform: string;

  @IsString()
  serviceType: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostDto)
  post: PostDto[];
}

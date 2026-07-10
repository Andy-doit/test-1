import { IsEmail, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SendContactDto {
  @ApiProperty({ description: 'Họ và tên người gửi', example: 'Nguyễn Văn A' })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @MaxLength(100, { message: 'Họ tên không được vượt quá 100 ký tự' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  fullname: string;

  @ApiPropertyOptional({ description: 'Email liên hệ', example: 'user@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email?: string;

  @ApiProperty({ description: 'Nội dung lời nhắn', example: 'Tôi muốn hỏi về dịch vụ...' })
  @IsNotEmpty({ message: 'Lời nhắn không được để trống' })
  @MaxLength(2000, { message: 'Lời nhắn không được vượt quá 2000 ký tự' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  message: string;

  @ApiPropertyOptional({ description: 'Đồng ý nhận thông tin quảng cáo', default: false })
  @IsOptional()
  @IsBoolean()
  optIn?: boolean;
}
import { IsNumber, IsString } from 'class-validator';

export class PurchaseDto {
  @IsNumber()
  readonly quantity: number;

  @IsString()
  readonly stripeProductPriceId: string;
}

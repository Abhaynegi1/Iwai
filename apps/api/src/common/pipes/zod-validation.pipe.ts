import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { type ZodSchema, ZodError } from "@iwai/validation";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        throw new BadRequestException({
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details,
        });
      }
      throw new BadRequestException("Validation failed");
    }
  }
}

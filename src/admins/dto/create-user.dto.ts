import { IsString, MinLength } from "class-validator";
import { SanitizeText } from "../../common/decorators/sanitize.decorator";

export class CreateUserDto {
    @IsString()
    @SanitizeText()
    name: string;

    @IsString()
    @MinLength(8)
    password: string;
}

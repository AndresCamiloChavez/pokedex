import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsString({message: 'El nombre es obligatorio'})
    @MinLength(1, {message: 'El nombre debe tener más de 1 carácter'})
    name: string;

    @IsInt({message: 'Debe de ser un número'})
    @IsPositive({ message: 'Debe ser un número positivo'})
    @Min(1, { message: 'El número no puede ser mayor a 1'})
    no: number;
    
}

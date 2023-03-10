import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDTO } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll( queryParams : PaginationDTO ) {
    const {limit = 10, offset = 0} = queryParams;
    return await this.pokemonModel.find().limit(limit).skip(offset).sort({no: 1}).select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      // validando si es un número
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no ${term} no found`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    let pokemon: Pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {
      const updatePokemon = await pokemon.updateOne(updatePokemonDto, {
        new: true,
      }); // para regresar el nuevo objeto
      return { ...pokemon.toJSON(), ...updatePokemonDto }; // para regresar el pokemon actualizado
    } catch (error) {
      this.handleExceptions(error);
    }
    // updatePokemon no se puede retornar ya que nos devuelve cosas 'raras' de mongo y no las propiedades directamente
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // pokemon.deleteOne();

    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const {deletedCount, acknowledged} = await this.pokemonModel.deleteOne({ _id: id });

    if(deletedCount == 0){
      throw new NotFoundException(`Not found pokemon by id ${id}`);
    }

    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exist in DB ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Can't craete Pokemon - Check server logs`,
    );
  }
}

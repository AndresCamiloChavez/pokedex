import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/pokeresponse.interface';
import { HttpAdapter } from '../../dist/common/interfaces/http-adapter.interface';
import { AxiosAdapter } from '../common/http_adapters/axios.adapter';
@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  // async executeSeed() {

  //   await this.pokemonModel.deleteMany({});
  //   const { data } = await this.axios.get<PokeResponse>(
  //     'https://pokeapi.co/api/v2/pokemon?limit=50',
  //   );

  //   const insertPromesesArray = [];

  //   data.results.forEach(({ name, url }) => {
  //     const segments = url.split('/');
  //     const no = +segments[segments.length - 2];
  //     insertPromesesArray.push(this.pokemonModel.create({ name, no }));
  //   });

  //   await Promise.all(insertPromesesArray);
  //   return data;
  // }
  async executeSeed() {

    await this.pokemonModel.deleteMany({});
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=50',
    );

    const pokemonToInsert: {name: string, no: number}[] = [];

    data.results.forEach(({name,url}) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemonToInsert.push({name, no});
      
    });

    this.pokemonModel.insertMany(pokemonToInsert);


    return data;
  }
}

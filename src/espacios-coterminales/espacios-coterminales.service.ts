import { Injectable } from '@nestjs/common';
import { CreateEspaciosCoterminaleDto } from './dto/create-espacios-coterminale.dto';
import { UpdateEspaciosCoterminaleDto } from './dto/update-espacios-coterminale.dto';

@Injectable()
export class EspaciosCoterminalesService {
  create(createEspaciosCoterminaleDto: CreateEspaciosCoterminaleDto) {
    return 'This action adds a new espaciosCoterminale';
  }

  findAll() {
    return `This action returns all espaciosCoterminales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} espaciosCoterminale`;
  }

  update(id: number, updateEspaciosCoterminaleDto: UpdateEspaciosCoterminaleDto) {
    return `This action updates a #${id} espaciosCoterminale`;
  }

  remove(id: number) {
    return `This action removes a #${id} espaciosCoterminale`;
  }
}

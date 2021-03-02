import { Inject, Injectable } from '@nestjs/common';
import { PLACE_REPOSITORY, SPORT_REPOSITORY } from 'src/core/constants';
import { PlaceDto } from './dto/place.dto';
import { Place } from './place.entity';

@Injectable()
export class PlacesService {
  constructor(
    @Inject(PLACE_REPOSITORY)
    private readonly placeRepository: typeof Place,
  ) {}

  async createPlace(place: PlaceDto, adminId: number): Promise<Place> {
    return await this.placeRepository.create<Place>({
      ...place,
      adminId,
    });
  }

  async findAllPlaces(): Promise<Place[]> {
    return await this.placeRepository.findAll<Place>({});
  }

  async findOnePlace(placeId: number): Promise<Place> {
    return await this.placeRepository.findOne({
      where: { id: placeId },
    });
  }

  async deletePlace(placeId: number) {
    return await this.placeRepository.destroy({ where: { id: placeId } });
  }

  async updatePlace(placeId: number, data: PlaceDto) {
    const [
      numberOfAffectedRows,
      [updatedPlace],
    ] = await this.placeRepository.update(
      { ...data },
      { where: { id: placeId }, returning: true },
    );

    return { numberOfAffectedRows, updatedPlace };
  }
}

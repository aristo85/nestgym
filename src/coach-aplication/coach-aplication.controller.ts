import { Controller, Get } from '@nestjs/common';
import { CoachApplication } from './coach-aplication.entity';
import { CoachAplicationService } from './coach-aplication.service';

@Controller('coach-aplication')
export class CoachAplicationController {
    constructor(private readonly coachAppService: CoachAplicationService){}

    @Get()
    public async getCoatchApp(): Promise<CoachApplication[]>{
        return this.coachAppService.getAllCoachApps();
    }
}

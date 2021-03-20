import {
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Userapp } from '../userapps/userapp.entity';
import { Roles, User } from '../users/user.entity';
import { AuthUser, UserRole } from '../users/users.decorator';
import { clientPayOrRejectDto } from './dto/tranasaction.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('Payments (Оплата)')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly appPaymentService: TransactionsService) {}

  // payment
  @ApiOperation({ summary: 'Оплатить или отклонить' })
  @ApiResponse({ status: 200 })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiForbiddenResponse({ status: 403, description: 'Forbidden' })
  @ApiNotFoundResponse({ status: 404, description: 'Not Found' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id заявки',
  })
  @UseGuards(AuthGuard('jwt'))
  @Put('payOrReject/:id')
  async clientResponseToPayOrReject(
    @Param('id') id: number,
    @Body() data: clientPayOrRejectDto,
    @UserRole() role: Roles,
    @AuthUser() user: User,
  ) {
    // check the role
    if (role !== 'user') {
      throw new ForbiddenException('Your role is not a user');
    }
    // check userapp
    const app = await Userapp.findOne({
      where: { id, userId: user.id, coachId: data.coachId, status: 'notPaid' },
    });
    if (!app) {
      throw new NotFoundException("This app doesn't exist");
    }
    // get the number of row affected and the updated userapp
    const updatedApplication = await this.appPaymentService.clientResponseToPayOrReject(
      id,
      data.clientResponse,
      app.regular,
      data.coment,
    );

    // return the updated app
    return updatedApplication;
  }
}

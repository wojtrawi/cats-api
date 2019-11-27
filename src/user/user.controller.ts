import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UpdateUserDto } from './update-user.dto';
import { User } from './user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User('sub') userId: string,
  ): Promise<any> {
    return await this.userService.update(updateUserDto, userId);
  }
}

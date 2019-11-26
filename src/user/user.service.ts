import { HttpService, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { UpdateUserDto } from './update-user.dto';

dotenv.config();

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  async update(updateUserDto: UpdateUserDto, userId: string): Promise<any> {
    const { data: tokenResponse } = await this.httpService
      .post(`${process.env.AUTH0_DOMAIN}/oauth/token`, {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_API_SECRET,
        audience: `${process.env.AUTH0_DOMAIN}/api/v2/`,
        grant_type: 'client_credentials',
      })
      .toPromise();

    return await this.httpService
      .patch(
        `${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
        updateUserDto,
        {
          headers: {
            'Content-type': 'application/json',
            authorization: `Bearer ${tokenResponse.access_token}`,
          },
        },
      )
      .toPromise()
      .then(res => res.data);
  }
}

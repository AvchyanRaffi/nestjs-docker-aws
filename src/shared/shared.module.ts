import { Global, HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AwsS3Service } from './services/aws-s3.service';
import { ConfigService } from './services/config.service';
import { FileService } from './services/file.service';
import { GeneratorService } from './services/generator.service';

const providers = [ConfigService, AwsS3Service, FileService, GeneratorService];

@Global()
@Module({
  providers,
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        privateKey: configService.jwtConfig.privateKey,
        publicKey: configService.jwtConfig.publicKey,
        signOptions: {
          expiresIn: configService.jwtConfig.tokenExpiresIn,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [...providers, HttpModule, JwtModule],
})
export class SharedModule {}

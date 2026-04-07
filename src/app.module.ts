import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './infra/database/database.module'
import { ArtistModule } from './modules/artists/artist.module'
import { UserModule } from './modules/users/user.module'
import { AlbumModule } from './modules/albums/album.module'
import { TrackModule } from './modules/tracks/track.module'
import { PlaylistModule } from './modules/playlists/playlist.module'
import { LikeModule } from './modules/likes/like.module'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from './common/guards/roles.guard'
import envValidation from '@app/infra/config/env.validation'
import databaseConfig from './infra/config/database.config'
import appConfig from './infra/config/app.config'
import { AuthGuard } from './common/guards/auth.guard'
import { JwtModule } from '@nestjs/jwt'
import authConfig from './infra/config/auth.config'
import { AuthModule } from './modules/auth/auth.module'

const ENV = process.env.NODE_ENV

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`,
      load: [appConfig, databaseConfig, authConfig],
      validationSchema: envValidation
    }),
    DatabaseModule,
    ArtistModule,
    UserModule,
    AlbumModule,
    TrackModule,
    PlaylistModule,
    LikeModule,
    AuthModule,
    JwtModule.registerAsync(authConfig.asProvider())
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}

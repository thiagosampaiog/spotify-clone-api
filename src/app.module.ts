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

import databaseConfig from './infra/config/database.config'
import appConfig from './infra/config/app.config'

const ENV = process.env.NODE_ENV

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`,
      load: [appConfig, databaseConfig]
    }),
    DatabaseModule,
    ArtistModule,
    UserModule,
    AlbumModule,
    TrackModule,
    PlaylistModule,
    LikeModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}

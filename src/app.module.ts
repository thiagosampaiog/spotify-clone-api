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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
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

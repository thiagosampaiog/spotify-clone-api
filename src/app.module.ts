import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './infra/database/database.module'
import { ArtistModule } from './modules/artists/artist.module'
import { UserModule } from './modules/users/user.module'
import { AlbumModule } from './modules/albums/album.module'
import { TrackModule } from './modules/tracks/track.module'
import { PlaylistModule } from './modules/playlists/playlist.module'

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
    PlaylistModule
  ]
})
export class AppModule {}

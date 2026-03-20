import { Controller, Inject } from '@nestjs/common'
import { AlbumService } from './album.service'

@Controller()
export class AlbumController {
  constructor(
    @Inject()
    private AlbumService: AlbumService
  ) {}
}

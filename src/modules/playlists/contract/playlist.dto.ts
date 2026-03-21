import { PartialType } from "@nestjs/swagger";

export class CreatePlaylistDto {}
export class UpdatePlaylistDto extends PartialType(CreatePlaylistDto){}
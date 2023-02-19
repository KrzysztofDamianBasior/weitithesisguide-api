import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { CreateNoteDto } from '../dto/create-note.dto';
import { Roles } from 'src/auth/roles';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Roles('User')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return this.notesService.create({
      authorId: req.user.sub,
      content: createNoteDto.content,
      title: createNoteDto.title,
    });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get('?')
  findAllByAuthor(
    @Query('offset') offset: number,
    @Query('per_page') perPage: number,
    @Request() req,
  ) {
    return this.notesService.findMany({
      author: req.user.sub,
      offset,
      perPage,
    });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    this.notesService.verifyNoteAuthor({
      userId: req.user.sub,
      noteId: id,
    });
    return this.notesService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: CreateNoteDto,
    @Request() req,
  ) {
    this.notesService.verifyNoteAuthor({
      userId: req.user.sub,
      noteId: id,
    });
    return this.notesService.update({
      content: updateNoteDto.content,
      id,
      title: updateNoteDto.title,
    });
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    this.notesService.verifyNoteAuthor({
      userId: req.user.sub,
      noteId: id,
    });
    return this.notesService.remove(id);
  }
}

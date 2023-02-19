import { ForbiddenException, Injectable } from '@nestjs/common';
import { NotesRepository } from '../db/notes.repository';
import { Types } from 'mongoose';
@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  create({
    authorId,
    content,
    title,
  }: {
    authorId: string | Types.ObjectId;
    content: string;
    title: string;
  }) {
    return this.notesRepository.create({ authorId, content, title });
  }

  findMany({
    author,
    offset,
    perPage,
  }: {
    author: string;
    offset: number;
    perPage: number;
  }) {
    return this.notesRepository.findMany({
      filterQuery: { author },
      offset,
      perPage,
    });
  }

  findOne(id: string) {
    return this.notesRepository.findOne(id);
  }

  update({
    id,
    content,
    title,
  }: {
    id: string;
    title: string;
    content: string;
  }) {
    return this.notesRepository.updateOne({ id, content, title });
  }

  remove(id: string) {
    return this.notesRepository.remove(id);
  }

  async verifyNoteAuthor({
    userId,
    noteId,
  }: {
    userId: string;
    noteId: string;
  }) {
    const note = await this.notesRepository.findOne(noteId);
    if (note.author.toString() !== userId) {
      throw new ForbiddenException(
        'not enough privileges to perform an action on a resource',
      );
    }
    return true;
  }
}

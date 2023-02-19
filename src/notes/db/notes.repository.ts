import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note, NoteDocument } from './note.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { UsersRepository } from 'src/users/db/users.repository';

@Injectable()
export class NotesRepository {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create({
    authorId,
    content,
    title,
  }: {
    authorId: string | Types.ObjectId;
    content: string;
    title: string;
  }): Promise<NoteDocument> {
    const payload: Note = {
      author: authorId,
      content,
      title,
    };
    const newNote = new this.noteModel(payload);
    await newNote.save();
    return newNote;
  }

  async remove(id: string | Types.ObjectId) {
    return this.noteModel.deleteOne({ id });
  }

  async find(postsFilterQuery: FilterQuery<Note>): Promise<NoteDocument[]> {
    return this.noteModel.find(postsFilterQuery);
  }

  async findAll({ offset, perPage }: { offset: number; perPage: number }) {
    return this.noteModel
      .find()
      .skip(offset)
      .limit(perPage)
      .sort({ createdAt: 'desc' });
  }

  async findOne(_id: string | Types.ObjectId): Promise<NoteDocument> {
    return await this.noteModel.findById(_id);
  }

  async updateOne({
    id,
    content,
    title,
  }: {
    id: string | Types.ObjectId;
    content: string;
    title: string;
  }) {
    const note = await this.noteModel.findById(id);
    note.content = content;
    note.title = title;
    return note.save();
  }

  async update({
    note,
    noteFilterQuery,
  }: {
    noteFilterQuery: FilterQuery<Note>;
    note: Partial<Note>;
  }): Promise<NoteDocument> {
    return this.noteModel.findOneAndUpdate(noteFilterQuery, note, {
      new: true,
    });
  }

  async findNoteAuthor(noteId: string) {
    const post = await this.noteModel.findById(noteId);
    return this.usersRepository.findOne({
      _id: post.author,
    });
  }
}

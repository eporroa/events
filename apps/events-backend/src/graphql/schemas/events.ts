import { Field, ID, InputType, ObjectType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema()
export class Event extends Document {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  title!: string;

  @Field()
  @Prop({ required: true })
  description!: string;

  @Field()
  @Prop({ required: true })
  date!: string;

  @Field()
  @Prop({ required: true })
  location!: string;

  @Field(() => [RSVP])
  @Prop({ type: [{ type: Object }], default: [] })
  rsvps: RSVP[];

  @Field()
  @Prop({ required: true })
  organizerId: string;

  @Field()
  @Prop({ default: false })
  rsvpFrozen: boolean;
}

@ObjectType()
export class RSVP {
  @Field()
  userId: string;

  @Field()
  status: RSVPStatus;

  @Field()
  timestamp: Date;
}

@ObjectType()
export enum RSVPStatus {
  YES = 'YES',
  NO = 'NO', 
  MAYBE = 'MAYBE'
}

@InputType()
export class CreateEventInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  date: string;

  @Field()
  location: string;
}

@InputType()
export class UpdateRSVPInput {
  @Field(() => ID)
  eventId: string;

  @Field()
  status: RSVPStatus;
}

export const EventSchema = SchemaFactory.createForClass(Event);
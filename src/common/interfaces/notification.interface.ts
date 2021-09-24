import { UserEntity } from 'src/entities/user.entity';

export interface NotificationInterface {
  notify(user: UserEntity, data: NotificationData): void;
}

export interface NotificationData {
  type: string;
  typeId: number;
  data: {
    type: string;
    id: string;
    text: string;
    title: string;
    additionalInfo: unknown;
  };
}

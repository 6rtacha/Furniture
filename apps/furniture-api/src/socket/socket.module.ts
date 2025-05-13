import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../components/auth/auth.module';
import { NotificationModule } from '../components/notification/notification.module';

@Module({
	imports: [AuthModule],
	providers: [SocketGateway],
	exports: [SocketGateway],
})
export class SocketModule {}

import { Injectable } from '@nestjs/common';
import { BoardArticle } from '../../libs/dto/board-article/board-article';
import { Model } from 'mongoose';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BoardArticleService {
	constructor(
		@InjectModel('BoardArticle') private readonly propertyModel: Model<BoardArticle>,
		private memberService: MemberService,
		private viewService: ViewService,
	) {}
}

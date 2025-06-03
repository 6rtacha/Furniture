import { Test, TestingModule } from '@nestjs/testing';
import { NoticeResolver } from './notice.resolver';

describe('NoticeResolver', () => {
  let resolver: NoticeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoticeResolver],
    }).compile();

    resolver = module.get<NoticeResolver>(NoticeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

import { Entity, Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity()
export class HomePageImg {
  @PrimaryGeneratedColumn()
  imgId: number;

  @Column('text')
  imgUrl: string; // 图片资源链接

  @Column('int')
  targetType: number; // 跳转目标类型

  @Column('text')
  targetValue: string; // 跳转目标值

  @Column('text')
  title: string; // 鼠标移入显示的文本信息

  @Column('int')
  moduleType: number; // 所属模块类型

  @Column({ type: 'timestamp', default: () => 'current_timestamp' })
  createTime: Timestamp; // 创建时间

  @Column('text')
  videoUrl: string; // 视频资源链接（targetType为视频时存在）
}

interface MessageModel {
  id: number; // 메시지 PK
  content: string; // 메시지 내용 - 더미데이터는 대략 10 ~ 20 글자
  createdAt: string; // 메시지 작성일시 - 현재 날짜 이후는 불가
  isEdited: boolean; // 수정 여부 - 더미데이터는 대체로 false 처리
  isDeleted: boolean; // 삭제 여부 - 더미데이터는 대체로 false 처리
  parentMessageId?: number; // 해당 값이 존재할 경우 그 PK에 대한 답장이 됨 - 더미데이터는 해당 데이터 없음
  channelId: number; // 해당 메시지가 종속되어있는 채널(채팅방) PK ID - 더미데이터는 1 로 고정
  profileId: number; // 작성자 프로필 PK ID - 더미데이터는 1~30 까지만 허용
  fileId?: number;
}
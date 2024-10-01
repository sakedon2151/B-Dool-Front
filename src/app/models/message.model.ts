export interface MessageModel {
  messageId: string; // uuid pk
  channelId: string; // 해당 메시지가 종속되어있는 채널(채팅방) PK ID
  content: string; // 메시지 내용
  sendDate: string; // 메시지 작성일시
  isEdited: boolean; // 수정 여부
  isDeleted: boolean; // 삭제 여부
  parentMessageId: string; // 이 자리에 uuid 값이 존재할 경우 그 메시지에 대한 답장이 됨
  profileId: number; // uuid 작성자 프로필 uuid
  fileUrl: string;
  
  // nickName: string; // 작성자 닉네임
  // fileId: string; // uuid
}

// Strict Type Model
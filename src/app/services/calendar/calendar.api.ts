import { EventModel } from "@/app/models/event.model";
import { AttendeeModel } from "@/app/models/attendee.model";
import { serverCAxios } from "../axiosInstance";

export const CalendarService ={

  //<참가자 관련>

  // POST /api/attendees
  createAttendee: async (attendee: AttendeeModel): Promise<AttendeeModel> => {
    const response = await serverCAxios.post<AttendeeModel>('/attendees', attendee);
    return response.data;
  },

  // 참가자 상태 수정 
  //PUT /api/attendees/{attendeeId}/{eventId}/{profileId}
  updateAttendee: async (attendeeId: number, eventId: number, profileId: number, data: AttendeeModel): Promise<AttendeeModel> => {
    const response = await serverCAxios.put<AttendeeModel>(`/attendees/${attendeeId}/${eventId}/${profileId}`, data);
    return response.data;
  },

  // 특정 참가자 조회 (byID) 
  //GET /api/attendees/{attendeeId}
  getAttendeeById: async (attendeeId: number): Promise<AttendeeModel> => {
    const response = await serverCAxios.get<AttendeeModel>(`/attendees/${attendeeId}}`);
    return response.data;
  },

  // 참가자 삭제 (by ID) 
  //Delete /api/attendees/{attendeeId}
  deleteAttendee: async (attendeeId: number): Promise<void> => {
    await serverCAxios.delete(`/attendees/${attendeeId}`);
  },

  // 특정 이벤트에 대한 참가자 목록 조회
  //GET /api/attendees/events/{eventId}
  getEventAttendees: async (eventId: number): Promise<AttendeeModel[]> => {
    const response = await serverCAxios.get<AttendeeModel[]>('/attendees/events/${eventId}');
    return response.data;
  },

  // 특정 이벤트에 대한 참가자 수 조회 
  //GET /api/attendees/events/{eventId}/count
  countEventAttendees: async (eventId: number): Promise<number> => {
    const response = await serverCAxios.get<number>(`/attendees/events/${eventId}/count`);
    return response.data;
  },

  // 특정 참가자의 일정 목록 조회 
  //GET /api/attendees/{profileId}/events
  getAttendeeEvents: async (profileId: number): Promise<EventModel[]> => {
    const response = await serverCAxios.get<EventModel[]>(`/attendees/${profileId}/events`);
    return response.data;
  },

  // 모든 참가자 목록 조회 
  //GET /api/attendees/list
  getAllAttendees: async (): Promise<AttendeeModel[]> => {
    const response = await serverCAxios.get<AttendeeModel[]>('/attendees/list');
    return response.data;
  },

  // <일정 관련>

  // 이벤트 생성 
  //POST /api/events
  createEvent: async (data: EventModel): Promise<EventModel> => {
    const response = await serverCAxios.post<EventModel>('/events', data);
    return response.data;
  },

  // 이벤트 ID로 조회  
  //GET /api/events/{eventId}
  getEventById: async (eventId: number): Promise<EventModel> => {
    const response = await serverCAxios.get<EventModel>(`/events/${eventId}`);
    return response.data;
  },

  // 이벤트 수정
  //PUT /api/events/{eventId}
  updateEvent: async (eventId: number, data: EventModel): Promise<EventModel> => {
    const response = await serverCAxios.put<EventModel>(`/events/${eventId}`, data);
    return response.data;
  },

  // 이벤트 삭제
  //DELETE /api/events/{eventId}
  deleteEvent: async (eventId: number): Promise<void> => {
    await serverCAxios.delete(`/events/${eventId}`);
  },

  // 이벤트 존재 여부 확인
  //GET /api/events/{eventId}/exists
  existsEvent: async (eventId: number): Promise<boolean> => {
    const response = await serverCAxios.get<boolean>(`/events/${eventId}/exists`);
    return response.data;
  },

  // 전체 이벤트 수 조회
  //GET /api/events/count
  countEvent: async (): Promise<number> => {
    const response = await serverCAxios.get<number>('/events/count');
    return response.data;
  }
};

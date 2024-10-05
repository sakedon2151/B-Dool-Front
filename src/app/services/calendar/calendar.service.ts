import { EventModel } from "@/app/models/event.model";
import { AttendeeModel } from "@/app/models/attendee.model";
import { serverCAxios } from "../../utils/axiosInstance";

const ATTENDEES_URL = '/attendees';
const EVENTS_URL = '/events';

export const calendarService = {
  createAttendee: (attendee: AttendeeModel) => 
    serverCAxios.post<AttendeeModel>(ATTENDEES_URL, attendee)
      .then(response => response.data),

  updateAttendee: (attendeeId: number, eventId: number, profileId: number, data: AttendeeModel) => 
    serverCAxios.put<AttendeeModel>(`${ATTENDEES_URL}/${attendeeId}/${eventId}/${profileId}`, data)
      .then(response => response.data),

  getAttendeeById: (attendeeId: number) => 
    serverCAxios.get<AttendeeModel>(`${ATTENDEES_URL}/${attendeeId}`)
      .then(response => response.data),

  deleteAttendee: (attendeeId: number) => 
    serverCAxios.delete(`${ATTENDEES_URL}/${attendeeId}`),

  getEventAttendees: (eventId: number) => 
    serverCAxios.get<AttendeeModel[]>(`${ATTENDEES_URL}/events/${eventId}`)
      .then(response => response.data),

  countEventAttendees: (eventId: number) => 
    serverCAxios.get<number>(`${ATTENDEES_URL}/events/${eventId}/count`)
      .then(response => response.data),

  getAttendeeEvents: (profileId: number) => 
    serverCAxios.get<EventModel[]>(`${ATTENDEES_URL}/${profileId}/events`)
      .then(response => response.data),

  getAllAttendees: () => 
    serverCAxios.get<AttendeeModel[]>(`${ATTENDEES_URL}/list`)
      .then(response => response.data),

  createEvent: (data: EventModel) => 
    serverCAxios.post<EventModel>(EVENTS_URL, data)
      .then(response => response.data),

  getEventById: (eventId: number) => 
    serverCAxios.get<EventModel>(`${EVENTS_URL}/${eventId}`)
      .then(response => response.data),

  updateEvent: (eventId: number, data: EventModel) => 
    serverCAxios.put<EventModel>(`${EVENTS_URL}/${eventId}`, data)
      .then(response => response.data),

  deleteEvent: (eventId: number) => 
    serverCAxios.delete(`${EVENTS_URL}/${eventId}`),

  existsEvent: (eventId: number) => 
    serverCAxios.get<boolean>(`${EVENTS_URL}/${eventId}/exists`)
      .then(response => response.data),

  countEvent: () => 
    serverCAxios.get<number>(`${EVENTS_URL}/count`)
      .then(response => response.data)
};
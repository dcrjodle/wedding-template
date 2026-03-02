alter table rsvp drop column if exists email;
alter table rsvp drop column if exists wants_speech;
alter table rsvp add column if not exists memory text;

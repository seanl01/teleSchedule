## Tele-schedule

As part of a school extracurricular group, I was tasked to send a regular message every week. The content of the message was always
pretty much the same, and it annoyed me that I could not automate sending a regularly scheduled message. Telegram had scheduled messages
but only for ad-hoc use cases where you wanted to schedule a single messsage a certain time from now. They did not have the idea
of recurring messages at a regular weekly cadence.

Introducing Tele-schedule: a telegram bot to resolve this simple problem. It uses a job scheduler to allow users to define messages
that they want to send weekly at a given time.

### Usage (currently offline)
![walkthrough](images/1205.gif)

It's very simple:
1. Add teleSchedule to any group or a group with just yourself in it `@tele_weekly_bot`
1. Type `/start`
1. Follow the guiding questions to create your weekly recurring message!

- To cancel a job you are currently making: send `/stop`
- To remove the existing weekly messsage you defined, send `/remove`

### Running it yourself
- Run `docker compose up`
- Create a `.env` file in the root directory with the following contents:

```
TELE_KEY=<your_telegram_bot_key>
TIMEZONE=<your_timezone>
```

### Technologies used:
- Docker Compose
- BullMQ for defining repeatable jobs, and enqueueing jobs for worker.
- Redis for underlying storage backend for BullMQ
- Node.js and Typescript for business logic
- `node-telegram-bot-api` for node bindings of the Telegram bot API

### Roadmap (future features)
1. Implementing dynamic timezones for international users. Currently serves users in Toronto
1. Allowing users to create more than one scheduled message per chat group
1. Allowing users to view and edit multiple messages
1. Allowing users to use template variables inside the message e.g. interpolating the current date using the template `{{now}}`.

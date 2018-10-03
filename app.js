import moment from 'moment-timezone'
import {RTMClient, WebClient} from '@slack/client'
import users from './Users'


const fs = require('fs')
// An access token (from your Slack app or custom integration - usually xoxb)
const token = 'xoxp-3987231140-185886630033-447777010515-4a99ed1b25fae24d2a0e845d31064f2c'

// Initialize the clients
const rtm = new RTMClient(token);
const web = new WebClient(token);
rtm.start({
  batch_presence_aware: true,
});

// Inform the platform which users presence we want events for
Object.keys(users).forEach((userId) => {
  fs.writeFileSync(`./users/${users[userId]}.log`, 'START OF THE FILE');
})

rtm.subscribePresence(Object.keys(users));

// See: https://api.slack.com/events/presence_change
rtm.on('presence_change', (event) => {
  if (event && !event.users) {
    fs.appendFile(`./users/${users[event.user]}.log`,
      `\n User : ${users[event.user]}, Presence: ${event.presence.toUpperCase()} and time: ${moment().tz('America/Chicago').format('MMMM Do YYYY, h:mm:ss a')}`,
      (err) => {
        if (err) {
          console.log('ERROR APPENDING TO FILE', err)
        }

      })
  }

});

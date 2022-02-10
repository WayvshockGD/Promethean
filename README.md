![Promethean-Banner-Transparent](https://user-images.githubusercontent.com/61085765/153244242-a0c5a77b-ad1e-4422-9760-d657e1e2fcf4.png)

# Getting started 
Since this library is not finished, you will have to build it yourself.

```bash
tsc --build
```
**Typings not included**

### Examples of usage
```ts
// One import is avalible for now
import { Client } from "promethean";

let client = new Client("TOKEN")
    .setOptions({ intents: [] }); // Yes you will have to do this
    
client.on("message_create", (message) => {
       if (message.content.startsWith("!hi") {
           message.channel.createContent("Sir this is a wendy's"); // Embeds and components are not avalible just yet either
       }
});
```
# Support

If you are having a hard time with the library [join the server](https://discord.gg/rdJyVZhedg) and head to `#support`

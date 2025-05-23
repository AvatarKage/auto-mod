A new and nearly unbreakable auto-moderation module. Please note this is still the works and currently under-going testing by a lot of individuals. Only a selected limited amount of words are currently public.

- You can test it live here -> https://avatarka.ge/automod

I am a professional content moderator and I have created this to help people have more control over the content that reaches their applications. I'm far from a stranger when it comes to keeping safety a number one priority. If this is any helpful to you, please consider donating to me on [Ko-fi](https://ko-fi.com/avatarkage)!

If you have any feedback or bug reports, please reachout on my [Discord server](https://avatarka.ge/discord).

```js
import autoMod from '@avatarkage1052/automod';

function checkMessage(value) {
    const blocked = autoMod(value)

    if (blocked) {
        console.log(blocked.data);
        return blocked.data
    } else {
        console.log("Content is not blocked and nothing happened!");
    }
}

checkMessage(`your message here`)
```

JSON ARRAY RETURN
```json
[
  {
    "text": "This is a bad <mark>w0rd</mark>.",
    "word": "(w|b)ord(?s|ed|ing)",
    "filter": "{'name':'Experimental','severity':'Low','message':'This word has been limited to experimental accounts','bypass':'Username'}",
    "source": "Message"
  }
]
```
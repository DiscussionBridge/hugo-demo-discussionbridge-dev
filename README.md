# DiscussionBridge Hugo Demo

Source for the [public Hugo demo](https://hugo.demo.discussionbridge.dev/).
This repository builds the Hugo site, prepares its DiscussionBridge
publication and discussion data, and configures its Cloudflare Worker.

The source pins the vendored package
`packages/hugo-discussion-bridge-0.2.0-alpha.20.tgz`. The
[Hugo adapter repository](https://github.com/DiscussionBridge/hugo-discussion-bridge) lists the V4 Alpha source tag.

## Local commands

```sh
npm ci
npm test
npm run build:preview
```

Use `npm run build` for the connected build with authorized publication
configuration. It synchronizes publications, generates the Hugo manifest, and
prepares DiscussionBridge data before rendering the site. Use
`npm run deploy:dry-run` to inspect the Worker package.

[Demo chooser](https://demo.discussionbridge.dev/)

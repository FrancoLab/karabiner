import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, rectangle, yabai } from "./utils";

const rules: KarabinerRules[] = [
  // Define the Hyper key itself
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
    manipulators: [
      {
        description: "Caps Lock -> Hyper Key",
        from: {
          key_code: "caps_lock",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            set_variable: {
              name: "hyper",
              value: 1,
            },
          },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0,
            },
          },
        ],
        to_if_alone: [
          {
            key_code: "escape",
          },
        ],
        type: "basic",
      },
      //      {
      //        type: "basic",
      //        description: "Disable CMD + Tab to force Hyper Key usage",
      //        from: {
      //          key_code: "tab",
      //          modifiers: {
      //            mandatory: ["left_command"],
      //          },
      //        },
      //        to: [
      //          {
      //            key_code: "tab",
      //          },
      //        ],
      //      },
    ],
  },
  ...createHyperSubLayers({
    // quick actions
    spacebar: {
      a: open("raycast://extensions/appest/ticktick/inbox"),
      s: open("raycast://extensions/appest/ticktick/create"),
      d: open("raycast://extensions/sven/microsoft-teams/setPresence"),
      f: open("raycast://extensions/sven/microsoft-teams/findChat"),
      q: open("raycast://extensions/raycast/system/lock-screen"),
      c: open(
        "raycast://extensions/raycast/clipboard-history/clipboard-history"
      ),
    },

    // b = "Browser" applications
    b: {
      t: open("https://twitter.com"),
      f: open("https://figma.com"),
      y: open("https://youtube.com"),
      r: open("https://reddit.com"),
      c: open("https://calendar.google.com"),
      g: open("https://github.com"),
      n: open("https://app.clickup.com/37310131/home"),
      l: open("https://www.libgen.is/"),
      a: open("https://ui.shadcn.com/docs/components/accordion"),
      s: open("https://ui.shadcn.com/examples/mail"),
      d: open("https://ui.shadcn.com/blocks"),
      e: open(
        "https://srfreports.co.za/reports/social-research-foundation-tracking-poll-national"
      ),
    },
    // o = "Open" applications
    o: {
      1: app("1Password"),
      b: app("Arc"),
      c: app("TickTick"),
      v: app("Visual Studio Code"),
      s: app("Slack"),
      e: app("Mail"),
      n: app("Notion"),
      t: app("Microsoft Teams (work or school)"),
      x: app("Tabby"),
      f: app("Finder"),
      i: app("Messages"),
      p: app("Spotify"),
      w: app("WhatsApp"),
      a: open("raycast://extensions/raycast/raycast-ai/ai-chat"),
      r: open("raycast://extensions/raycast/raycast/store"),
    },

    // Yabai Width Settings
    w: {
      up_arrow: yabai("/opt/homebrew/bin/yabai -m window --resize top:0:-20"),
      down_arrow: yabai(
        "/opt/homebrew/bin/yabai -m window --resize bottom:0:+20"
      ),
      left_arrow: yabai(
        "/opt/homebrew/bin/yabai -m window --resize left:-20:0"
      ),
      right_arrow: yabai(
        "/opt/homebrew/bin/yabai -m window --resize right:+20:0"
      ),

      f: yabai("/opt/homebrew/bin/yabai -m window --toggle zoom-fullscreen"),
      b: yabai("/opt/homebrew/bin/yabai -m space --balance"),
    },
    // Yabai Swap Settings
    s: {
      left_arrow: yabai("/opt/homebrew/bin/yabai -m window --swap west"),
      down_arrow: yabai("/opt/homebrew/bin/yabai -m window --swap south"),
      up_arrow: yabai("/opt/homebrew/bin/yabai -m window --swap north"),
      right_arrow: yabai("/opt/homebrew/bin/yabai -m window --swap east"),
      x: yabai("/opt/homebrew/bin/yabai -m space --mirror x-axis"),
      y: yabai("/opt/homebrew/bin/yabai -m space --mirror y-axis"),
      d: yabai("/opt/homebrew/bin/yabai -m window --minimize"),
    },
    // Yabai Focus Settings
    f: {
      left_arrow: yabai("/opt/homebrew/bin/yabai -m window --focus west"),
      down_arrow: yabai("/opt/homebrew/bin/yabai -m window --focus south"),
      up_arrow: yabai("/opt/homebrew/bin/yabai -m window --focus north"),
      right_arrow: yabai("/opt/homebrew/bin/yabai -m window --focus east"),
    },
    // r = "Raycast"
    r: {
      i: open("raycast://ai-commands/improve-writing-fabric"),
      e: open("raycast://ai-commands/extract-insight"),
      d: open("raycast://ai-commands/explain-docs"),
      l: open("raycast://ai-commands/explain-and-learn"),
      c: open("raycast://ai-commands/create-docs-inline"),
      s: open("raycast://ai-commands/create-detailed-summary"),
      t: open("raycast://ai-commands/docker-commands?arguments=ad5ce1792f35&arguments=connect%20to%20the%20terminal"),
    },
  }),
];

fs.writeFileSync(
  "karabiner.json",
  JSON.stringify(
    {
      global: {
        show_in_menu_bar: false,
      },
      profiles: [
        {
          name: "Default",
          complex_modifications: {
            rules,
          },
        },
      ],
    },
    null,
    2
  )
);

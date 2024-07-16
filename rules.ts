import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, rectangle, yabai } from "./utils";
const yabaiR = "/opt/homebrew/bin/yabai";
const jq = "/opt/homebrew/bin/jq";

const rules: KarabinerRules[] = [
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
    ],
  },
  ...createHyperSubLayers({
    // quick actions
    spacebar: {
      d: open("raycast://extensions/sven/microsoft-teams/setPresence"),
      f: open("raycast://extensions/sven/microsoft-teams/findChat"),
      q: open("raycast://extensions/raycast/system/lock-screen"),
      c: open(
        "raycast://extensions/raycast/clipboard-history/clipboard-history"
      ),
      l: open("raycast://extensions/raycast/system/lock-screen"),
    },

    // b = "Browser" applications
    b: {
      t: open("https://twitter.com"),
      f: open("https://figma.com"),
      y: open("https://youtube.com"),
      r: open("https://reddit.com"),
      c: open("https://calendar.google.com"),
      g: open("https://github.com"),
      n: open("https://app.clickup.com/37310131/v/o/s/55380405"),
      l: open("https://www.libgen.is/"),
      a: open("https://ui.shadcn.com/docs/components/accordion"),
      s: open("https://ui.shadcn.com/examples/mail"),
      d: open("https://ui.shadcn.com/blocks"),
    },
    // o = "Open" applications
    o: {
      1: app("1Password"),
      b: app("Arc"),
      c: app("Microsoft To Do"),
      v: app("Visual Studio Code"),
      s: app("Slack"),
      e: app("Microsoft Outlook"),
      t: app("Microsoft Teams (work or school)"),
      x: app("iTerm"),
      f: app("Finder"),
      i: app("Messages"),
      p: app("Spotify"),
      w: app("Webstorm"),
      g: app("GoLand"),
      a: open("raycast://extensions/raycast/raycast-ai/ai-chat"),
      r: open("raycast://extensions/raycast/raycast/store"),
      d: app("Docker Desktop"),
      q: app("Postico 2"),
      l: open("raycast://script-commands/open-main-desktops"),
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
      // d: yabai("/opt/homebrew/bin/yabai -m window --minimize"),
      d: {
        to: [
          {
            shell_command: `
            # Get the ID of the currently focused window
            current_window_id=$(${yabaiR} -m query --windows --window | ${jq} -r '.id')

            # Minimize the currently focused window
            ${yabaiR} -m window --minimize

            # Get the list of windows
            windows=$(${yabaiR} -m query --windows)

            # Find the next window to focus on
            next_window_id=$(echo "$windows" | ${jq} -r --arg current_window_id "$current_window_id" '
            .[] | select(.id != ($current_window_id | tonumber) and
                        (.["is-visible"] // false) == true and
                        (.["is-minimized"] // false) == false) | .id' | head -n 1)

            # Focus on the next window
            if [ -n "$next_window_id" ]; then
            ${yabaiR} -m window --focus "$next_window_id"
            else
            echo "No next window to focus on."
            fi
`,
          },
        ],
      },
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
      p: open("raycast://script-commands/prune-containers"),
      m: open("raycast://ai-commands/commit-message"),
      t: open("raycast://ai-commands/task-breakdown-bot"),
    },
    // c = "ClickUp"
    c: {
      f: open("https://app.clickup.com/37310131/v/l/5-90121382231-1"),
      p: open("https://app.clickup.com/37310131/v/l/5-90051042713-1"),
      i: open("https://app.clickup.com/37310131/v/o/f/90121300219"),
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

import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, rectangle, yabai } from "./utils";
const yabaiBin = "/opt/homebrew/bin/yabai";
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
      p: open("https://app.clickup.com/37310131/v/g/13jknk-5948"),
      c: open("https://app.clickup.com/"),
    },

    // b = "Browser" applications
    b: {
      t: open("https://twitter.com"),
      f: open("https://figma.com"),
      y: open("https://youtube.com"),
      r: open("https://reddit.com"),
      c: open("https://calendar.google.com"),
      g: open("https://github.com/FrancoLab?tab=repositories"),
      n: open("https://app.clickup.com/37310131/v/o/s/55380405"),
      l: open("https://www.libgen.is/"),
      a: open("https://ui.shadcn.com/docs/components/accordion"),
      d: open("https://github.com/orgs/defijn-io/repositories"),
    },
    // o = "Open" applications
    o: {
      1: app("1Password"),
      b: app("Arc"),
      v: app("Visual Studio Code"),
      s: app("Slack"),
      e: app("Microsoft Outlook"),
      t: app("Microsoft Teams (work or school)"),
      x: app("WezTerm"),
      f: app("Finder"),
      i: app("Messages"),
      p: app("Spotify"),
      n: app("Obsidian"),
      a: open("raycast://extensions/raycast/raycast-ai/ai-chat"),
      d: app("Docker Desktop"),
      r: app("Postman"),
      q: app("Postico 2"),
      c: open("raycast://extensions/raycast/raycast/confetti"),
    },

    // Yabai Width Settings
    w: {
      // left align 1/3 of the screen
      h: yabai("/opt/homebrew/bin/yabai -m window --grid 1:4:0:0:2:1"),
      j: yabai("/opt/homebrew/bin/yabai -m window --grid 4:1:0:2:4:2"),
      k: yabai("/opt/homebrew/bin/yabai -m window --grid 4:1:0:0:4:2"),
      l: yabai("/opt/homebrew/bin/yabai -m window --grid 1:4:2:0:2:1"),
      c: yabai("/opt/homebrew/bin/yabai -m window --grid 1:4:1:0:2:1"),
      e: yabai("/opt/homebrew/bin/yabai -m window --grid 1:4:0:0:4:1"),
      f: yabai("/opt/homebrew/bin/yabai -m window --toggle zoom-fullscreen"),
      d: {
        to: [
          {
            shell_command: `
            # Get the ID of the currently focused window
            current_window_id=$(${yabaiBin} -m query --windows --window | ${jq} -r '.id')

            # Minimize the currently focused window
            ${yabaiBin} -m window --minimize

            # Get the list of windows
            windows=$(${yabaiBin} -m query --windows)

            # Find the next window to focus on
            next_window_id=$(echo "$windows" | ${jq} -r --arg current_window_id "$current_window_id" '
            .[] | select(.id != ($current_window_id | tonumber) and
                        (.["is-visible"] // false) == true and
                        (.["is-minimized"] // false) == false) | .id' | head -n 1)

            # Focus on the next window
            if [ -n "$next_window_id" ]; then
            ${yabaiBin} -m window --focus "$next_window_id"
            else
            echo "No next window to focus on."
            fi
`,
          },
        ],
      },
    },
    // Yabai Swap Settings
    s: {
      left_arrow: yabai("/opt/homebrew/bin/yabai -m window --swap west"),
      down_arrow: yabai("/opt/homebrew/bin/yabai -m window --swap south"),
      up_arrow: yabai("/opt/homebrew/bin/yabai -m window --swap north"),
      right_arrow: yabai("/opt/homebrew/bin/yabai -m window --swap east"),
      x: yabai("/opt/homebrew/bin/yabai -m space --mirror x-axis"),
      y: yabai("/opt/homebrew/bin/yabai -m space --mirror y-axis"),
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
      e: open("raycast://ai-commands/create-micro-summary"),
      d: open("raycast://ai-commands/explain-docs"),
      l: open("raycast://ai-commands/explain-and-learn"),
      c: open("raycast://ai-commands/camelcase-converter"),
      s: open("raycast://ai-commands/create-detailed-summary"),
      p: open("raycast://script-commands/prune-containers"),
      m: open("raycast://ai-commands/commit-message"),
      t: open("raycast://ai-commands/task-breakdown-bot"),
      n: open("raycast://ai-commands/vim-expert?arguments={query}"),
    },
    // c = "Command"
    c: {
      n: open("raycast://extensions/KevinBatdorf/obsidian/createNoteCommand"),
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

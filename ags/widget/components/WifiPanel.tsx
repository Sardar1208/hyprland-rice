import { Gtk } from "ags/gtk4"
import { With, Accessor, createBinding, createComputed } from "ags"
// @ts-ignore
import AstalNetwork from "gi://AstalNetwork"

type AP = AstalNetwork.AccessPoint

export default function WifiPanel({
  accessPoints,
}: {
  accessPoints: Accessor<AP[]>
}) {
  const network = AstalNetwork.get_default()
  const wifi = network.wifi

  // ✅ FIXED: always return Accessor<boolean>
  const enabled = createComputed(() => {
    return wifi ? wifi.enabled : false
  })

  return (
    <Gtk.Box orientation={Gtk.Orientation.VERTICAL} spacing={12}>
      {/* 🔹 Toggle Row */}
      <Gtk.Box
        orientation={Gtk.Orientation.HORIZONTAL}
        spacing={12}
        class="toggle-row"
      >
        <Gtk.Label
          label="Use WiFi"
          hexpand
          halign={Gtk.Align.START}
          class="toggle-label"
        />

        <Gtk.Switch
          active={enabled}
          valign={Gtk.Align.CENTER}
          onNotifyActive={(self) => {
            if (wifi) wifi.enabled = self.active
          }}
        />
      </Gtk.Box>

      {/* 🔹 Divider */}
      <Gtk.Separator orientation={Gtk.Orientation.HORIZONTAL} />

      {/* 🔹 WiFi List */}
      <With value={accessPoints}>
        {(aps: AP[]) => (
          <Gtk.Box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
            {aps.length > 0 ? (
              aps.map((ap: AP) => (
                <Gtk.Button
                  onClicked={() => console.log("Connect to", ap.ssid)}
                >
                  <Gtk.Box orientation={Gtk.Orientation.HORIZONTAL} spacing={8}>
                    <Gtk.Image
                      iconName={ap.iconName}
                      pixelSize={20}
                      class="icon"
                    />
                    <Gtk.Label
                      label={ap.ssid || "Unknown Network"}
                      class="list-item-title"
                    />
                  </Gtk.Box>
                </Gtk.Button>
              ))
            ) : (
              <Gtk.Label label="Scanning or No Networks Found..." />
            )}
          </Gtk.Box>
        )}
      </With>
    </Gtk.Box>
  )
}

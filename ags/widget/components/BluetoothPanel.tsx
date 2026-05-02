import { Gtk } from "ags/gtk4"
import { With, Accessor, createBinding } from "ags" // 🔹 Swap createComputed for createBinding
// @ts-ignore
import AstalBluetooth from "gi://AstalBluetooth"

type Device = AstalBluetooth.Device

export default function BluetoothPanel({
  devices,
}: {
  devices: Accessor<Device[]>
}) {
  const bt = AstalBluetooth.get_default()

  // 🔥 THE REAL FIX: This explicitly tells Astal to listen for DBus power changes
  const isPowered = createBinding(bt, "isPowered")

  return (
    <Gtk.Box orientation={Gtk.Orientation.VERTICAL} spacing={12}>
      {/* 🔹 Toggle Row */}
      <Gtk.Box
        orientation={Gtk.Orientation.HORIZONTAL}
        spacing={12}
        class="toggle-row"
      >
        <Gtk.Label
          label="Use Bluetooth"
          hexpand
          halign={Gtk.Align.START}
          class="toggle-label"
        />

        <Gtk.Switch
          active={isPowered} // Bind directly to our reactive state
          valign={Gtk.Align.CENTER}
          onNotifyActive={(self) => {
            const adapter = bt.adapter
            if (!adapter) return

            if (self.active) {
              adapter.set_powered(true)

              // 🔥 FIX 2: Increased to 1000ms. Some Bluetooth hardware (like Intel/Realtek chips)
              // take a full second to actually initialize after receiving the power-on command.
              setTimeout(() => {
                // Fetch a fresh reference to the adapter inside the timeout just in case
                const currentAdapter = AstalBluetooth.get_default().adapter
                if (currentAdapter && !currentAdapter.discovering) {
                  currentAdapter.start_discovery?.()
                }
              }, 1000)
            } else {
              adapter.set_powered(false)
            }
          }}
        />
      </Gtk.Box>

      {/* 🔹 Divider */}
      <Gtk.Separator
        orientation={Gtk.Orientation.HORIZONTAL}
        visible={isPowered} // Now properly reactive!
      />

      {/* 🔹 Device List Wrapper */}
      <Gtk.Box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={8}
        visible={isPowered} // Now properly reactive!
      >
        <With value={devices}>
          {(list: Device[]) => (
            <Gtk.Box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
              {list.length > 0 ? (
                list.map((device: Device) => (
                  <Gtk.Button
                    onClicked={() => {
                      if (device.connected) {
                        device.disconnect_device(() => {})
                      } else {
                        device.connect_device(() => {})
                      }
                    }}
                  >
                    <Gtk.Box
                      orientation={Gtk.Orientation.HORIZONTAL}
                      spacing={8}
                    >
                      <Gtk.Image
                        iconName={device.iconName || "bluetooth-symbolic"}
                        pixelSize={20}
                        class="icon"
                      />

                      <Gtk.Label
                        label={device.name || "Unknown Device"}
                        class="list-item-title"
                      />

                      <Gtk.Box hexpand />

                      <Gtk.Label
                        label={device.connected ? "Connected" : "Disconnected"}
                      />
                    </Gtk.Box>
                  </Gtk.Button>
                ))
              ) : (
                <Gtk.Label
                  label="Scanning for devices..."
                  class="toggle-label"
                />
              )}
            </Gtk.Box>
          )}
        </With>
      </Gtk.Box>
    </Gtk.Box>
  )
}

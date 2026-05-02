import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createState, createComputed, With } from "ags"

import QuickSettingItem from "./components/QuickSettingItem"
import WifiPanel from "./components/WifiPanel"
import BluetoothPanel from "./components/BluetoothPanel"

import { useNetwork } from "./hooks/useNetwork"
import { useBluetooth } from "./hooks/useBluetooth"

// @ts-ignore
import AstalBluetooth from "gi://AstalBluetooth"
// @ts-ignore
import AstalNetwork from "gi://AstalNetwork"

export default function QuickSettings(gdkmonitor: Gdk.Monitor) {
  const { TOP, RIGHT } = Astal.WindowAnchor

  const { ssid, icon: wifiIcon, accessPoints } = useNetwork()
  const { devices, icon: btIcon } = useBluetooth()

  const [activePanel, setActivePanel] = createState<
    "wifi" | "bluetooth" | null
  >(null)

  const toggle = (panel: "wifi" | "bluetooth") => {
    setActivePanel((prev) => {
      const next = prev === panel ? null : panel

      const bt = AstalBluetooth.get_default()
      const wifi = AstalNetwork.get_default().wifi

      // 🔥 FIX: Check both power AND discovering state
      if (next === "bluetooth") {
        if (bt.isPowered && !bt.adapter?.discovering) {
          bt.adapter?.start_discovery?.()
        }
      }

      if (prev === "bluetooth" && next === null) {
        if (bt.isPowered && bt.adapter?.discovering) {
          bt.adapter?.stop_discovery?.()
        }
      }

      // 🔥 WiFi scan
      if (next === "wifi") {
        wifi?.scan?.()
      }

      return next
    })
  }

  return (
    <Astal.Window
      anchor={RIGHT | TOP}
      gdkmonitor={gdkmonitor}
      visible
      halign={Gtk.Align.END}
      valign={Gtk.Align.START}
      marginRight={20}
      marginTop={10}
    >
      <Gtk.Box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={16}
        class="settings-box"
      >
        {/* 🔹 Top Row */}
        <Gtk.Box orientation={Gtk.Orientation.HORIZONTAL} spacing={12}>
          <QuickSettingItem
            icon={wifiIcon}
            title="WiFi"
            subtitle={createComputed(() => ssid() || "Disconnected")}
            onClick={() => toggle("wifi")}
          />

          <QuickSettingItem
            icon={btIcon}
            title="Bluetooth"
            subtitle="Devices"
            onClick={() => toggle("bluetooth")}
          />
        </Gtk.Box>

        {/* 🔽 Panels */}
        <With value={activePanel}>
          {(panel) => {
            if (panel === "wifi") {
              return <WifiPanel accessPoints={accessPoints} />
            }

            if (panel === "bluetooth") {
              return <BluetoothPanel devices={devices} />
            }

            return null
          }}
        </With>
      </Gtk.Box>
    </Astal.Window>
  )
}

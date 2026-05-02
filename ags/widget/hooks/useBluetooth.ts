import { createBinding, createComputed } from "ags"
// @ts-ignore
import AstalBluetooth from "gi://AstalBluetooth"

export function useBluetooth() {
  const bt = AstalBluetooth.get_default()

  const devices = createBinding(bt, "devices")
  const isPowered = createBinding(bt, "isPowered")

  const icon = createComputed(() =>
    isPowered() ? "bluetooth-active-symbolic" : "bluetooth-disabled-symbolic",
  )

  return { devices, isPowered, icon }
}

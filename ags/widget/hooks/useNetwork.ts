import { createBinding, createComputed } from "ags"
// @ts-ignore
import Network from "gi://AstalNetwork"

export function useNetwork() {
  const network = Network.get_default()

  const wifi = network.wifi

  const ssid = wifi
    ? createBinding(wifi, "ssid")
    : createComputed(() => "No Wi-Fi")

  const icon = wifi
    ? createBinding(wifi, "iconName")
    : createComputed(() => "network-wireless-offline-symbolic")

  const accessPoints = wifi
    ? createBinding(wifi, "accessPoints")
    : createComputed(() => [])

  return { ssid, icon, accessPoints }
}

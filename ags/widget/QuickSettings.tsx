import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"

export default function QuickSettings(gdkmonitor: Gdk.Monitor) {
  const { TOP, BOTTOM, RIGHT } = Astal.WindowAnchor

  return (
  <Astal.Window anchor={RIGHT | TOP} gdkmonitor={gdkmonitor} visible={true} halign={Gtk.Align.END} valign={Gtk.Align.START} marginRight={20} marginTop={10}>
	  <Gtk.Box orientation={Gtk.Orientation.VERTICAL} spacing={16} vexpand={false} class="settings-box">
          	<Gtk.Box spacing={10} orientation={Gtk.Orientation.HORIZONTAL} widthRequest={200}>
	   		<Gtk.Image iconName={"network-wireless-offline-symbolic"} class="icon" pixelSize={30} />	
	  		<Gtk.Box orientation={Gtk.Orientation.VERTICAL} halign={Gtk.Align.END} >
				<Gtk.Label label="WiFi" class="quick-setting-title" halign={Gtk.Align.START} />
				<Gtk.Label label="Offline" class="quick-setting-subtitle"/>
			</Gtk.Box>	
			<Gtk.Box orientation={Gtk.Orientation.HORIZONTAL} hexpand={true} halign={Gtk.Align.START} />
			<Gtk.Image iconName={"pan-end-symbolic"} class={"icon"} pixelSize={14} />
          	</Gtk.Box>
	  </Gtk.Box>
  </Astal.Window>	
  )
}

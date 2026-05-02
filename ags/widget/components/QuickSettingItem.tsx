import { Gtk } from "ags/gtk4"
import { type Accessor } from "ags"

type Prop<T> = T | Accessor<T>

export default function QuickSettingItem({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: Prop<string>
  title: Prop<string>
  subtitle: Prop<string>
  onClick: () => void
}) {
  return (
    <Gtk.Button onClicked={onClick}>
      <Gtk.Box
        spacing={9}
        orientation={Gtk.Orientation.HORIZONTAL}
        widthRequest={200}
      >
        <Gtk.Image iconName={icon} class="icon" pixelSize={30} />

        <Gtk.Box orientation={Gtk.Orientation.VERTICAL} halign={Gtk.Align.END}>
          <Gtk.Label
            label={title}
            class="quick-setting-title"
            halign={Gtk.Align.START}
          />
          <Gtk.Label label={subtitle} class="quick-setting-subtitle" />
        </Gtk.Box>

        <Gtk.Box hexpand={true} />

        <Gtk.Image iconName="pan-end-symbolic" class="icon" pixelSize={14} />
      </Gtk.Box>
    </Gtk.Button>
  )
}

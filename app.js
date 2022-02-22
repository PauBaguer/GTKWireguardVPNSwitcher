imports.gi.versions.Gtk = "3.0";
const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;

let app = new Gtk.Application({ application_id: "org.gtk.ExampleApp" });

app.connect("activate", () => {
  let win = new Gtk.ApplicationWindow({
    application: app,
    title: "Wireguard Switch",
    defaultHeight: 200,
    defaultWidth: 400,
  });
  let label = new Gtk.Label({ label: "Wireguard conection switch" });
  let btn = new Gtk.Switch();
  btn.valign = Gtk.Align.CENTER;
  btn.halign = Gtk.Align.CENTER;
  try {
    let [, stdout, stderr, status] = GLib.spawn_command_line_sync(
      "cat /sys/class/net/wg0/operstate"
    );
    //WG is up
    if (status === 0) {
      log("its 0");
      btn.set_active(true);
      //WG is down
    } else {
      btn.set_active(false);
      log(`its ${status}`);
    }

    // The process must have started because it didn't throw an error, but did
    // it actually succeed? By the way, where's my output?
  } catch (e) {
    logError(e);
  }

  btn.connect("state-set", (btn, state, user_data) => {
    log(state);
    if (state) {
      GLib.spawn_command_line_async("pkexec wg-quick up wg0");
    } else {
      GLib.spawn_command_line_async("pkexec wg-quick down wg0");
    }
  });
  //win.add(label);
  win.add(btn);
  win.show_all();
});

app.run([]);

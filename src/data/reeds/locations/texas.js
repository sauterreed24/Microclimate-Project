import { us } from "./helpers.js";

const T = (id, label, q, region, lat, lng, tags) =>
  us({ id, label, q, state: "TX", region, lat, lng, flag: "🤠", tags: tags || [], notes: "" });

export const WEST_TEXAS = [
  T("el-paso-tx", "El Paso, TX", "El Paso, TX", "West Texas", 31.7619, -106.485, ["border", "metro"]),
  T("socorro-tx", "Socorro, TX", "Socorro, TX", "West Texas", 31.6547, -106.3036, []),
  T("anthony-tx", "Anthony, TX", "Anthony, TX", "West Texas", 31.9993, -106.6055, []),
  T("sierra-blanca-tx", "Sierra Blanca, TX", "Sierra Blanca, TX", "West Texas", 31.1701, -105.3574, []),
  T("van-horn-tx", "Van Horn, TX", "Van Horn, TX", "West Texas", 31.0393, -104.8307, []),
  T("marfa-tx", "Marfa, TX", "Marfa, TX", "West Texas", 30.3949, -104.0208, ["arts"]),
  T("alpine-tx", "Alpine, TX", "Alpine, TX", "West Texas", 30.3585, -103.661, []),
  T("fort-davis-tx", "Fort Davis, TX", "Fort Davis, TX", "West Texas", 30.5885, -103.8941, []),
  T("presidio-tx", "Presidio, TX", "Presidio, TX", "West Texas", 29.5608, -104.3721, ["border"]),
  T("pecos-tx", "Pecos, TX", "Pecos, TX", "West Texas", 31.4229, -103.4932, []),
  T("midland-tx", "Midland, TX", "Midland, TX", "West Texas", 31.9974, -102.0779, ["permian"]),
  T("odessa-tx", "Odessa, TX", "Odessa, TX", "West Texas", 31.8457, -102.3676, []),
  T("big-spring-tx", "Big Spring, TX", "Big Spring, TX", "West Texas", 32.2504, -101.4787, []),
  T("san-angelo-tx", "San Angelo, TX", "San Angelo, TX", "West Texas", 31.4638, -100.437, []),
  T("del-rio-tx", "Del Rio, TX", "Del Rio, TX", "West Texas", 29.3709, -100.8959, []),
  T("eagle-pass-tx", "Eagle Pass, TX", "Eagle Pass, TX", "West Texas", 28.7091, -100.4995, []),
  T("laredo-tx", "Laredo, TX", "Laredo, TX", "West Texas", 27.5036, -99.5075, ["border"]),
  T("uvalde-tx", "Uvalde, TX", "Uvalde, TX", "West Texas", 29.2097, -99.7862, []),
  T("kerrville-tx", "Kerrville, TX", "Kerrville, TX", "West Texas", 30.0474, -99.1403, ["hill-country"]),
];

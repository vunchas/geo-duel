const ISO2: Record<string, string> = {
  CAN: "ca", USA: "us", MEX: "mx", PAN: "pa", VEN: "ve", COL: "co", BRA: "br",
  ECU: "ec", PER: "pe", CHL: "cl", ARG: "ar", EGY: "eg", LBY: "ly", TUN: "tn",
  DZA: "dz", MAR: "ma", NGA: "ng", ETH: "et", COD: "cd", ZAF: "za", MDG: "mg",
  AUS: "au", NZL: "nz", IDN: "id", MYS: "my", SGP: "sg", THA: "th", JPN: "jp",
  KOR: "kr", CHN: "cn", MNG: "mn", BGD: "bd", IND: "in", PAK: "pk", KAZ: "kz",
  TKM: "tm", IRN: "ir", SAU: "sa", IRQ: "iq", TUR: "tr", ISR: "il", CYP: "cy",
  RUS: "ru", UKR: "ua", BLR: "by", MDA: "md", ISL: "is", NOR: "no", SWE: "se",
  FIN: "fi", DNK: "dk", EST: "ee", LVA: "lv", POL: "pl", DEU: "de", CZE: "cz",
  SVK: "sk", HUN: "hu", AUT: "at", LIE: "li", CHE: "ch", ROU: "ro", BGR: "bg",
  SVN: "si", HRV: "hr", BIH: "ba", MNE: "me", SRB: "rs", XKX: "xk", GRC: "gr",
  MLT: "mt", ITA: "it", VAT: "va", SMR: "sm", ESP: "es", PRT: "pt", AND: "ad",
  MCO: "mc", FRA: "fr", BEL: "be", NLD: "nl", LUX: "lu", GBR: "gb", IRL: "ie",
  MKD: "mk", ALB: "al",
};

export function countryShapeUrl(isoA3?: string) {
  const iso2 = isoA3 ? ISO2[isoA3] : undefined;
  return iso2
    ? `https://cdn.jsdelivr.net/gh/djaiss/mapsicon@master/all/${iso2}/vector.svg`
    : undefined;
}

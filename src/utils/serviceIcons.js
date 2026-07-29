import {
  Sparkles, Shield, Truck, Clock, Award, ShieldCheck, BadgeCheck, Handshake, Headphones, Star, Zap, CheckCircle,
} from "lucide-react";

export const SERVICE_ICON_MAP = {
  Sparkles, Shield, Truck, Clock, Award, ShieldCheck, BadgeCheck, Handshake, Headphones, Star, Zap, CheckCircle,
};

export const SERVICE_ICON_OPTIONS = Object.keys(SERVICE_ICON_MAP);

export function getServiceIcon(name) {
  return SERVICE_ICON_MAP[name] || Sparkles;
}

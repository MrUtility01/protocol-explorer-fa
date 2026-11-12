export type Packet = {
  id: number;
  time: string;
  source: string;
  destination: string;
  protocol: string;
  info: string;
  size: string;
  color: string;
};

export type ProtocolStep = {
  id: number;
  title: string;
  description: string;
};

export type Protocol = {
  id: string;
  name: string;
  nameFa: string;
  shortDesc: string;
  layer: string;
  port: string;
  transport: string;
  dataFormat: string;
  methods?: string;
  definedIn: string;
  overview: string;
  steps: ProtocolStep[];
  packets: Packet[];
  nodes: { id: string; label: string; ip: string; x: number; y: number }[];
};

export const protocols: Protocol[] = [
  {
    id: "http",
    name: "HTTP",
    nameFa: "پروتکل انتقال ابرمتن",
    shortDesc: "ارتباط وب",
    layer: "لایه کاربرد (لایه ۷)",
    port: "۸۰ (HTTPS: ۴۴۳)",
    transport: "TCP",
    dataFormat: "متن (هدر + بدنه اختیاری)",
    methods: "GET, POST, PUT, DELETE, HEAD",
    definedIn: "RFC 9110, RFC 9112",
    overview:
      "HTTP پروتکل وب است: کلاینت یک منبع مثل صفحه HTML درخواست می‌کند و سرور با کد وضعیت، هدرها و معمولاً بدنه پاسخ می‌دهد. هر تبادل شامل یک درخواست و یک پاسخ است که در HTTP/1.1 به صورت متن خوانا نوشته می‌شود.",
    steps: [
      { id: 1, title: "درخواست کلاینت", description: "مرورگر درخواست را آماده می‌کند" },
      { id: 2, title: "رزولوشن DNS", description: "آدرس IP سرور پیدا می‌شود" },
      { id: 3, title: "اتصال TCP", description: "یک لینک قابل‌اطمینان برقرار می‌شود" },
      { id: 4, title: "تبادل HTTP", description: "پیام‌های درخواست و پاسخ" },
      { id: 5, title: "رندر صفحه", description: "مرورگر محتوا را نمایش می‌دهد" },
    ],
    packets: [
      { id: 1, time: "0.000s", source: "192.168.1.10", destination: "8.8.8.8", protocol: "DNS", info: "Standard query A www.example.com", size: "75 B", color: "bg-blue-500" },
      { id: 2, time: "0.012s", source: "8.8.8.8", destination: "192.168.1.10", protocol: "DNS", info: "Standard query response A 203.0.113.10", size: "91 B", color: "bg-blue-500" },
      { id: 3, time: "0.024s", source: "192.168.1.10", destination: "203.0.113.10", protocol: "TCP", info: "52344 → 80 [SYN] Seq=0", size: "66 B", color: "bg-green-500" },
      { id: 4, time: "0.041s", source: "203.0.113.10", destination: "192.168.1.10", protocol: "TCP", info: "80 → 52344 [SYN, ACK] Seq=0 Ack=1", size: "66 B", color: "bg-green-500" },
      { id: 5, time: "0.058s", source: "192.168.1.10", destination: "203.0.113.10", protocol: "TCP", info: "52344 → 80 [ACK] Seq=1 Ack=1", size: "60 B", color: "bg-green-500" },
      { id: 6, time: "0.058s", source: "192.168.1.10", destination: "203.0.113.10", protocol: "HTTP", info: "GET / HTTP/1.1", size: "484 B", color: "bg-yellow-500" },
      { id: 7, time: "0.076s", source: "203.0.113.10", destination: "192.168.1.10", protocol: "HTTP", info: "HTTP/1.1 200 OK (text/html)", size: "12.8 KB", color: "bg-purple-500" },
    ],
    nodes: [
      { id: "client", label: "کلاینت", ip: "192.168.1.10", x: 80, y: 220 },
      { id: "router", label: "روتر", ip: "192.168.1.1", x: 280, y: 220 },
      { id: "dns", label: "DNS Resolver", ip: "8.8.8.8", x: 480, y: 100 },
      { id: "server", label: "وب‌سرور", ip: "203.0.113.10", x: 480, y: 340 },
    ],
  },
  {
    id: "dns",
    name: "DNS",
    nameFa: "سیستم نام دامنه",
    shortDesc: "تبدیل نام به IP",
    layer: "لایه کاربرد (لایه ۷)",
    port: "۵۳",
    transport: "UDP / TCP",
    dataFormat: "دودویی",
    definedIn: "RFC 1034, RFC 1035",
    overview:
      "DNS سیستم نام‌گذاری سلسله‌مراتبی اینترنت است که نام‌های دامنه خوانا برای انسان را به آدرس‌های IP قابل‌استفاده توسط ماشین ترجمه می‌کند. بدون DNS، مجبور بودید آدرس‌های عددی را حفظ کنید.",
    steps: [
      { id: 1, title: "پرس‌وجوی کلاینت", description: "مرورگر نام دامنه را می‌پرسد" },
      { id: 2, title: "Resolver محلی", description: "درخواست به Resolver ارسال می‌شود" },
      { id: 3, title: "Root Server", description: "مسیر به TLD پیدا می‌شود" },
      { id: 4, title: "TLD Server", description: "سرور Authoritative مشخص می‌شود" },
      { id: 5, title: "پاسخ نهایی", description: "آدرس IP برگردانده می‌شود" },
    ],
    packets: [
      { id: 1, time: "0.000s", source: "192.168.1.10", destination: "8.8.8.8", protocol: "DNS", info: "Standard query A example.com", size: "70 B", color: "bg-blue-500" },
      { id: 2, time: "0.015s", source: "8.8.8.8", destination: "198.41.0.4", protocol: "DNS", info: "Query to Root Server", size: "70 B", color: "bg-blue-500" },
      { id: 3, time: "0.030s", source: "198.41.0.4", destination: "8.8.8.8", protocol: "DNS", info: "Referral to .com TLD", size: "120 B", color: "bg-blue-500" },
      { id: 4, time: "0.045s", source: "8.8.8.8", destination: "192.5.6.30", protocol: "DNS", info: "Query to .com TLD", size: "70 B", color: "bg-blue-500" },
      { id: 5, time: "0.060s", source: "192.5.6.30", destination: "8.8.8.8", protocol: "DNS", info: "Referral to Authoritative", size: "110 B", color: "bg-blue-500" },
      { id: 6, time: "0.080s", source: "8.8.8.8", destination: "192.168.1.10", protocol: "DNS", info: "Response A 93.184.216.34", size: "95 B", color: "bg-green-500" },
    ],
    nodes: [
      { id: "client", label: "کلاینت", ip: "192.168.1.10", x: 80, y: 220 },
      { id: "resolver", label: "Resolver", ip: "8.8.8.8", x: 280, y: 220 },
      { id: "root", label: "Root", ip: "198.41.0.4", x: 480, y: 80 },
      { id: "tld", label: "TLD", ip: "192.5.6.30", x: 480, y: 220 },
      { id: "auth", label: "Authoritative", ip: "93.184.216.34", x: 480, y: 360 },
    ],
  },
  {
    id: "tcp",
    name: "TCP",
    nameFa: "پروتکل کنترل انتقال",
    shortDesc: "انتقال قابل‌اطمینان",
    layer: "لایه انتقال (لایه ۴)",
    port: "—",
    transport: "—",
    dataFormat: "سگمنت",
    definedIn: "RFC 9293",
    overview:
      "TCP پروتکل انتقال قابل‌اطمینان است. با handshake سه‌طرفه اتصال برقرار می‌کند، داده‌ها را به ترتیب و بدون خطا تحویل می‌دهد و کنترل ازدحام دارد. بیشتر ترافیک وب و ایمیل روی TCP است.",
    steps: [
      { id: 1, title: "SYN", description: "کلاینت درخواست اتصال می‌فرستد" },
      { id: 2, title: "SYN-ACK", description: "سرور تأیید و درخواست می‌کند" },
      { id: 3, title: "ACK", description: "کلاینت تأیید نهایی می‌دهد" },
      { id: 4, title: "انتقال داده", description: "داده‌ها با ACK رد و بدل می‌شوند" },
      { id: 5, title: "پایان اتصال", description: "FIN و ACK برای بستن" },
    ],
    packets: [
      { id: 1, time: "0.000s", source: "192.168.1.10", destination: "203.0.113.10", protocol: "TCP", info: "52344 → 80 [SYN] Seq=0", size: "66 B", color: "bg-green-500" },
      { id: 2, time: "0.020s", source: "203.0.113.10", destination: "192.168.1.10", protocol: "TCP", info: "80 → 52344 [SYN, ACK] Seq=0 Ack=1", size: "66 B", color: "bg-green-500" },
      { id: 3, time: "0.040s", source: "192.168.1.10", destination: "203.0.113.10", protocol: "TCP", info: "52344 → 80 [ACK] Seq=1 Ack=1", size: "60 B", color: "bg-green-500" },
      { id: 4, time: "0.050s", source: "192.168.1.10", destination: "203.0.113.10", protocol: "TCP", info: "PSH, ACK - Data", size: "500 B", color: "bg-yellow-500" },
      { id: 5, time: "0.070s", source: "203.0.113.10", destination: "192.168.1.10", protocol: "TCP", info: "ACK - Data received", size: "60 B", color: "bg-green-500" },
    ],
    nodes: [
      { id: "client", label: "کلاینت", ip: "192.168.1.10", x: 120, y: 220 },
      { id: "server", label: "سرور", ip: "203.0.113.10", x: 480, y: 220 },
    ],
  },
  {
    id: "https",
    name: "HTTPS",
    nameFa: "HTTP امن",
    shortDesc: "ارتباط رمزنگاری‌شده",
    layer: "لایه کاربرد + امنیت",
    port: "۴۴۳",
    transport: "TCP + TLS",
    dataFormat: "رمزشده",
    definedIn: "RFC 9110 + TLS 1.3",
    overview:
      "HTTPS همان HTTP است که روی TLS اجرا می‌شود. ارتباط رمزنگاری می‌شود، هویت سرور با گواهینامه تأیید می‌گردد و یکپارچگی داده‌ها تضمین می‌شود. امروزه استاندارد اصلی وب است.",
    steps: [
      { id: 1, title: "اتصال TCP", description: "handshake اولیه TCP" },
      { id: 2, title: "ClientHello", description: "شروع TLS" },
      { id: 3, title: "ServerHello + Certificate", description: "سرور گواهینامه می‌فرستد" },
      { id: 4, title: "Key Exchange", description: "کلیدهای نشست توافق می‌شود" },
      { id: 5, title: "HTTP رمزشده", description: "درخواست و پاسخ امن" },
    ],
    packets: [
      { id: 1, time: "0.000s", source: "192.168.1.10", destination: "203.0.113.10", protocol: "TCP", info: "[SYN]", size: "66 B", color: "bg-green-500" },
      { id: 2, time: "0.015s", source: "203.0.113.10", destination: "192.168.1.10", protocol: "TCP", info: "[SYN, ACK]", size: "66 B", color: "bg-green-500" },
      { id: 3, time: "0.030s", source: "192.168.1.10", destination: "203.0.113.10", protocol: "TLS", info: "ClientHello", size: "250 B", color: "bg-orange-500" },
      { id: 4, time: "0.050s", source: "203.0.113.10", destination: "192.168.1.10", protocol: "TLS", info: "ServerHello, Certificate", size: "1200 B", color: "bg-orange-500" },
      { id: 5, time: "0.080s", source: "192.168.1.10", destination: "203.0.113.10", protocol: "TLS", info: "Finished", size: "80 B", color: "bg-orange-500" },
      { id: 6, time: "0.100s", source: "192.168.1.10", destination: "203.0.113.10", protocol: "HTTPS", info: "GET / (encrypted)", size: "400 B", color: "bg-purple-500" },
    ],
    nodes: [
      { id: "client", label: "کلاینت", ip: "192.168.1.10", x: 100, y: 220 },
      { id: "server", label: "وب‌سرور امن", ip: "203.0.113.10", x: 480, y: 220 },
    ],
  },
];

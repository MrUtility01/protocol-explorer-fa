"use client";

import { useState, useEffect, useCallback } from "react";
import { protocols, Protocol } from "@/data/protocols";

function cx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [selected, setSelected] = useState<Protocol>(protocols[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = protocols.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.nameFa.includes(search) ||
      p.shortDesc.includes(search)
  );

  const playNext = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= selected.packets.length) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [selected.packets.length]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(playNext, 1200 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed, playNext]);

  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const selectProtocol = (p: Protocol) => {
    setSelected(p);
    reset();
  };

  return (
    <div className="h-screen flex flex-col bg-[#0b1220] text-slate-200 overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0f172a]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
            PE
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">کاوشگر پروتکل</h1>
            <p className="text-xs text-slate-400">یادگیری نحوه کار اینترنت</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline">نسخه فارسی ساده · الهام‌گرفته از Protocol Explorer</span>
          <span className="px-2 py-1 rounded bg-slate-800">FA</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-l border-slate-800 bg-[#0f172a] flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <span className="absolute right-3 top-2.5 text-slate-500 text-sm">🔍</span>
              <input
                type="text"
                placeholder="جستجوی پروتکل..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pr-9 pl-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <p className="px-2 py-1 text-xs font-medium text-slate-500">پروتکل‌های اینترنت</p>
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => selectProtocol(p)}
                className={cx(
                  "w-full text-right px-3 py-2.5 rounded-lg transition-colors",
                  selected.id === p.id
                    ? "bg-blue-600/20 border border-blue-500/50 text-blue-300"
                    : "hover:bg-slate-800 border border-transparent"
                )}
              >
                <div className="font-medium text-sm">{p.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{p.nameFa} · {p.shortDesc}</div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 relative network-grid overflow-hidden">
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <span className="text-xs bg-slate-900/80 px-2 py-1 rounded border border-slate-700">
                لایه: {selected.layer}
              </span>
            </div>

            <svg className="w-full h-full" viewBox="0 0 600 420">
              {selected.nodes.map((node, i) => {
                if (i === 0) return null;
                const prev = selected.nodes[0];
                return (
                  <line
                    key={"line-" + node.id}
                    x1={prev.x}
                    y1={prev.y}
                    x2={node.x}
                    y2={node.y}
                    stroke="#334155"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                );
              })}

              {selected.nodes.map((node) => (
                <g key={node.id}>
                  <rect
                    x={node.x - 50}
                    y={node.y - 30}
                    width="100"
                    height="60"
                    rx="8"
                    fill="#1e293b"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                  />
                  <text x={node.x} y={node.y - 5} textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">
                    {node.label}
                  </text>
                  <text x={node.x} y={node.y + 14} textAnchor="middle" fill="#94a3b8" fontSize="11">
                    {node.ip}
                  </text>
                </g>
              ))}

              {selected.packets.slice(0, currentStep).map((pkt, idx) => {
                const fromNode = selected.nodes[0];
                const toNode =
                  selected.nodes[Math.min(idx + 1, selected.nodes.length - 1)] ||
                  selected.nodes[selected.nodes.length - 1];
                const progress = Math.min(1, (currentStep - idx) * 0.5);
                const x = fromNode.x + (toNode.x - fromNode.x) * progress;
                const y = fromNode.y + (toNode.y - fromNode.y) * progress;
                const color =
                  pkt.protocol === "DNS"
                    ? "#3b82f6"
                    : pkt.protocol === "TCP"
                    ? "#22c55e"
                    : pkt.protocol === "TLS" || pkt.protocol === "HTTPS"
                    ? "#f97316"
                    : "#a855f7";
                return (
                  <circle
                    key={pkt.id}
                    cx={x}
                    cy={y}
                    r="8"
                    fill={color}
                    className="packet-dot"
                    opacity={0.9}
                  />
                );
              })}
            </svg>
          </div>

          <div className="border-t border-slate-800 bg-[#0f172a]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                >
                  {isPlaying ? "⏸ توقف" : "▶ پخش"}
                </button>
                <button
                  onClick={playNext}
                  className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-sm transition"
                >
                  ⏭ گام
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-sm transition"
                >
                  ↺ بازنشانی
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">سرعت:</span>
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={cx(
                      "px-2 py-1 rounded",
                      speed === s ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto max-h-48">
              <table className="w-full text-sm">
                <thead className="bg-slate-900 sticky top-0">
                  <tr className="text-slate-400 text-xs">
                    <th className="px-3 py-2 text-right">#</th>
                    <th className="px-3 py-2 text-right">زمان</th>
                    <th className="px-3 py-2 text-right">مبدأ</th>
                    <th className="px-3 py-2 text-right">مقصد</th>
                    <th className="px-3 py-2 text-right">پروتکل</th>
                    <th className="px-3 py-2 text-right">اطلاعات</th>
                    <th className="px-3 py-2 text-right">اندازه</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.packets.map((pkt, idx) => (
                    <tr
                      key={pkt.id}
                      className={cx(
                        "border-t border-slate-800 transition-colors",
                        idx < currentStep ? "bg-slate-800/40" : "opacity-40"
                      )}
                    >
                      <td className="px-3 py-1.5">
                        <span
                          className={cx(
                            "inline-flex w-5 h-5 items-center justify-center rounded-full text-xs text-white",
                            pkt.color
                          )}
                        >
                          {pkt.id}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 font-mono text-xs">{pkt.time}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{pkt.source}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{pkt.destination}</td>
                      <td className="px-3 py-1.5 font-medium">{pkt.protocol}</td>
                      <td className="px-3 py-1.5 text-slate-300">{pkt.info}</td>
                      <td className="px-3 py-1.5 text-slate-400">{pkt.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <aside className="w-72 border-r border-slate-800 bg-[#0f172a] overflow-y-auto p-4 shrink-0">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">نمای کلی پروتکل</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-blue-400">{selected.name}</h3>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">فعال</span>
              </div>
              <p className="text-sm text-slate-300">{selected.nameFa}</p>
            </div>

            <p className="text-sm leading-relaxed text-slate-300">{selected.overview}</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">لایه</span>
                <span>{selected.layer}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">پورت پیش‌فرض</span>
                <span>{selected.port}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">انتقال</span>
                <span>{selected.transport}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">فرمت داده</span>
                <span>{selected.dataFormat}</span>
              </div>
              {selected.methods && (
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">متدهای رایج</span>
                  <span className="text-left">{selected.methods}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">تعریف‌شده در</span>
                <span className="text-left text-xs">{selected.definedIn}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">مراحل</h4>
              <ol className="space-y-2">
                {selected.steps.map((step) => (
                  <li
                    key={step.id}
                    className={cx(
                      "flex gap-2 text-sm p-2 rounded-lg",
                      currentStep >= step.id ? "bg-blue-600/10 text-blue-200" : "text-slate-400"
                    )}
                  >
                    <span className="font-mono text-xs mt-0.5">{step.id}</span>
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs opacity-80">{step.description}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

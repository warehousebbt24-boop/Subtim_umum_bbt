// components/calendarstep.tsx
import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export type SelectedRange = {
  start: Date | null;
  end?: Date | null;
};

type Props = {
  selectedDates?: SelectedRange;
  onSelectDates: (range: SelectedRange) => void;
  onNext: () => void;
  onPeriodeChange?: (p: number) => void;
  defaultPeriode?: number;
  onUnitKerjaChange?: (unit: string) => void;
};

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function CalendarStep({
  selectedDates,
  onSelectDates,
  onNext,
  onPeriodeChange,
  defaultPeriode = 30,
  onUnitKerjaChange,
}: Props) {
  const [periode, setPeriode] = useState<number>(defaultPeriode);
  const [unitKerja, setUnitKerja] = useState<string>("");
  const [fullSet, setFullSet] = useState<Set<string>>(new Set());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (!unitKerja) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/tanggal-tersedia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ unitKerja, periode }),
        });
        const json = await res.json();
        const dates: string[] = Array.isArray(json?.fullDates) ? json.fullDates : [];
        const set = new Set<string>(dates);
        setFullSet(set);
      } catch (e) {
        console.error("Error fetching calendar ", e);
        setErrorMsg("Gagal memuat data ketersediaan tanggal.");
      } finally {
        setLoading(false);
      }
    })();
  }, [unitKerja, periode]);

  useEffect(() => {
    onPeriodeChange?.(periode);
  }, [periode, onPeriodeChange]);

  function isValidRange(start: Date, p: number, full: Set<string>, minDate: Date) {
    const startLocal = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    if (startLocal < minDate) return false;

    for (let i = 0; i < p; i++) {
      const d = new Date(startLocal.getFullYear(), startLocal.getMonth(), startLocal.getDate() + i);
      const iso = toISO(d);
      if (full.has(iso)) return false;
    }
    return true;
  }

  const handleDayClick = (day: Date) => {
    setErrorMsg(null);

    if (!unitKerja) {
      setErrorMsg("Pilih unit kerja terlebih dahulu.");
      return;
    }

    const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());

    if (start < today) {
      setErrorMsg("Tidak bisa memilih tanggal di masa lalu.");
      return;
    }

    if (!isValidRange(start, periode, fullSet, today)) {
      setErrorMsg(
        `Rentang magang ${periode} hari dari ${start.toLocaleDateString()} menabrak tanggal yang sudah penuh di unit ${unitKerja}. Silakan pilih tanggal lain.`
      );
      return;
    }

    const end = new Date(start);
    end.setDate(start.getDate() + periode - 1);
    onSelectDates({ start, end });
  };

  const isDateDisabled = (date: Date) => {
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return localDate < today || !isValidRange(localDate, periode, fullSet, today);
  };

  const selectedRange = selectedDates?.start && selectedDates.end
    ? { from: selectedDates.start, to: selectedDates.end }
    : undefined;

  const modifiers = {
    full: (date: Date) => fullSet.has(toISO(date)),
    selectedRange,
    past: { before: today },
  };

  const modifiersStyles = {
    full: { backgroundColor: "#1a1a1a", color: "white", opacity: 0.7 },
    selectedRange: { backgroundColor: "#b4f8c8", color: "#0f3e28", borderRadius: 6 },
    past: { backgroundColor: "#ffe6e6", color: "#991b1b", opacity: 0.5 },
  };

  return (
    <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-xl p-4 sm:p-6 transition-all duration-300">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
          Pilih Periode Magang
        </h2>
        <p className="text-gray-600 text-sm mt-1">Pilih unit kerja dan tanggal mulai</p>
      </div>

      {/* Unit Kerja */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <label className="block text-xs font-medium text-blue-900 mb-2">Unit Kerja Tujuan</label>
        <select
          value={unitKerja}
          onChange={(e) => {
            const val = e.target.value;
            setUnitKerja(val);
            onUnitKerjaChange?.(val);
            onSelectDates({ start: null, end: null });
            setErrorMsg(null);
          }}
          className="w-full px-3 py-2.5 bg-white border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">-- Pilih Unit Kerja --</option>
          <option value="Subtim Umum">Subtim Umum</option>
          <option value="Subtim Bimtek">Subtim Bimtek</option>
          <option value="Subtim PBJL">Subtim PBJL</option>
          <option value="Subtim Pemasaran">Subtim Pemasaran</option>
          <option value="Subtim Bimtek dan Konsultas">Subtim Bimtek dan Konsultasi</option>
          <option value="Subtim LPH">Subtim LPH</option>
          <option value="Subtim Keuangan">Subtim Keuangan</option>
          <option value="Subtim Pengujian">Subtim Adm Pengujian</option>
          <option value="Subtim TKDN">Subtim TKDN</option>
          <option value="Subtim Kepegawaian">Subtim Kepegawaian</option>
          <option value="Subtim Sekertaris">Subtim Sekertaris</option>
          <option value="Subtim Humasdatin">Subtim Humasdatin</option>
          <option value="Subtim Legal & Bussines Development">Subtim Legal & Bussines Development</option>
          <option value="Lab Pengujian">Lab Pengujian</option>
          <option value="Lab Lingkungan">Lab Lingkungan</option>
          <option value="Lab Testbed FOPTI">Lab Testbed FOPTI</option>
          <option value="Lab Masker">Lab Masker</option>
          <option value="Lab ISSC">Lab ISSC</option>
        </select>
      </div>

      {/* Durasi Magang */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <label className="block text-xs font-medium text-blue-900 mb-2">Durasi Magang</label>
        <select
          value={periode}
          onChange={(e) => setPeriode(Number(e.target.value))}
          className="w-full px-3 py-2.5 bg-white border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value={30}>1 Bulan</option>
          <option value={60}>2 Bulan</option>
          <option value={90}>3 Bulan</option>
          <option value={120}>4 Bulan</option>
          <option value={150}>5 Bulan</option>
          <option value={180}>6 Bulan</option>
        </select>
        <p className="text-xs text-blue-700 mt-2">
          Pilihan durasi magang tersedia dari 1 bulan hingga 6 bulan.
        </p>
      </div>

      {/* Kalender */}
      <div className="mb-6 overflow-x-auto">
        <style jsx>{`
          /* Atur ukuran kalender di HP */
          .rdp {
            --rdp-cell-size: 36px;
            --rdp-day-font: normal 500 14px/1.2 sans-serif;
            --rdp-nav-button-size: 28px;
          }

          .rdp-month {
            min-width: 280px;
          }

          @media (max-width: 480px) {
            .rdp {
              --rdp-cell-size: 32px;
              --rdp-day-font: normal 500 12px/1.2 sans-serif;
            }
            .rdp-head_cell {
              font-size: 11px;
            }
            .rdp-nav_button {
              width: 24px;
              height: 24px;
            }
          }
        `}</style>
        <DayPicker
          mode="single"
          selected={selectedDates?.start ?? undefined}
          onDayClick={handleDayClick}
          disabled={isDateDisabled}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          captionLayout="dropdown"
          fromYear={2024}
          toYear={2026}
          className="mx-auto"
          classNames={{
            month: "flex flex-col space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-semibold text-gray-800",
            nav: "flex items-center space-x-1",
            nav_button: "h-8 w-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors",
            table: "w-full border-collapse",
            head_cell: "text-xs font-semibold text-gray-500 uppercase py-1.5",
            cell: "text-center",
            day: "h-9 w-9 p-0 font-normal hover:bg-blue-50 rounded-full transition-colors cursor-pointer text-sm",
            day_selected: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:bg-indigo-600",
            day_disabled: "text-gray-400 opacity-60 cursor-not-allowed",
            day_today: "font-bold text-blue-700",
          }}
        />
      </div>

      {/* Loading */}
      {loading && unitKerja && (
        <div className="flex items-center justify-center py-2">
          <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
          <span className="text-xs text-gray-600">Memuat ketersediaan...</span>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-700">
          <strong>Unit kerja:</strong>{" "}
          <span className="font-semibold text-blue-800">{unitKerja || "Belum dipilih"}</span>
        </p>
        <p className="text-xs text-gray-700 mt-1">
          <strong>Tanggal terpilih:</strong>{" "}
          {selectedDates?.start ? (
            <span className="font-semibold text-blue-800">
              {selectedDates.start.toLocaleDateString()} — {selectedDates.end?.toLocaleDateString()}
            </span>
          ) : (
            <span className="text-gray-500">Belum ada tanggal terpilih</span>
          )}
        </p>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-xs">
            <strong>⚠️</strong> {errorMsg}
          </p>
        </div>
      )}

      {/* Tombol Lanjut */}
      <div className="mt-6 text-center">
        <button
          onClick={onNext}
          disabled={!selectedDates?.start || !unitKerja}
          className={`px-6 py-2.5 rounded-lg font-semibold text-white text-sm transition-all duration-300 ${
            selectedDates?.start && unitKerja
              ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow hover:shadow-md"
              : "bg-gray-400 cursor-not-allowed opacity-70"
          }`}
        >
          Lanjut ke Form
        </button>
      </div>
    </div>
  );
}
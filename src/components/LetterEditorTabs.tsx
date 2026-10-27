import React, { useState } from 'react';
import {
  LetterDocument,
  LetterType,
  ParticipantItem,
  PaperSize,
  FontFamily,
  FontSize,
  MarginSize,
} from '../types/letter';
import { LETTER_TYPES_META, getInitialLetterData } from '../data/letterTemplates';
import { generateLetterNumber } from '../utils/numberGenerator';
import {
  FileText,
  User,
  Calendar,
  Settings,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  Layers,
  AlignLeft,
  Printer,
  Download,
} from 'lucide-react';

interface Props {
  document: LetterDocument;
  onChange: (doc: LetterDocument) => void;
  onOpenAiDraft: () => void;
  onPrintDirect: () => void;
  onDownloadPdfDirect: () => void;
  onOpenPrintModal: () => void;
  isDownloadingPdf?: boolean;
}

export const LetterEditorTabs: React.FC<Props> = ({
  document: doc,
  onChange,
  onOpenAiDraft,
  onPrintDirect,
  onDownloadPdfDirect,
  onOpenPrintModal,
  isDownloadingPdf = false,
}) => {
  const [activeTab, setActiveTab] = useState<'template' | 'content' | 'header' | 'layout'>('template');

  // Switch Template
  const handleSelectTemplate = (type: LetterType) => {
    const newDoc = getInitialLetterData(type);
    // Pertahankan preferensi layout user
    newDoc.paperSize = doc.paperSize;
    newDoc.fontFamily = doc.fontFamily;
    newDoc.fontSize = doc.fontSize;
    newDoc.marginSize = doc.marginSize;
    onChange(newDoc);
    setActiveTab('content');
  };

  // Generate new letter number
  const handleRegenerateNumber = () => {
    const meta = LETTER_TYPES_META.find((m) => m.type === doc.type);
    const prefix = meta ? meta.codePrefix : '421.3';
    const newNum = generateLetterNumber(prefix, 'SMAN1');
    onChange({ ...doc, letterNumber: newNum });
  };

  // Participant handlers for Dispensasi / Surat Tugas
  const handleAddParticipant = () => {
    const newItem: ParticipantItem = {
      id: Date.now().toString(),
      name: '',
      role: 'Peserta',
      idNumber: '',
      classOrUnit: '',
    };
    onChange({
      ...doc,
      activity: {
        ...doc.activity,
        participants: [...doc.activity.participants, newItem],
      },
    });
  };

  const handleUpdateParticipant = (id: string, field: keyof ParticipantItem, val: string) => {
    const updated = doc.activity.participants.map((p) =>
      p.id === id ? { ...p, [field]: val } : p
    );
    onChange({
      ...doc,
      activity: {
        ...doc.activity,
        participants: updated,
      },
    });
  };

  const handleRemoveParticipant = (id: string) => {
    onChange({
      ...doc,
      activity: {
        ...doc.activity,
        participants: doc.activity.participants.filter((p) => p.id !== id),
      },
    });
  };

  // Tembusan Handlers
  const handleAddTembusan = () => {
    onChange({
      ...doc,
      tembusan: [...doc.tembusan, ''],
    });
  };

  const handleUpdateTembusan = (index: number, val: string) => {
    const updated = [...doc.tembusan];
    updated[index] = val;
    onChange({ ...doc, tembusan: updated });
  };

  const handleRemoveTembusan = (index: number) => {
    const updated = doc.tembusan.filter((_, i) => i !== index);
    onChange({ ...doc, tembusan: updated });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Tab Switcher (Segmented Control conforming to zero-pill guidelines) */}
      <div className="p-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-1 flex-wrap">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('template')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'template'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pilih Template</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'content'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Isi Data Surat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('header')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'header'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Nomor & Tujuan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('layout')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'layout'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Format Kertas</span>
          </button>
        </div>

        {/* AI Assistant Button */}
        <button
          type="button"
          onClick={onOpenAiDraft}
          title="Tulis otomatis dengan asisten bahasa dinas"
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Susun Otomatis</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-4 md:p-5 overflow-y-auto flex-1 space-y-5">
        {/* TAB 1: PILIH TEMPLATE */}
        {activeTab === 'template' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pilih Jenis Surat Dinas Sekolah
              </h3>
              <p className="text-xs text-slate-500">
                Setiap template telah disesuaikan dengan Tata Naskah Dinas Pendidikan resmi di Indonesia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LETTER_TYPES_META.map((meta) => {
                const isSelected = doc.type === meta.type;
                return (
                  <button
                    key={meta.type}
                    type="button"
                    onClick={() => handleSelectTemplate(meta.type)}
                    className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2 group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-indigo-600">
                          {meta.badge}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 px-1.5 py-0.5 rounded">
                            Aktif
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {meta.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                        {meta.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono">{meta.codePrefix}</span>
                      <span className="text-indigo-600 font-semibold group-hover:underline">
                        Gunakan Template →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ISI DATA SURAT */}
        {activeTab === 'content' && (
          <div className="space-y-5">
            {/* Header info template aktif */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500">Template Aktif:</span>
                <p className="text-xs font-bold text-slate-800">
                  {LETTER_TYPES_META.find((m) => m.type === doc.type)?.title || doc.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('template')}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                Ganti Template
              </button>
            </div>

            {/* FORM SPESIFIK DATA SISWA (Keterangan Aktif / SKKB / Mutasi / Rekomendasi) */}
            {(doc.type === 'keterangan_aktif' ||
              doc.type === 'kelakuan_baik' ||
              doc.type === 'rekomendasi' ||
              doc.type === 'keterangan_pindah') && (
              <div className="space-y-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Data Peserta Didik (Siswa)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Lengkap Siswa *
                    </label>
                    <input
                      type="text"
                      value={doc.student.name}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          student: { ...doc.student, name: e.target.value },
                        })
                      }
                      placeholder="contoh: Muhammad Farhan Pratama"
                      className="w-full text-xs px-3 py-1.5 font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Kelas / Tingkat *
                    </label>
                    <input
                      type="text"
                      value={doc.student.className}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          student: { ...doc.student, className: e.target.value },
                        })
                      }
                      placeholder="contoh: XII MIPA 1 / X-A"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nomor Induk Siswa (NIS)
                    </label>
                    <input
                      type="text"
                      value={doc.student.nis}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          student: { ...doc.student, nis: e.target.value },
                        })
                      }
                      placeholder="232410045"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      NISN (10 Digit Nasional)
                    </label>
                    <input
                      type="text"
                      value={doc.student.nisn}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          student: { ...doc.student, nisn: e.target.value },
                        })
                      }
                      placeholder="0087654321"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tempat, Tanggal Lahir
                    </label>
                    <input
                      type="text"
                      value={doc.student.birthPlaceDate}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          student: { ...doc.student, birthPlaceDate: e.target.value },
                        })
                      }
                      placeholder="Bandung, 18 Mei 2008"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      value={doc.student.gender}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          student: {
                            ...doc.student,
                            gender: e.target.value as 'Laki-laki' | 'Perempuan',
                          },
                        })
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Orang Tua / Wali
                    </label>
                    <input
                      type="text"
                      value={doc.student.parentName}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          student: { ...doc.student, parentName: e.target.value },
                        })
                      }
                      placeholder="H. Bambang Irawan, S.E."
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Pekerjaan Orang Tua
                    </label>
                    <input
                      type="text"
                      value={doc.student.parentJob}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          student: { ...doc.student, parentJob: e.target.value },
                        })
                      }
                      placeholder="PNS / Wiraswasta / Karyawan BUMN"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Alamat Lengkap Siswa
                  </label>
                  <input
                    type="text"
                    value={doc.student.address}
                    onChange={(e) =>
                      onChange({
                        ...doc,
                        student: { ...doc.student, address: e.target.value },
                      })
                    }
                    placeholder="Jl. Dago Asri No. 12, RT 03/RW 09, Coblong, Kota Bandung"
                    className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Maksud / Keperluan Penerbitan Surat *
                  </label>
                  <input
                    type="text"
                    value={doc.student.purpose}
                    onChange={(e) =>
                      onChange({
                        ...doc,
                        student: { ...doc.student, purpose: e.target.value },
                      })
                    }
                    placeholder="contoh: Persyaratan Pengajuan Beasiswa Prestasi dan Tunjangan Gaji Anak"
                    className="w-full text-xs px-3 py-1.5 font-medium bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* FORM SPESIFIK RAPAT / UNDANGAN ORTU */}
            {doc.type === 'undangan_ortu' && (
              <div className="space-y-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Jadwal & Agenda Rapat</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Hari, Tanggal *
                    </label>
                    <input
                      type="text"
                      value={doc.meeting.dayDate}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          meeting: { ...doc.meeting, dayDate: e.target.value },
                        })
                      }
                      placeholder="Sabtu, 15 November 2026"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Waktu / Jam Pelaksanaan *
                    </label>
                    <input
                      type="text"
                      value={doc.meeting.time}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          meeting: { ...doc.meeting, time: e.target.value },
                        })
                      }
                      placeholder="08.30 s.d. 11.30 WIB"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tempat Pelaksanaan *
                  </label>
                  <input
                    type="text"
                    value={doc.meeting.place}
                    onChange={(e) =>
                      onChange({
                        ...doc,
                        meeting: { ...doc.meeting, place: e.target.value },
                      })
                    }
                    placeholder="Aula Graha Cendekia SMA Negeri 1 Bandung"
                    className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Acara / Agenda Pembahasan *
                  </label>
                  <input
                    type="text"
                    value={doc.meeting.agenda}
                    onChange={(e) =>
                      onChange({
                        ...doc,
                        meeting: { ...doc.meeting, agenda: e.target.value },
                      })
                    }
                    placeholder="Rapat Pleno Program Pembelajaran Semester Genap & Sosialisasi SNBP"
                    className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Catatan Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    value={doc.meeting.notes}
                    onChange={(e) =>
                      onChange({
                        ...doc,
                        meeting: { ...doc.meeting, notes: e.target.value },
                      })
                    }
                    placeholder="Mengingat pentingnya agenda tersebut, dimohon Bapak/Ibu hadir tepat waktu."
                    className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* FORM SPESIFIK PANGGILAN ORANG TUA */}
            {doc.type === 'panggilan_ortu' && (
              <div className="space-y-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Jadwal Menghadap Guru BK / Wali Kelas</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Siswa yang Bersangkutan *
                    </label>
                    <input
                      type="text"
                      value={doc.parentCall.studentName}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          parentCall: { ...doc.parentCall, studentName: e.target.value },
                        })
                      }
                      placeholder="Rian Hidayat"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Kelas
                    </label>
                    <input
                      type="text"
                      value={doc.parentCall.className}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          parentCall: { ...doc.parentCall, className: e.target.value },
                        })
                      }
                      placeholder="XI IPS 2"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Hari, Tanggal Panggilan
                    </label>
                    <input
                      type="text"
                      value={doc.parentCall.dayDate}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          parentCall: { ...doc.parentCall, dayDate: e.target.value },
                        })
                      }
                      placeholder="Kamis, 5 November 2026"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Waktu / Jam
                    </label>
                    <input
                      type="text"
                      value={doc.parentCall.time}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          parentCall: { ...doc.parentCall, time: e.target.value },
                        })
                      }
                      placeholder="09.00 WIB"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Menghadap Kepada
                    </label>
                    <input
                      type="text"
                      value={doc.parentCall.meetWith}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          parentCall: { ...doc.parentCall, meetWith: e.target.value },
                        })
                      }
                      placeholder="Koordinator Bimbingan dan Konseling (BK)"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tempat / Ruangan
                    </label>
                    <input
                      type="text"
                      value={doc.parentCall.room}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          parentCall: { ...doc.parentCall, room: e.target.value },
                        })
                      }
                      placeholder="Ruang Layanan BK Lt. 2"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Perihal / Keperluan Konsultasi
                  </label>
                  <textarea
                    rows={2}
                    value={doc.parentCall.reason}
                    onChange={(e) =>
                      onChange({
                        ...doc,
                        parentCall: { ...doc.parentCall, reason: e.target.value },
                      })
                    }
                    placeholder="Konsultasi berkala terkait kehadiran belajar dan penguatan motivasi akademik siswa."
                    className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            )}

            {/* FORM SPESIFIK DISPENSASI / TUGAS & TABEL PESERTA */}
            {(doc.type === 'dispensasi_lomba' || doc.type === 'surat_tugas') && (
              <div className="space-y-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Rincian Kegiatan & Delegasi</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nama Kegiatan / Agenda *
                    </label>
                    <input
                      type="text"
                      value={doc.activity.activityName}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          activity: { ...doc.activity, activityName: e.target.value },
                        })
                      }
                      placeholder="Olimpiade Sains Nasional (OSN) Tingkat Provinsi"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Penyelenggara
                    </label>
                    <input
                      type="text"
                      value={doc.activity.organizer}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          activity: { ...doc.activity, organizer: e.target.value },
                        })
                      }
                      placeholder="Balai Pengembangan Talenta Indonesia (BPTI)"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tanggal Pelaksanaan
                    </label>
                    <input
                      type="text"
                      value={doc.activity.dateRange}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          activity: { ...doc.activity, dateRange: e.target.value },
                        })
                      }
                      placeholder="18 s.d. 22 November 2026"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Lokasi / Tempat
                    </label>
                    <input
                      type="text"
                      value={doc.activity.location}
                      onChange={(e) =>
                        onChange({
                          ...doc,
                          activity: { ...doc.activity, location: e.target.value },
                        })
                      }
                      placeholder="Sasana Budaya Ganesha (Sabuga), Bandung"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Daftar Delegasi / Peserta */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-800 uppercase">
                      Daftar Peserta / Anggota Kontingen ({doc.activity.participants.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddParticipant}
                      className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Peserta</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {doc.activity.participants.map((p, idx) => (
                      <div
                        key={p.id}
                        className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center gap-2"
                      >
                        <span className="text-xs font-mono text-slate-400 w-5 text-center">
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => handleUpdateParticipant(p.id, 'name', e.target.value)}
                          placeholder="Nama Lengkap"
                          className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          value={p.idNumber}
                          onChange={(e) => handleUpdateParticipant(p.id, 'idNumber', e.target.value)}
                          placeholder="NISN / NIP"
                          className="w-28 text-xs px-2 py-1 border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          value={p.classOrUnit}
                          onChange={(e) =>
                            handleUpdateParticipant(p.id, 'classOrUnit', e.target.value)
                          }
                          placeholder="Kelas / Mapel"
                          className="w-24 text-xs px-2 py-1 border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          value={p.role}
                          onChange={(e) => handleUpdateParticipant(p.id, 'role', e.target.value)}
                          placeholder="Peran (Peserta / Pembimbing)"
                          className="w-36 text-xs px-2 py-1 border border-slate-200 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipant(p.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PARAGRAF PEMBUKA, ISI, DAN PENUTUP */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Kalimat / Paragraf Pembuka
                </label>
                <textarea
                  rows={2}
                  value={doc.opening}
                  onChange={(e) => onChange({ ...doc, opening: e.target.value })}
                  placeholder="Dengan hormat, sehubungan dengan..."
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Paragraf Penjelasan Tambahan / Inti Surat
                </label>
                <textarea
                  rows={3}
                  value={doc.mainParagraph}
                  onChange={(e) => onChange({ ...doc, mainParagraph: e.target.value })}
                  placeholder="Isi utama penjelasan surat..."
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Kalimat / Paragraf Penutup
                </label>
                <textarea
                  rows={2}
                  value={doc.closing}
                  onChange={(e) => onChange({ ...doc, closing: e.target.value })}
                  placeholder="Demikian surat ini kami sampaikan, atas perhatian dan kerja sama..."
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOMOR & TUJUAN */}
        {activeTab === 'header' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Nomor Surat, Tanggal, & Alamat Tujuan
              </h3>
              <p className="text-xs text-slate-500">
                Pengaturan penomoran tata naskah dinas dan penerima surat.
              </p>
            </div>

            <div className="space-y-3">
              {/* Nomor Surat & Regenerate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Nomor Surat Resmi *
                  </label>
                  <button
                    type="button"
                    onClick={handleRegenerateNumber}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Buat Nomor Baru Otomatis</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={doc.letterNumber}
                  onChange={(e) => onChange({ ...doc, letterNumber: e.target.value })}
                  placeholder="421.3 / 115 / SMAN1 / X / 2026"
                  className="w-full text-xs px-3 py-2 font-mono font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kota Tempat Dibuat
                  </label>
                  <input
                    type="text"
                    value={doc.placeCity}
                    onChange={(e) => onChange({ ...doc, placeCity: e.target.value })}
                    placeholder="Bandung"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Tanggal Surat
                  </label>
                  <input
                    type="text"
                    value={doc.letterDate}
                    onChange={(e) => onChange({ ...doc, letterDate: e.target.value })}
                    placeholder="27 Oktober 2026"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Lampiran
                  </label>
                  <input
                    type="text"
                    value={doc.attachmentCount}
                    onChange={(e) => onChange({ ...doc, attachmentCount: e.target.value })}
                    placeholder="- atau 1 (Satu) Berkas"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Perihal / Hal *
                  </label>
                  <input
                    type="text"
                    value={doc.subject}
                    onChange={(e) => onChange({ ...doc, subject: e.target.value })}
                    placeholder="contoh: Surat Keterangan Aktif Belajar"
                    className="w-full text-xs px-3 py-2 font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Penerima */}
              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Ditujukan Kepada (Yth.) *
                </label>
                <input
                  type="text"
                  value={doc.recipientName}
                  onChange={(e) => onChange({ ...doc, recipientName: e.target.value })}
                  placeholder="Yth. Bapak/Ibu Pimpinan Instansi / Orang Tua Siswa"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Lokasi Penerima
                </label>
                <input
                  type="text"
                  value={doc.recipientLocation}
                  onChange={(e) => onChange({ ...doc, recipientLocation: e.target.value })}
                  placeholder="di Tempat / di Bandung"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Tembusan */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Tembusan Surat (Opsional)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTembusan}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    + Tambah Tembusan
                  </button>
                </div>

                <div className="space-y-1.5">
                  {doc.tembusan.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 w-4 text-center">{idx + 1}.</span>
                      <input
                        type="text"
                        value={t}
                        onChange={(e) => handleUpdateTembusan(idx, e.target.value)}
                        placeholder="contoh: Kepala Cabang Dinas Pendidikan Wilayah VII"
                        className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTembusan(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FORMAT KERTAS & TATA LETAK */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pengaturan Kertas & Tata Letak Dokumen
              </h3>
              <p className="text-xs text-slate-500">
                Sesuaikan ukuran kertas sesuai standar percetakan atau arsip sekolah.
              </p>
            </div>

            {/* Ukuran Kertas */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ukuran Kertas Dokumen
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'A4', label: 'A4 (Standar)', desc: '210 × 297 mm' },
                  { id: 'F4', label: 'F4 / Folio', desc: '215 × 330 mm' },
                  { id: 'Letter', label: 'Letter', desc: '216 × 279 mm' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onChange({ ...doc, paperSize: item.id as PaperSize })}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      doc.paperSize === item.id
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Dokumen */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jenis Tipografi Dokumen
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ ...doc, fontFamily: 'serif' })}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    doc.fontFamily === 'serif'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold font-serif">Serif (Times New Roman / Tinos)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Standar resmi tata naskah dinas</div>
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ ...doc, fontFamily: 'sans' })}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    doc.fontFamily === 'sans'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold font-sans">Sans (Plus Jakarta / Arial)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Tampilan modern & minimalis</div>
                </button>
              </div>
            </div>

            {/* Ukuran Font & Margin */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ukuran Teks Dokumen
                </label>
                <select
                  value={doc.fontSize}
                  onChange={(e) => onChange({ ...doc, fontSize: e.target.value as FontSize })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="sm">Kompak / Hemat Tempat (11.5pt - Muat 1 Lembar)</option>
                  <option value="base">Standar Baku Naskah Dinas (12.5pt)</option>
                  <option value="lg">Besar (13.5pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Margin Tepi Kertas
                </label>
                <select
                  value={doc.marginSize}
                  onChange={(e) => onChange({ ...doc, marginSize: e.target.value as MarginSize })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="compact">Kompak (Sempit / Pas 1 Halaman)</option>
                  <option value="standard">Standar Dinas Resmi</option>
                  <option value="wide">Lebar</option>
                </select>
              </div>
            </div>

            {/* Toggles Kop & Garis */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <span className="text-xs font-bold text-slate-800">Komponen Kop Surat</span>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={doc.showKop}
                  onChange={(e) => onChange({ ...doc, showKop: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Tampilkan Kop Surat Resmi (Kepala Surat)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={doc.showDoubleLine}
                  onChange={(e) => onChange({ ...doc, showDoubleLine: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Garis Ganda Tebal-Tipis Pembatas Kop</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Pinned Bottom Print & PDF Action Strip */}
      <div className="p-3 bg-gradient-to-r from-slate-50 to-indigo-50/50 border-t border-slate-200 shrink-0 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onOpenPrintModal}
          title="Pengaturan Kertas & Cetak Lengkap"
          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg border border-slate-200 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            type="button"
            onClick={onPrintDirect}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak Langsung</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPdfDirect}
            disabled={isDownloadingPdf}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloadingPdf ? 'Menyiapkan...' : 'Unduh PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
